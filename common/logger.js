var config = require('../config');
var logger = require('logger')(config.logger);
var ftcomm = require('./ftcommon');

if ( ftcomm.isDebugEnv() ){
  logger.info('This is debug environment', {version: process.versions});
}
else {
  logger.info('This is production environment', {version: process.versions});
}
module.exports = logger;
