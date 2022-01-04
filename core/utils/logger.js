const winston = require('winston')

const colorizer = winston.format.colorize();
dateFormat = () => {
    return new Date(Date.now()).toUTCString()
}

let customLevels = {
    levels: {
        debug: 0,
        info: 1,
        success: 2,
        warn: 3,
        error: 4
    },
    colors: {
        debug: 'magenta',
        info: 'cyan',
        success: 'green',
        warn: 'yellow',
        error: 'red'
    }
}

class Logger {
    constructor() {
        this.log_data = null
        const logger = winston.createLogger({
            level: 'error',
            levels: customLevels.levels,
            transports: [
                new winston.transports.Console({
                    levels: customLevels.levels,
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.simple(),
                        winston.format.printf(info => {
                            let ts = ''
                            switch (info.level) {
                                case 'debug':
                                    ts = ' ⚙ ';
                                    break;
                                case 'info':
                                    ts = ' 🆗 ';
                                    break;
                                case 'success':
                                    ts = ' ✅ ';
                                    break;
                                case 'error':
                                    ts = ' 🔥 ';
                                    break;
                                case 'warn':
                                    ts = ' ☣ ';
                                    break;
                            }
                            let message = `${dateFormat()} |${ts} ${info.level.toUpperCase()} | ${info.message}`
                            message = info.obj ? message + ` ${info.obj.stack ? info.obj.stack : (typeof(info.obj) === 'object') ? JSON.stringify(info.obj) : info.obj} | ` : message
                            message = this.log_data ? message + ` log_data:${JSON.stringify(this.log_data)} | ` : message
                            return colorizer.colorize(info.level, message)
                        })
                    )
                }),
                new winston.transports.File({
                    filename: './logs/audit/logs.log',
                    handleExceptions: true,
                    json: true,
                    maxsize: 5242880, //5MB
                    maxFiles: 5,
                    colorize: false,
                    levels: customLevels.levels,
                    format: winston.format.printf((info) => {
                        let ts = ''
                        switch (info.level) {
                            case 'debug':
                                ts = ' ⚙ ';
                                break;
                            case 'info':
                                ts = ' 🆗 ';
                                break;
                            case 'error':
                                ts = ' 🔥 ';
                                break;
                            case 'warn':
                                ts = ' ☣ ';
                                break;
                        }
                        let message = `${dateFormat()} |${ts} ${info.level.toUpperCase()} | ${info.message}`
                        message = info.obj ? message + `${info.obj.stack ? info.obj.stack : (typeof(info.obj) === 'object') ? JSON.stringify(info.obj) : info.obj} | ` : message
                        message = this.log_data ? message + `log_data:${JSON.stringify(this.log_data)} | ` : message
                        return message
                    })
                })
            ]
        });

        winston.addColors(customLevels.colors)

        this.logger = logger

        logger.on('logging', function (transport, level, msg, meta) {
            console.log('logged');
        });

        this.logger.stream
    }
    setLogData(log_data) {
        this.log_data = log_data
    }

    async success(message) {
        this.logger.log('success', message);
    }
    async success(message, obj) {
        this.logger.log('success', message, {obj})
    }

    async info(message) {
        this.logger.log('info', message);
    }
    async info(message, obj) {
        this.logger.log('info', message, {obj})
    }

    async warn(message) {
        this.logger.log('warn', message);
    }
    async warn(message, obj) {
        this.logger.log('warn', message, {obj})
    }
    
    async error(message) {
        this.logger.log('error', message);
    }
    async error(message, obj) {
        this.logger.log('error', message, {obj})
    }
    
    async debug(message) {
        if (bot.config.environment === "dev") this.logger.log('debug', message);
    }
    async debug(message, obj) {
        if (bot.config.environment === "dev") this.logger.log('debug', message, {obj})
    }
}

module.exports = Logger
