const { sendMessage } = require('../mqttClient');
const db = require('../../utils/db');
const { parseTopicParameters } = require('../../utils/asyncAPIDocumentParser');

module.exports = async function onTemperatureMeasured(topic, message) {
    db.addData(topic, JSON.parse(message));

    const { temperature } = JSON.parse(message.toString());
    const { roomId } = await parseTopicParameters(topic);

    if (temperature >= 25) {
        await sendMessage(`room/${roomId}/heating/turnOnOff`, JSON.stringify({ command: 'off', sentAt: new Date().toISOString() }));
    } else if (temperature <= 20) {
        await sendMessage(`room/${roomId}/heating/turnOnOff`, JSON.stringify({ command: 'on', sentAt: new Date().toISOString() }));
    }

    console.log('TemperatureMeasured message handled');
}