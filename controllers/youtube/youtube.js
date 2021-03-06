/**
 * Copyright 2015 All Rights Reserved.
 *
 */

var google = require('googleapis');
var urlshortener = google.urlshortener('v1');

var logger = require('../../utils/logger');
var util = require('util');
var https = require('https');

// PUT your API key here or this example will return errors
// To learn more about API keys, please see:
// https://developers.google.com/console/help/#UsingKeys
var API_KEY = 'AIzaSyBEaIw8BNiC4PUWoe6HgfSWKKKO6hw9ReY';
var youtube = google.youtube({ version: 'v3', auth: API_KEY});

function getSearchVideoList(results, callback) {

    return https.get({
        host: results.host,
        path: results.path
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
        	//logger.logInfo('=======yt d: '+d);
            body += d;
        });
        response.on('end', function() {
            callback(body);
        });
    }).on('error', function(e) {
      console.log("Got error: ", e);
      callback(e);
    });

}

exports.youtubesearch = function(callback) {
	//urlshortener.url.get({ shortUrl: 'http://goo.gl/xKbRu3', auth: API_KEY });
	var results = youtube.search.list({ part: 'id,snippet', 
		                                q: 'hapi node',
		                                maxResults: 3 });
	getSearchVideoList(results.url, function(output) {
        //var output0 = JSON.parse(output);
	    //logger.logInfo('====yt output: '+output);
	    for(var i in output.items) {
	         var item = output.items[i];
	         logger.logInfo('id: '+item.id.videoId+' title: '+item.snippet.title);
	         //logger.logInfo('[%s] Title: %s', item.id.videoId, item.snippet.title);
	    }
        callback(output);
	});



} 