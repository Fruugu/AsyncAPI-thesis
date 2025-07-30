# AsyncAPI for IoT-Devices
Asynchronous API for IoT-Devices. Application generates html documentation of the API upon starting. Documentation will be available at localhost:EXPRESS_PORT.

## Installation
```sh
npm install
```

## Usage

### MQTT-broker
This project uses MQTT as the communication protocol between the IoT-devices and the application.
You need to setup MQTT-broker for enabling the communication between clients and server.
If you don't want to install local MQTT-broker you can use public test broker provided by Eclipse Foundation at test.mosquitto.org:1883.

### dotenv
This project uses dotenv library for storing sensitive information such as mqtt options. Create .env file at the root of the project and add atleast following values:
```
MQTT_HOST=...
MQTT_PORT=...
EXPRESS_PORT=...
```
### Running the server
To run the project use the following command
```
node server.js
```
