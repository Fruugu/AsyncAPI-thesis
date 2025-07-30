const {Parser, fromFile} = require('@asyncapi/parser');
const parser = new Parser();

let parsedAsyncAPIDocument;

async function parseAsyncAPIDocument() {
    console.log('Parsing AsyncAPI document...')
    const {document, diagnostics} = await fromFile(parser, './asyncapi.yaml').parse();

    if (diagnostics.length > 0) {
        console.error('Error parsing AsyncAPI document\n', diagnostics);
        process.exit(1);
    }
    console.log('AsyncAPI document successfully validated');

    parsedAsyncAPIDocument = document;
}

async function getParsedDocument() {
    if (!parsedAsyncAPIDocument) await parseAsyncAPIDocument();
    return parsedAsyncAPIDocument;
}

function compareChannelToTopic(pattern, target) {
    // Convert the pattern to a regular expression, replacing {parameter} with a capturing group
    const regexPattern = pattern.replace(/{[^}]+}/g, '([^/]+)');

    // Create a regular expression with the pattern
    const regex = new RegExp(`^${regexPattern}$`);

    // Test if the target string matches the regular expression
    return regex.test(target);
}

function getMatchingChannel(topic) {
    let matchingChannel;

    const channels = parsedAsyncAPIDocument.allChannels();
    for (const channel of channels) {
        if (compareChannelToTopic(channel.address(), topic)) {
            matchingChannel = channel;
            break;
        }
    }

    if (!matchingChannel) {
        console.log(`Could not find matching channel for topic: ${topic} from AsyncAPIDocument`);
        return null;
    }

    return matchingChannel;
}

async function getTopicData(topic) {
    if (!parsedAsyncAPIDocument) await parseAsyncAPIDocument();
    const matchingChannel = getMatchingChannel(topic);

    // Extract required information from asyncAPI document for validation and calling correct handler function
    const ops = matchingChannel.operations();
    const channel = matchingChannel.id();
    const key = ops[0].messages()[0].id();
    const action = matchingChannel.operations()[0].action();
    const operation = matchingChannel.operations()[0].id();

    // Return object containing necessary information for validating message and calling the correct handler function
    return {
        ops: ops,
        channel: channel,
        key: key,
        action: action,
        operation: operation
    }
}

async function parseTopicParameters(topic) {
    if (!parsedAsyncAPIDocument) await parseAsyncAPIDocument();
    const matchingChannelAddress = getMatchingChannel(topic).address();

    const topicParts = topic.split('/');
    const matchingChannelParts = matchingChannelAddress.split('/');

    if (topicParts.length !== matchingChannelParts.length) {
        return null;
    }

    const parameters = {};

    for (let i = 0; i < matchingChannelParts.length; i++) {
        const matchingChannelPart = matchingChannelParts[i];
        const topicPart = topicParts[i];

        if (/^{.*}$/.test(matchingChannelPart)) {
            const paramName = matchingChannelPart.slice(1, -1);
            parameters[paramName] = topicPart;
        } else {
            if (topicPart !== matchingChannelPart) {
                return null;
            }
        }
    }

    return parameters;
}

// Returns array of all topics which have mqtt as protocol in one of their defined servers.
// Topics (called channels in asyncapi.yaml) have parameters in form '{parameter}' in asyncapi.yaml file.
// Single-level wildcard in mqtt is presented by '+' sign. Returned array has parameters replaced with + sign.
async function getAllMqttTopicsByReceive() {
    if (!parsedAsyncAPIDocument) await parseAsyncAPIDocument();

    return parsedAsyncAPIDocument.channels().filterByReceive()
        .filter(channel => channel.servers().some(server => server.protocol() === 'mqtt'))
        .map(channel => channel.address().replace(/\{[^}]+}/g, '+'));
}

module.exports = { getParsedDocument, getTopicData, getAllMqttTopicsByReceive, parseTopicParameters };