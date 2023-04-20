import path from "path";

module.exports = function logger(_label: any) {
    return generateLogger(_label);
};

function generateLogger(_label: any) {
    const winston = require("winston");
    const DailyRotateFile = require("winston-daily-rotate-file");

    const logs = process.env.LOGS_DIR;
    let logDir;
    if (logs) logDir = path.join(logs, path.sep);
    const ext = "." + process.env.LOG_EXT;

    const transports = [
        new DailyRotateFile({
            dirname: logDir,
            filename: process.env.APP_LOG + "-%DATE%" + ext,
            maxSize: "1g",
        }),
    ];

    const exceptionHandlers = [
        new DailyRotateFile({
            dirname: logDir,
            filename: process.env.PROC_ERROR_LOG + "-%DATE%" + ext,
            handleExceptions: true,
            humanReadableUnhandledException: true,
        }),
    ];

    const myFormat = winston.format.printf(function (info: any) {
        var meta = "";
        var level = info.level.toUpperCase();
    });

    return winston.createLogger({
        format: winston.format.combine(
            winston.format.label({ label: _label }),
            winston.format.timestamp(),
            myFormat
        ),
        exitOnError: false,
        transports: transports,
        level: process.env.LOG_LEVEL,
        exceptionHandlers: exceptionHandlers,
    });
}
