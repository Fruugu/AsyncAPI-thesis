const express = require('express');
require("./mqtt/mqttHandler");
const { EXPRESS_PORT } = require('./utils/config');
const temperatureHistoryRouter = require('./http/routes/temperatureHistory');
const path = require('path');
const Generator = require("@asyncapi/generator");

const app = express();

app.use(express.static('./docs'));
app.use(temperatureHistoryRouter);

async function start() {
    const generator = new Generator('@asyncapi/html-template@3.0.0', path.resolve(__dirname, 'docs'));
    await generator.generateFromFile('asyncapi.yaml');

    console.log('Documentation successfully generated');

    app.listen(EXPRESS_PORT, () => {
        console.log(`Express server running on port ${EXPRESS_PORT}`);
    });
}

start().catch((err) => {
    console.log(err);
});