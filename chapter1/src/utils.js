/**
 * Converts a hex string to a byte value.
 * Example: '42' => 0x42 <=> 66
 * @param byteAsHexString
 * @returns {number}
 */
const hexStringToByte = (byteAsHexString) => {
  return parseInt(byteAsHexString, 16);
};

/**
 * Converts a byte to a hex string.
 * Example: 66 <=> 0x42 => '42'
 * @param byte
 * @returns {string}
 */
const byteToHexString = (byte) => {
  return (((byte & 0xF0) >> 4).toString(16) + (byte & 0x0F).toString(16)).toLowerCase();
};

/**
 * Converts an array of bytes (Uint8Array) to a pretty Hex String like 'XX:XX:XX:XX'
 * @param bytes
 * @returns {string}
 */
const bytesToPrettyHexString = (bytes) => {
  let hex = '';
  for (let byte of bytes.values()) {
    if (hex.length > 0) {
      hex += ':';
    }
    hex += byteToHexString(byte);
  }
  return hex.toLowerCase();
};

/**
 * Converts an array of bytes (Uint8Array) to a normalized hex String like 'FFFFFFFF'
 * @param bytes
 * @returns {string}
 */
const bytesToHexString = (bytes) => {
  let hex = '';
  for (let byte of bytes.values()) {
    hex += byteToHexString(byte);
  }
  return hex.toLowerCase();
};

const SEPARATORS = new RegExp('[-:]', 'g');

/**
 * Converts a Hex String or a Pretty Hex String to an array of bytes (Uint8Array)
 * @param hexStr
 * @returns {Uint8Array}
 */
const hexStringToBytes = (hexStr) => {
  let str = hexStr.replace(SEPARATORS,'');
  let size = str.length / 2;
  let bytes = new Uint8Array(size);
  for (let i = 0; i < size; ++i) {
    bytes[i] = hexStringToByte(str.substr(2 *  i, 2));
  }
  return bytes;
};

/**
 * Checks whether two arrays of bytes are equal or not.
 * @param a
 * @param b
 * @returns {boolean}
 */
const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

/**
 * Converts a pretty hex string 'FF:FF:FF:FF' to a normalized hex string 'FFFFFFFF'
 * @param str
 * @returns {*}
 */
const normalizeHexString = (str) => {
  return str.replace(SEPARATORS, '').toLowerCase();
};

module.exports = {
  hexStringToBytes,
  byteToHexString,
  hexStringToByte,
  bytesToPrettyHexString,
  bytesToHexString,
  arraysEqual,
  normalizeHexString
};