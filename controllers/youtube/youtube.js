/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
        	logger.logInfo('=======yt d: '+d);
            body += d;
        });
        response.on('end', function() {

            // Data reception is done, do whatever with it!
            //var parsed = JSON.parse(body);
            //logger.logInfo('=======yt parsed: '+parsed);
            callback(body);
        });
    }).on('error', function(e) {
      console.log("Got error: ", e);
      callback(e);
    });

}

function youtubesearch(callback) {
	logger.logInfo('===========================yt search');
	//urlshortener.url.get({ shortUrl: 'http://goo.gl/xKbRu3', auth: API_KEY });
	var results = youtube.search.list({ part: 'id,snippet', 
		                                q: 'hapi node',
		                                maxResults: 3 });

    //logger.logInfo('=====yt: '+util.inspect(results.url));

	getSearchVideoList(results.url, function(output) {
        //var output0 = JSON.parse(output);
	    logger.logInfo('====yt output: '+output);
	    for(var i in output.items) {
	         var item = output.items[i];
	         logger.logInfo('id: '+item.id.videoId+' title: '+item.snippet.title);
	         //logger.logInfo('[%s] Title: %s', item.id.videoId, item.snippet.title);
	    }
        callback(output);
	});



} 

exports.videosearch = function(req, reply) {
        console.log('==yt===1==');
        
        var locals = {
            title: 'This is my sample app'
        };
        youtubesearch(function(results) {
            //console.log('==yt==2==results: '+results);
            //reply.view('index', locals);
            //reply.render('index.jade', locals);
            reply(results);
         });
    }