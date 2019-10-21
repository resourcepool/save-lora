const wisnodeService = require("./wisnode-process-service");
const serialComService = require("./serial-com");
// const displayText = document.getElementById("wisnode-serial");

serialComService.init();

wisnodeService.initConnect().finally();

serialComService.serialEventEmitter.on("allow-send-location", () => {
    wisnodeService.sendGpsLocation();
});

