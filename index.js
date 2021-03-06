var util = require('util');
var Hapi = require('hapi'),
  auth = require('./controllers/auth/auth'),
  oauth2 = require('./controllers/googleapis/oauth2'),
  apikeys = require('./controllers/googleapis/api_keys'),
  videosearch = require('./controllers/videosearch.js'),
  collect = require('./controllers/collections/collections.js'),
  logger = require('./utils/logger')

var config = {};
var port0 = process.env.PORT || 3000;

var server = new Hapi.Server(config);
var hostconf = { host: 'localhost', port: port0 };

server.connection({ port: port0 });

server.route(collect.methods);

server.route([
   {
    method: 'GET',
    path: '/oauth2',
    handler: function(req, reply) {
        var url = oauth2.dotest();
        //logger.logInfo('====oauth2= url: '+url);
        reply.redirect(url);
    }
  },
   {
    method: 'GET',
    path: '/oauth2callback',
    handler: oauth2.oauth2callback
  },
    {
    method: 'GET',
    path: '/urlshortener',
    handler: function(req, reply) {
        apikeys.urlshortener();
        var locals = {
            title: 'This is my sample app'
        };
        reply({msg: 'auth success'});
    }
  },
    // video search using youtube, vevo,...
    {
    method: 'GET',
    path: '/videosearch',
    handler: videosearch.videosearch
  },
    {
    method: 'GET',
    path: '/auth',
    handler: function(req, reply) {
        //auth.googleApiClientReady();
        var locals = {
            title: 'This is my sample app'
        };
        reply({msg: 'auth success'});
    }
  }
])

var options = {
  views: {
      engines: { jade: 'jade' },
      path: __dirname + '/views',
      layout: true,    // layouts only work if set to false or removed
      compileOptions: {
        pretty: true
      }
  },
  subscribers: {
    'console': ['ops', 'request', 'log', 'error']
  }
};

//server.pack.require('good', options, function (err) {
//  if (!err) {
//      // Plugin loaded successfully
//  }
//});

server.start()
console.log('Hapi server started on ...port '+ port0);