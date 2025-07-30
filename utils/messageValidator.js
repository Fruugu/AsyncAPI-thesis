const AsyncApiValidator = require('asyncapi-validator');

let asyncAPIMessageValidator;

async function initializeMessageValidator() {
    asyncAPIMessageValidator = await AsyncApiValidator.fromSource('./asyncapi.yaml', {msgIdentifier: 'x-unique-id'});
}

module.exports = async function isValidMessage(topicData, message) {
    if (!asyncAPIMessageValidator) await initializeMessageValidator();

    try {
        // Convert buffer data to JSON for validation
        const bufferToJson = JSON.parse(message.toString());

        // Validate received data
        return asyncAPIMessageValidator.validate(topicData.key, bufferToJson, topicData.channel, topicData.action);

    } catch (e) {
        console.log(e);
        return false;
    }
}
