cordova.define("org.adlotto.cordova.recheck-screen-orientation.RecheckScreenOrientation", function(require, exports, module) { var exec = require('cordova/exec');

/**
 * Rechecks the orientation of the screen
 * @param successCallback  invoked with a FileSystem object
 * @param errorCallback  invoked if error occurs retrieving file system
 */
module.exports = function(successCallback, errorCallback) {
    exec(successCallback, errorCallback, "RecheckScreenOrientation", 'recheckScreenOrientation',[null]);
};


});
