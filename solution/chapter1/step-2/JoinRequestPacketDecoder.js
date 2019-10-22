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
        return this.payload && this.payload.readInt8(0) === 0x00;
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
        let request = {
            appEUI: null,
            devEUI: null,
            devNOnce: null,
            mic: null
        };
        request.appEUI = utils.bytesToHexString(this.payload.slice(1, 9).reverse());
        request.devEUI = utils.bytesToHexString(this.payload.slice(9, 17).reverse());
        request.devNOnce = this.payload.slice(17, 19).readUInt16LE(0);
        request.mic = utils.bytesToHexString(this.payload.slice(19, 23).reverse());

        return request;
    }

}


module.exports = JoinRequestPacketDecoder;
