const step1 = require("./tobeimpl/step1");
const step2 = require("./tobeimpl/step2");
const serialComService = require("./serial-com");
const conf = require("./conf");

const ProcessStep = {
    IDLE: 0,
    SETTING_MODE: 1,
    SETTING_APP_KEY: 2,
    SETTING_APP_EUI: 3,
    STARTING_JOIN_REQUEST: 4,
    WAITING_JOIN_REQUEST_ACCEPTATION: 5,
    CUSTOM: 6
};

let currentStep = ProcessStep.IDLE;

const delay = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const initConnect = async () => {
    console.log("Init connection");
    if(currentStep !== ProcessStep.IDLE) {
        serialComService.sendCommand("at+reset=0");
        serialComService.serialEventEmitter.emit("write-console", "Sent reset command");
    }
    currentStep = ProcessStep.SETTING_MODE;
    await processNextStep();
};


serialComService.serialEventEmitter.on("rx", async (data) => {
    if (isResetResponse(data)) {
        serialComService.serialEventEmitter.emit("reset");
        console.log("reset received")
        currentStep = ProcessStep.IDLE;
        // Do nothing
    } else if (data === "OK") {
        await processNextStep();
    } else if (isModeSetResponse(data)) {
        if (currentStep >= ProcessStep.SETTING_APP_KEY) {
            return;
        }
        console.log("in isModeSetResponse : " + currentStep);
        await processNextStep();
    } else if (isJoinRequestAcceptResponse(data)) {
        serialComService.serialEventEmitter.emit("write-console", "Congrats! you're connected to loraServer");
        serialComService.serialEventEmitter.emit("allow-send-location");
    } else if (isGpsLocationReceiptConfirmation(data)) {
        serialComService.serialEventEmitter.emit("write-console", "GPS Location has been successfully sent. Congrats! HELP IS ON ITS WAY !!");
    } else {
        console.error("Weird thing happened:");
        console.error(data);
    }
});

let stepInProgress = false;

const processNextStep = async () => {
    console.log("current step " + currentStep);
    if (stepInProgress || currentStep === ProcessStep.IDLE) {
        return;
    }
    stepInProgress = true;
    switch (currentStep) {
        case ProcessStep.SETTING_MODE:
            await delay(2000);
            step1.setModeLoraWan();
            serialComService.serialEventEmitter.emit("write-console", "Sent set mode command");
            break;
        case ProcessStep.SETTING_APP_EUI:
            await delay(2000);
            step1.setAppEui();
            serialComService.serialEventEmitter.emit("write-console", "Sent set App EUI command");
            break;
        case ProcessStep.SETTING_APP_KEY:
            await delay(2000);
            step1.setAppKey();
            serialComService.serialEventEmitter.emit("write-console", "Sent set App Key command");
            break;
        case ProcessStep.STARTING_JOIN_REQUEST:
            await delay(2000);
            step1.sendJoinRequest();
            serialComService.serialEventEmitter.emit("write-console", "Sent Join Request command");
            break;
    }
    stepInProgress = false;
    currentStep++;
};

const debug = () => {
    serialComService.debug();
};

const isResetResponse = (response) => {
    return response.indexOf("Welcome to RAK811") !== -1;
};


const isModeSetResponse = (response) => {
    return response.indexOf("Selected LoraWAN 1.0.2 Region: EU868") !== -1;
};


const isJoinRequestAcceptResponse = (response) => {
    return response === "at+recv=3,0,0";
};

const isGpsLocationReceiptConfirmation = (response) => {
    return response === "at+recv=2,0,0";
};

const fireCustomCmd = (value) => {
    currentStep = ProcessStep.CUSTOM;
    if (value.toString().toLowerCase().startsWith("at+")) {
        serialComService.sendCommand(value);
    } else {
        serialComService.serialEventEmitter.emit("write-console-error", "invalid AT command...");
    }
};

const sendGpsLocation = () => {
    console.debug("Setting GPS Location");
    const gpsLocation = {
        latitude: conf.latitude,
        longitude:conf.longitude,
        altitudeInCm: conf.altitudeAsCm
    };
    const gpsData = step2.convertGpsLocationToPayloadData(gpsLocation);
    serialComService.sendPayload({ type: 0, port: 1, data: gpsData });
};

module.exports = {
    initConnect,
    fireCustomCmd,
    sendGpsLocation,
    debug
};
