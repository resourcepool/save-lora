const EventEmitter = require("events");
const SerialPort = require("serialport");

const Readline = SerialPort.parsers.Readline;
const serialEventEmitter = new EventEmitter();
const parser = new Readline({delimiter: "\r\n"});

let port;

const init =() => {


    SerialPort.list((err, ports) => {
        if (err) {
            console.log("ERROR : " + err.message);
            return;
        }

        if (ports.length === 0) {
            console.log("WARN : " + 'No ports discovered');
        }
        ports = ports.filter((port) => {
            return port.manufacturer !== undefined || port.vendorId === "1a86";
        });

        if (ports.length === 0) {
            console.log("WARN : " + 'No wisnode discovered');
        }
        let tty = ports[0].comName;
        return new Promise( (resolve, reject) => {
            port = new SerialPort(tty, {baudRate: 115200}, (err) => {
                if (err) {
                    serialEventEmitter.emit("write-console-error", err.message);
                    serialEventEmitter.emit("write-console-error",  "in case of emergency, open the console, and use takima...");
                    reject(err);
                    return;
                }
                port.pipe(parser);
                port.on('error', function(err) {
                    serialEventEmitter.emit("write-console-error", err.message);
                    console.error(err.message);
                });
                resolve();
            });
        });
    });

};

const destroy = () => {
    return new Promise((resolve, reject) => {
        if (port) {
            port.close((err) => {
                port = null;
                if (err) {
                    reject(err);
                }
                resolve(err);
            });
        }
    });
};


const onDeviceRx = (data) => {
    console.log("[RX] " + data);
    serialEventEmitter.emit("rx", data);
};

const sendCommand = (cmd) => {
    const cmdCompleted = cmd + "\r\n";
    console.log("[TX] " + cmd);
    port.write(cmdCompleted);
    serialEventEmitter.emit("cmd-sent", cmd);
};

const sendPayload = (payload) => {
    const cmd = "at+send=" + payload.type + "," + payload.port + "," + payload.data;
    sendCommand(cmd);
};

const debug = () => {

    SerialPort.list((err, ports) => {
        if (err) {
            console.log("ERROR : " + err.message);
            return;
        }

        if (ports.length === 0) {
            console.log("WARN : " + 'No ports discovered');
        }
        ports = ports.filter((port) => {
            return port.manufacturer !== undefined || port.vendorId === "1a86";
        });

        if (ports.length === 0) {
            console.log("WARN : " + 'No wisnode discovered');
        }
        ports.forEach(port => {
            console.log(port);
        });
    });
};

parser.on("data", onDeviceRx);


module.exports = {
    init,
    destroy,
    serialEventEmitter,
    sendPayload,
    sendCommand,
    debug
};
