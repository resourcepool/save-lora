const mqtt = require('mqtt');
const conf = require('../../conf');


/**
 * those are the first methods called by the software. you need to create a mqttclient and connect to it. Then Subscribe to all topics.
 */

/**
 * This method should return a mqttClient CONNECTED.
 *
 * If you need some context to understant where this method is invoked, check the init function in /src/index.js file,
 *
 * AND DO NOT FORGET:
 *  - return the mqtt client at the end of this function.
 *  - use the conf variable which stores all your usefull configuration informations in conf.mqtt.
 *  - You MUST provide your clientId (the one you used when registering your team, also stored in conf.mqtt.clientId) to the mqttClient. If you don't you won't be able to validate the challenge.
 *
 * @returns {MqttClient}
 */
const getConnectedMqttClient = () => {
    let client;

    // You need to create the client (and connect to it)
    // (don't forget to take a look at your conf.js
    // and provide ALL credentials and clientId to connect
    client = mqtt.connect(conf.mqtt.host, {
        username: conf.mqtt.username,
        password: conf.mqtt.password,
        clientId: conf.mqtt.clientId
    });

    return client;
};

/**
 * This function will be called when the client has successfully connected to the remote MQTT Broker.
 * in this function, you need to subscribe to all topics in the Broker.
 * wildcard? good idea. but careful... check mqtt documentation to find out which wildcard to use.
 * @param client the MQTT client
 */
const onClientConnected = (client) => {

    // Subscribe to all topics on the client.
    client.subscribe('#', (err) => {
        if (err) {
            process.exit(1);
        }
    });
};

module.exports = {
    getConnectedMqttClient,
    onClientConnected
};
