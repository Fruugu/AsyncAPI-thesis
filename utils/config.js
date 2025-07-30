require('dotenv').config();

const MQTT_OPTIONS = {
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT,
    clientId: process.env.MQTT_CLIENT_ID ,  // Unique client ID
    username: process.env.MQTT_USERNAME ,   // If authentication is enabled
    password: process.env.MQTT_PASSWORD,    // Corresponding password
}

const EXPRESS_PORT = process.env.EXPRESS_PORT;

module.exports = { MQTT_OPTIONS, EXPRESS_PORT };