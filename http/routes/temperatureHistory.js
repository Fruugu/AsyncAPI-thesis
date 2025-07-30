const temperatureHistoryRouter = require('express').Router();
const db = require('../../utils/db');
const converter = require('json-2-csv');

temperatureHistoryRouter.get('/room/:roomId/temperature/:sensorId/history', (req, res) => {
    const data = db.getDataByTopic(`room/${parseInt(req.params.roomId)}/temperature/${parseInt(req.params.sensorId)}/measured`);
    if (data.length === 0) {
        res.sendStatus(404).end();
        return
    }
    if (req.headers['accept'] === 'text/csv') {
        const csv = converter.json2csv(data);
        res.send(csv);
    } else {
        res.json(data);
    }
});

module.exports = temperatureHistoryRouter;