"use strict";
const step2 = require("../tobeimpl/step2");

const correctChannel = "01";
const correctType = "88";

const easyGps = {
    latitude: 0,
    longitude: 0,
    altitudeInCm: 0
};
const positiveValuesGps = {
    latitude: 12.3456,
    longitude: 65.4321,
    altitudeInCm: 1234
};
const negativeValuesGps = {
    latitude: 42.3519,
    longitude: -87.9094,
    altitudeInCm: 1000
};
const encodedEasyGps = "000000000000000000";
const encodedPositiveValuesGps = "01e23f09fbf10004d2";
const encodedNegativeValuesGps = "06765ff2960a0003e8";

test('STEP 3 : easy gps location', () => {
    const result = step2.convertGpsLocationToPayloadData(easyGps);
    const channel = result.substring(0, 2);
    const type = result.substring(2, 4);
    const gpsData = result.substring(4);
    expect(channel, "you haven't set the right Data Channel, check the doc").toBe(correctChannel);
    expect(type, "you haven't set the right Data Type, check the doc").toBe(correctType);
    expect(gpsData, "encoded gps location is incorrect").toBe(encodedEasyGps)
});
test('STEP 3 : positive values gps location', () => {

    const result = step2.convertGpsLocationToPayloadData(positiveValuesGps);
    const channel = result.substring(0, 2);
    const type = result.substring(2, 4);
    const gpsData = result.substring(4);
    expect(channel, "you haven't set the right Data Channel, check the doc").toBe(correctChannel);
    expect(type, "you haven't set the right Data Type, check the doc").toBe(correctType);
    expect(gpsData, "encoded gps location is incorrect").toBe(encodedPositiveValuesGps)
});
test('STEP 3 : negative values gps location', () => {

    const result = step2.convertGpsLocationToPayloadData(negativeValuesGps);
    const channel = result.substring(0, 2);
    const type = result.substring(2, 4);
    const gpsData = result.substring(4);
    expect(channel, "you haven't set the right Data Channel, check the doc").toBe(correctChannel);
    expect(type, "you haven't set the right Data Type, check the doc").toBe(correctType);
    expect(gpsData, "encoded gps location is incorrect").toBe(encodedNegativeValuesGps)
});
