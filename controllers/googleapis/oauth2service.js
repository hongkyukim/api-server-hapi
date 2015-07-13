var google = require('googleapis');
var logger = require('../../utils/logger')
var urlshortener = google.urlshortener('v1');

var params = { shortUrl: 'http://goo.gl/xKbRu3' };

// get the long url of a shortened url

urlshort = function() {
	logger.logInfo('visit to oauth2=========');
	urlshortener.url.get(params, function (err, response) {
		logger.logDebug('visit to oauth2=========');
	  if (err) {
	  	logger.logError('err: '+err);
	    console.log('Encountered error', err);
	  } else {
	  	logger.logInfo('visit to oauth2========info=');
	    console.log('Long url is', response.longUrl);
	  }
	});
	logger.logInfo('exit from oauth2=========');
}


exports.oauth2servoce = urlshort
