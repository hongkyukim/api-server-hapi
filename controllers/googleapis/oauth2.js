var google = require('googleapis');
var logger = require('../../utils/logger')
var urlshortener = google.urlshortener('v1');

var params = { shortUrl: 'http://goo.gl/xKbRu3' };

var readline = require('readline');
var OAuth2Client = google.auth.OAuth2;
var plus = google.plus('v1');
// Client ID and client secret are available at
// https://code.google.com/apis/console
var CLIENT_ID = '401934283145-kpkkh9rhk4notkn3rcjvimraf981ptrj.apps.googleusercontent.com';
var CLIENT_SECRET = 'Lsf6Ys7CcRQi4GiqyxOoWIp3';
var REDIRECT_URL = 'http://localhost:3000/oauth2callback';
var oauth2Client; 

var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
});



exports.dotest = function() {
	logger.logInfo('call oauth2Client: ');
    oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
    logger.logInfo('oauth2Client created: '+oauth2Client);
    oauth2Client.authenticate(authurl);


    var authurl = oauth2Client.generateAuthUrl({
			access_type: 'offline', // will return a refresh token
			scope: 'https://www.googleapis.com/auth/plus.me' 
			// can be a space-delimited string or an array of scopes
			});

	console.log('Visit the url: ', url);

    return REDIRECT_URL;
    //redirect_to oauth2Client.auth_code.authorize_url(:redirect_uri => 'http://localhost:3000/oauth2callback', :scope => "https://gdata.youtube.com");
    //redirect_to oauth2Client.oauth_client.auth_code.authorize_url(:redirect_uri => 'http://localhost:3000/oauth2callback', :scope => "https://gdata.youtube.com");
}

function getAccessToken(req, reply, oauth2Client, callback) {
	    var code = req.query.code;
        console.log('code: '+code);
		// generate consent page url
		// offline: // will return a refresh token
        // online:  
		
		//rl.question('Enter the code here:', function(code) {
		//	logger.logInfo('code: '+code);
			// request access token
			oauth2Client.getToken(code, function(err, tokens) {
				if( err) {
					callback(err, tokens);
					return;
				}
				logger.logInfo('tokens: '+tokens);
				// set tokens to the client
				// TODO: tokens should be set by OAuth2 client.
				if(tokens == null) {
					logger.logError('Error: tokens is empty');
					callback('no tokens', tokens);
					return;
				}
				
				oauth2Client.setCredentials(tokens);
				callback(null, tokens);
			});
		//});
}

oauth2callback = function(req, reply) {
	logger.logInfo('call oauth2callback: ');
	// retrieve an access token
	getAccessToken(req, reply, oauth2Client, function(err, results) {
		if(err) {
			reply({ msg: 'failed'});
			return;
		}
	    // retrieve user profile
		plus.people.get({ userId: 'me', auth: oauth2Client }, 
             function(err, profile) {
				if (err) {
				     console.log('An error occured in profile: ', err);
				     reply({ msg: 'failed'});
				     return;
				}
				console.log(profile.displayName, ':', profile.tagline);
				reply({msg: 'success'});
			});
	});
	logger.logInfo('oauth2callback created: ');
}


exports.oauth2callback = oauth2callback