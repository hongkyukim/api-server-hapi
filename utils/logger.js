var log4js = require('log4js')
var mylogger = log4js.getLogger('videoapis');
var logger = function() {};

exports.logError = function(msg) {
    mylogger.error(msg);
}
exports.logInfo = function(msg) {
    mylogger.info(msg);
}
exports.logDebug = function(msg) {
    mylogger.debug(msg);
}