var winston = require('winston');

var logger = new (winston.Logger)({
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

module.exports = logger;