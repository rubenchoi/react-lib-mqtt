const mqtt = require('mqtt');

const options = {
    port: 8006,
    host: 'ws://127.0.0.1',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8)
}
const client = mqtt.connect("ws://127.0.0.1:8006", options);

const topic = "topic1";
var topic_list = ["topic1", "topic2", "topic3"];
var timer_id;

client.on('message', function (topic, message, packet) {
    console.log("message is " + message);
    console.log("topic is " + topic);
});

client.on("connect", function () {
    console.log("connected  " + client.connected);
    console.log("subscribing to ", topic_list);
    client.subscribe(topic_list, { qos: 1 });

    timer_id = setInterval(() => { client.publish(topic, "CLIENT_SENDING_TEST_MESSAGE", options); }, 5000);
})

client.on("error", function (error) {
    console.log("Can't connect" + error);
    process.exit(1)
});

