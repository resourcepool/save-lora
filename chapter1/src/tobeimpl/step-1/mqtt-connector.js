const mqtt = require('mqtt');
const conf = require('../../conf');


/**
 * those are the first methods called by the software. you need to create a mqttclient and connect to it. Then Subscribe to all topics.
 */

/**
 * This method should return a mqttClient CONNECTED.
 *
 * If you need some context to understand where this method is invoked, check the init function in /src/index.js file,
 *
 * AND DO NOT FORGET:
 *  - return the mqtt client at the end of this function.
 *  - use the conf variable which stores all your usefull configuration informations in conf.mqtt.
 *  - You MUST provide your clientId (the one you used when registering your team, also stored in conf.mqtt.clientId) to the mqttClient. If you don't you won't be able to validate the challenge.
 *
 * MQTT Client documentation => https://github.com/mqttjs/MQTT.js
 *
 * @returns {MqttClient}
 */
const getConnectedMqttClient = () => {

    let client;

    // TODO
    // You need to create the client (and connect to it)
    // (don't forget to take a look at your conf.js
    // and provide ALL credentials and clientId to connect

    return client;
};



/**
 * This function will be called when the client has successfully connected to the remote MQTT Broker.
 * in this function, you need to subscribe to all topics in the Broker.
 * wildcard? good idea. but careful... check mqtt documentation to find out which wildcard to use.
 * @param client the MQTT client which is already connected
 */
const onClientConnected = (client) => {

    // TODO
    // Subscribe to all topics on the client.

};

module.exports = {
    getConnectedMqttClient,
    onClientConnected
};
