/**
 * Hi, I'm John Doe.
 * I sniffed the App Server interactions last night (the http traffic was not secured... noobs) and managed to find the right Authentication details.
 * I made a small client for you to use with just a few features.
 * Good luck!
 * @type {string}
 */
const Logger = require('../log/logger');
const conf = require('../../conf');
const utils = require("../../utils");
const axios = require('axios');

const authHeader = "Authorization";
const logger = Logger.child({service: 'api'});


const client = axios.create({
  baseURL: conf.loRaServer.baseUrl,
  headers: {[authHeader]: "Bearer " + conf.loRaServer.authToken}
});

const deviceExists = async (devEUI) => {
  try {
    const response = await client.get(`/devices/${utils.normalizeHexString(devEUI)}`);
    logger.debug("Response received", response.data);
    return response;
  } catch (e) {
    if (e.response.status === 404) {
      return false;
    }
    logger.error("Error occured during call to http api", e.message);
    throw e;
  }
};

/**
 * @param device
 * {
 *     devEUI: {string},
 *     applicationID: {string|number},
 *     deviceProfileID: {string},
 *     name: {string},
 *     description: {string}
 * }
 * @returns {Promise<*>}
 */
const createDevice = async (device) => {
  try {
    const response = await client.post('/devices', {device: device});
    logger.debug("Response received", response.data);
    return response;
  } catch (e) {
    logger.error("Error occured during call to http api", e.message);
    throw e;
  }
};

/**
 * @param devEUI string
 * @returns {Promise<boolean>}
 */
const deviceNwkKeyExists = async (devEUI) => {
  try {
    const response = await client.get(`/devices/${utils.normalizeHexString(devEUI)}/keys`);
    logger.debug("Response received", response.data);
    return !!response;
  } catch (e) {
    if (e.response.status === 404) {
      return false;
    }
    logger.error("Error occured during call to http api", e.message);
    throw e;
  }
};


/**
 *
 * @param devEUI string
 * (hex string)
 * @param nwkKey string
 * (hex string)
 * @returns {Promise<*>}
 */
const updateDeviceNwkKey = async (devEUI, nwkKey) => {
  try {
    const response = await client.put(`/devices/${utils.normalizeHexString(devEUI)}/keys`, {
      deviceKeys: {
        devEUI: utils.normalizeHexString(devEUI),
        nwkKey: utils.normalizeHexString(nwkKey)
      }
    });
    logger.debug("Response received", response.data);
    return response;
  } catch (e) {
    logger.error("Error occured during call to http api", e.message);
    throw e;
  }
};

/**
 *
 * @param devEUI string
 * (hex string)
 * @param nwkKey string
 * (hex string)
 * @returns {Promise<*>}
 */
const setDeviceNwkKey = async (devEUI, nwkKey) => {
  try {
    const response = await client.post(`/devices/${utils.normalizeHexString(devEUI)}/keys`, {
      deviceKeys: {
        devEUI: utils.normalizeHexString(devEUI),
        nwkKey: utils.normalizeHexString(nwkKey)
      }
    });
    logger.debug("Response received", response.data);
    return response;
  } catch (e) {
    if (e.response.status === 409) {
      return await updateDeviceNwkKey(utils.normalizeHexString(devEUI), utils.normalizeHexString(nwkKey));
    }
    logger.error("Error occured during call to http api", e.message);
    throw e;
  }
};

module.exports = {
  deviceExists,
  createDevice,
  deviceNwkKeyExists,
  setDeviceNwkKey,
};
