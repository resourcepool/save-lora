const wisnodeService = require("./wisnode-process-service");
const serialComService = require("./serial-com");
const displayText = document.getElementById("wisnode-serial");
const addLineToDisplay = (value) => {
    displayText.textContent += "\r\n" + value;
    displayText.scrollTop = displayText.scrollHeight;
};

serialComService.serialEventEmitter.on("write-console", (msg) => {
    addLineToDisplay("[DEBUG] " + msg);
});

serialComService.serialEventEmitter.on("write-console-error", (msg) => {
    addLineToDisplay("[ERROR] " + msg);
});

serialComService.serialEventEmitter.on("cmd-sent", (msg) => {
    addLineToDisplay("[TX] " + msg);
});
serialComService.serialEventEmitter.on("dev-response-raw", (data) => {
    addLineToDisplay("[DEV] " + data);
});
serialComService.serialEventEmitter.on("rx", (data) => {
    addLineToDisplay("[RX] " + data);
});
serialComService.serialEventEmitter.on("allow-send-location", () => {
    document.getElementById("send_location").disabled = false;
});
serialComService.serialEventEmitter.on("reset", () => {
    displayText.textContent = "";
    document.getElementById("send_location").disabled = true;
});
const fireCustomCmd = () => {
    wisnodeService.fireCustomCmd(document.getElementById("custom-cmd").value);
};


let usbConnected = false;


const disconnectPort = async () => {
    try {
        await serialComService.destroy();
    } catch (e) {
        console.error(e);
    } finally {
        document.getElementById("connect_port").innerText = "Connect USB";
        document.getElementById("connect").disabled = true;
    }
};

document.getElementById("connect_port").addEventListener("click", async () => {
    usbConnected = !usbConnected;
    if (usbConnected) {
        try {
            await serialComService.init();
            document.getElementById("connect").disabled = false;
            document.getElementById("connect_port").innerText = "Disconnect USB";
        } catch (e) {
            await disconnectPort();
        }
    } else {
        await disconnectPort();
    }

});
document.getElementById("connect").addEventListener("click", wisnodeService.initConnect);
document.getElementById("send_location").addEventListener("click", wisnodeService.sendGpsLocation);
document.getElementById("fire-custom-cmd").addEventListener("click", fireCustomCmd);
document.getElementById("logo-takima").addEventListener("click", wisnodeService.debug);
