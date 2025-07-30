const isValidMessage = require('../utils/messageValidator');
const { getTopicData } = require('../utils/asyncAPIDocumentParser');
const onTemperatureMeasured = require("./handlerFunctions/onTemperatureMeasured");

// When adding functionality to the API fill out asyncapi.yaml then create handler function in handlerFunctions folder.
// Handler function has to have exactly two parameters topic and message.
// If you need to send messages in handler functions import mqttClient and use its sendMessage function.
// Import the defined handler function in this file and add mapping to the handlerFunctionMap.
// Handler function will be called based on operation defined in asyncapi.yaml.
// Remember to add 'x-unique-id' field in asyncapi.yaml for the message as it is required for finding the correct operation.
// 'x-unique-id' field should have exactly the same name as the message itself.

const handlerFunctionMap = {
    'onTemperatureMeasured': onTemperatureMeasured,
};

async function handleIncomingMessage(topic, message) {
    // Get topic data for validation and operation
    const topicData = await getTopicData(topic);

    // Check if message is valid
    if (!await isValidMessage(topicData, message)) return;

    // Call correct handler function
    handlerFunctionMap[topicData.operation](topic, message);
}

module.exports = { handleIncomingMessage };