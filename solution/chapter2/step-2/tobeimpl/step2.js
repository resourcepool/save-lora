/**
 * In this Step, you need to implement the convertGpsLocationToPayloadData(gpsLocation) method in order to convert the gpsLocation Object to an hexa string representation (following CayenneLpp protocol)
 *
 * the gpsLocation Object looks like this:
 *
 *  const gpsLocation = {
 *      latitude: conf.latitude,
 *      longitude: conf.longitude,
 *      altitudeInCm: conf.altitudeAsCm
 *  }
 *
 * the returned String must be a 22 digits long Hexa String as : 0123456789abcdef012345
 *
 *
 * a few hints:
 *  - the returned String will be used in the AT command as : "at+send=0,1,{your string}". Be careful, the returned String might need to contain more information than only encoded gps values.
 *  - use the tests (`npm test` in chapter2 directory is the command you are looking for)
 *  - don't forget : a gpsLocation contains 3 values, and they are ALL signed! Be careful when converting a decimal value to hexa, you must take care of negative values.
 *  - the altitude is given AS CENTIMETERS. (you may need to convert it as meters... or NOT)
 *  - remember, gpsLocation values are floating point numbers. you want to get integers before trying to convert it to hexa.
 *
 *
 *  So... read the doc, look at examples, use provided tests. And don't hesitate to do a bit of reverse engineering from examples.
 *
 */

const convertToHexa = (rawValue) => {
    if (rawValue < 0) {
        rawValue = 0xFFFFFF + rawValue + 1;
    }
    return rawValue.toString(16).padStart(6, '0');
};

const convertToRaw = (value) => {
    return Math.round(value * 10000);
};

const convertGpsToHexa = (latitude, longitude, altitude) => {
    return convertToHexa(convertToRaw(latitude)) + convertToHexa(convertToRaw(longitude)) + convertToHexa(altitude);
};


const convertGpsLocationToPayloadData = (gpsLocation) => {
    //TODO implement me
    return "0188" + convertGpsToHexa(gpsLocation.latitude, gpsLocation.longitude, gpsLocation.altitudeInCm);
};

module.exports = {
    convertGpsLocationToPayloadData
};
