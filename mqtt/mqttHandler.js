const { mqttClient } = require("./mqttClient");
const { handleIncomingMessage } = require("./messageHandler");

mqttClient.on('connect', () => {
    console.log('Connected to Mosquitto Broker');
});

mqttClient.on('reconnect', () => {
    console.log('Connection to Mosquitto Broker is lost, trying to reconnect...');
});

// Handle incoming MQTT messages
mqttClient.on('message', async (topic, message, packet) => {
    await handleIncomingMessage(topic, message);
});
