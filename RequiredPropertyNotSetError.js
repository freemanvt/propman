/**
 * Created by vinhta on 31/12/2015.
 */
var util = require('util');

function RequiredPropertyNotSetError(message, extra) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.extra = extra;
}

util.inherits(RequiredPropertyNotSetError, Error);

module.exports = RequiredPropertyNotSetError;
