const api = require('./noedit/api/api');
const utils = require('./utils');
const conf = require('./conf');
const reviewService = require('./noedit/progress/review-service');

const mqttConnector = require('./tobeimpl/step-1/mqtt-connector');

const Logger = require('./noedit/log/logger');

const JoinRequestPacketDecoder = require('./tobeimpl/step-2/JoinRequestPacketDecoder');

const gatewayRxTopicRegex = new RegExp("^gateway/([0-9a-fA-F]+)/rx$");
const timeBeforeTopicSubscription = 2000;
const maxRetriesBeforeFail = 5;

const validAppEUI = utils.hexStringToBytes(conf.user.appEUI);
const validMockAppEUI = utils.hexStringToBytes(conf.user.mockAppEUI);
const deviceEUI = utils.hexStringToBytes(conf.user.deviceEUI);
const deviceNetworkKey = utils.normalizeHexString(conf.user.nwkKey);

const logger = Logger.child({service: 'index'});
let client;

let init = () => {
  reviewService.init();

  client = mqttConnector.getConnectedMqttClient();
  if (!client) {
    logger.error("[Step-1] Please check your implementation of getConnectedMqttClient");
    process.exit(1);
  }
  client.on('connect', async () => {
    // We wait two seconds before calling onClientConnected callback in order to ensure previous steps were validated successfully.
    await delay(timeBeforeTopicSubscription);
    mqttConnector.onClientConnected(client);
  });
  client.on("message", onMessage);
};

/**
 * This function is called when any message is received on any topic
 * @param topic
 * @param message
 */
let onMessage = async (topic, message) => {
  if (!step1Done) {
    step1Done = true;
    logger.log('info', "Congrats! Step 1 is done! You are successfully sniffing all messages from the MQTT Broker.");
  }
  if (!gatewayRxTopicRegex.test(topic)) {
    return;
  }

  let msgDecoder = new JoinRequestPacketDecoder(topic, message);
  if (!msgDecoder.isSupported()) {
    logger.log('verbose', 'msg received is not a JoinRequest, according to your JoinRequestPacketDecoder#isSupported method ;)');
    return;
  }

  // We are only interested in the join request packets.
  // Problem is: those packets are encoded... Therefore we need to use a decoder.
  // You need to implement the PacketDecoder code of course!
  // How? RTFM => README.md
  logger.debug("Join Request identified");
  let decodedJoinRequest = msgDecoder.decode();
  logger.debug("Decoded:" + JSON.stringify(decodedJoinRequest));

  // Congratulations, you are decoding all the join requests of the LoRa network.
  // However, we want to be smart hackers and only activate your friend's device on the specific APP_EUI
  if (isValidAppEUI(decodedJoinRequest.appEUI) && isRightDeviceEUI(decodedJoinRequest.devEUI)) {
    logger.log('verbose', "AppEUI and DevEUI are valid. Will register device");
    if (!await api.deviceExists(decodedJoinRequest.devEUI)) {
      await api.createDevice({
        devEUI: decodedJoinRequest.devEUI,
        applicationID: conf.loRaServer.loRaApplicationId,
        deviceProfileID: conf.loRaServer.rak811DevProfileId,
        name: conf.user.clientId,
        description: '4242'
      });
    }
    if (!await api.deviceNwkKeyExists(decodedJoinRequest.devEUI)) {
      await api.setDeviceNwkKey(decodedJoinRequest.devEUI, deviceNetworkKey);
    }
    logger.log('verbose', "Device registered successfully");
  }
};

/**
 * Check whether the AppEUI of the intercepted message is the one we want to work on
 * @param msgAppEUI string|Uint8Array
 * @returns {boolean}
 */
let isValidAppEUI = (msgAppEUI) => {
  return utils.arraysEqual((typeof msgAppEUI === 'string') ? utils.hexStringToBytes(msgAppEUI) : msgAppEUI, validAppEUI) || utils.arraysEqual((typeof msgAppEUI === 'string') ? utils.hexStringToBytes(msgAppEUI) : msgAppEUI, validMockAppEUI);
};

/**
 * Check whether the DeviceEUI equals the team's device.
 * @param devEUI string|Uint8Array
 * @returns {boolean}
 */
let isRightDeviceEUI = (devEUI) => {
  return utils.arraysEqual((typeof devEUI === 'string') ? utils.hexStringToBytes(devEUI) : devEUI, deviceEUI);
};


/**
 * Asynchronous delay
 * @param ms
 * @returns {Promise}
 */
let delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};


init();

let step1Done = false;
let waiting = 0;
let checkMqttConnection = setInterval(() => {
  if (!step1Done) {
    if (waiting < maxRetriesBeforeFail) {
      waiting++;
      logger.log('info', "waiting for messages from MQTT broker")
    } else {
      logger.log('warn', "you should have received messages from the broker by now, check your parameters")
      process.exit(1);
    }
  } else {
    clearInterval(checkMqttConnection)
  }
}, 3000);
