
let database = [
    { topic: "room/5/temperature/5/measured", data: { id: 5, temperature: 25, sentAt: new Date().toISOString() } },
    { topic: "room/5/temperature/5/measured", data: { id: 5, temperature: 22, sentAt: new Date().toISOString() } }
];

function addData(topic, data) {
    if (!Array.isArray(data)) {
        data = [data];
    }

    data.forEach(item => {
        if (topic && item.id != null && item.temperature != null && item.sentAt != null) {
            database.push({
                topic: topic,
                data: {
                    ...item,
                    id: item.id,
                    temperature: item.temperature,
                    sentAt: item.sentAt
                }
            });
        }
    });
}

function getDataByTopic(topic) {
    return database.filter(item => item.topic === topic).map(item => item.data);
}

module.exports = { addData, getDataByTopic };