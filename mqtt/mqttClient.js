const mqtt = require('mqtt');
const { getAllMqttTopicsByReceive, getTopicData} = require("../utils/asyncAPIDocumentParser");
const { MQTT_OPTIONS } = require("../utils/config");
const isValidMessage = require('../utils/messageValidator');

// Create MQTT.js client instance and connect to broker
const mqttClient = mqtt.connect(MQTT_OPTIONS);

const subscribeToTopics = async() => {
    const topics = await getAllMqttTopicsByReceive();

    topics.forEach(topic => {
        mqttClient.subscribe(topic, function (err) {
            if (err) {
                console.log('Error subscribing:', err);
            } else {
                console.log(`Subscribed to ${topic} topic`);
            }
        })
    });
}

const sendMessage = async (topic, message) => {
    // Get topic data for validation and operation
    const topicData = await getTopicData(topic);

    // Check if message is valid
    if (!await isValidMessage(topicData, message)) return;

    // Publish message
    mqttClient.publish(topic, message);
}

subscribeToTopics().catch((err) => {
    console.log(err);
});

module.exports = { mqttClient, sendMessage };