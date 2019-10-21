const utils = require('../../utils');

class JoinRequestPacketDecoder {

    /**
     * If there is a phyPayload, it will be decoded into a Buffer named this.payload
     * @param topic
     * @param msg
     */
    constructor(topic, msg) {
        this.topic = topic;
        try {
            this.msg = JSON.parse(msg.toString());
        } catch (e) {
            // Someone sent a weird payload. Not supposed to happen.
        }

        if (this.msg && this.msg.phyPayload) {
            // We will decode the Base64 phyPayload into a byte Buffer
            this.payload = Buffer.from(this.msg.phyPayload, 'base64');
        }
    }

    /**
     * @returns {boolean}
     *
     * check if the message is indeed a join-request, return true if.. true
     * return false otherwise.
     *
     * you can use this.payload (look at line 20) but check how it is populated and remember...
     * A message without a PHYpayload is NOT a joinRequest.
     * Be careful : this.payload will be UNDEFINED when PHYPayload does not exist.
     */
    isSupported() {
        // TODO Step 2.1
        return false;
    }

    /**
     *
     * decode the payload (you can access it with this.payload),
     * store all information in the request object,
     * then return it.
     *
     * @returns {{mic: {string}, appEUI: {string}, devNOnce: {number}, devEUI: {string}}}
     * Example:
     * {
     *   mic: '25311239',
     *   appEui: '12fa34c542ab4782'
     *   devEui: 'ac133246f17c04b2'
     *   devNonce: 1
     * }
     *
     * Be careful:
     *  - devNOnce IS A NUMBER (not a string)
     *  - remember... LE... if you don't know what LE stands for, read the f*** manual!
     *  - you may want to use utils.bytesToHexString :)
     *  - what's the difference between a signed and an unsigned int?
     */
    decode() {
        // TODO Step 2.2
        let request = {
            appEUI: null,
            devEUI: null,
            devNOnce: null,
            mic: null
        };

        return request;
    }

}


module.exports = JoinRequestPacketDecoder;
