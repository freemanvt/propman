var winston = require('winston');

function NoLogger() {

}

NoLogger.prototype.debug = function() {};
NoLogger.prototype.info = function() {};
NoLogger.prototype.warn = function() {};
NoLogger.prototype.error = function() {};

var logger;

if (process.env.PROPMANLOGGER === 'winston') {
    logger = new (winston.Logger)({
        transports: [
            new winston.transports.Console({
                level: 'debug',
                handleExceptions: true,
                timestamp: true,
                json: false,
                colorize: true
            })
        ]
    });
} else {
    logger = new NoLogger();
}

module.exports = logger;