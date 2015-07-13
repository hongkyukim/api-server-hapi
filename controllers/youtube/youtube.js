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

// PUT your API key here or this example will return errors
// To learn more about API keys, please see:
// https://developers.google.com/console/help/#UsingKeys
var API_KEY = 'AIzaSyBEaIw8BNiC4PUWoe6HgfSWKKKO6hw9ReY';
var youtube = google.youtube({ version: 'v3', auth: API_KEY});

exports.youtubesearch = function() {
	logger.logInfo('===========================yt search');
	//urlshortener.url.get({ shortUrl: 'http://goo.gl/xKbRu3', auth: API_KEY });
	var results = youtube.search.list({ part: 'id,snippet', 
		                                q: 'hapi node',
		                                maxResults: 3 });
logger.logInfo('===========================yt: '+util.inspect(results));
//logger.logInfo('=====================yt href: '+results.url.href);
    for(var i in results.items) {
    	logger.logInfo('====inside===================: '+i);
         var item = results.items[i];
         logger.logInfo('====item: '+item);
         logger.logInfo('[%s] Title: %s', item.id.videoId, item.snippet.title);
    }

} 