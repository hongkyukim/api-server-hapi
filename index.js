var Hapi = require('hapi'),
  //server = hapi.createServer('localhost', 3000),
  
  mongoskin = require('mongoskin'),
  auth = require('./controllers/auth/auth'),
  oauth2 = require('./controllers/googleapis/oauth2'),
  apikeys = require('./controllers/googleapis/api_keys'),
  youtube = require('./controllers/youtube/youtube.js'),
  logger = require('./utils/logger')

var config = {};
var port0 = process.env.PORT || 3000;

var server = new Hapi.Server(config);
var hostconf = { host: 'localhost', port: port0 };

server.connection({ port: port0 });

var db = mongoskin.db('mongodb://@localhost:27017/test', {safe:true})
var id = mongoskin.helper.toObjectID

var loadCollection = function(name, callback) {
  callback(db.collection(name))
}


server.route([
  {
    method: 'GET',
    path: '/',
    handler: function(req, reply) {
      reply('Select a collection, e.g., /collections/messages')
    }
  },
    {
    method: 'GET',
    path: '/collections/{collectionName}',
    handler: function(req, reply) {
      loadCollection(req.params.collectionName, function(collection) {
        collection.find({}, {limit: 10, sort: [['_id', -1]]}).toArray(function(e, results){
          if (e) return reply(e)
          reply(results)
        })
      })
    }
  },
    {
    method: 'POST',
    path: '/collections/{collectionName}',
    handler: function(req, reply) {
      loadCollection(req.params.collectionName, function(collection) {
        collection.insert(req.payload, {}, function(e, results){
          if (e) return reply(e)
          reply(results)
        })
      })
    }
  },
    {
    method: 'GET',
    path: '/collections/{collectionName}/{id}',
    handler: function(req, reply) {
      loadCollection(req.params.collectionName, function(collection) {
        collection.findOne({_id: id(req.params.id)}, function(e, result){
          if (e) return reply(e)
          reply(result)
        })
      })
    }
  },
    {
    method: 'PUT',
    path: '/collections/{collectionName}/{id}',
    handler: function(req, reply) {
      loadCollection(req.params.collectionName, function(collection) {
        collection.update({_id: id(req.params.id)},
          {$set: req.payload},
          {safe: true, multi: false}, function(e, result){
          if (e) return reply(e)
          reply((result === 1) ? {msg:'success'} : {msg:'error'})
        })
      })
    }
  },
    {
    method: 'DELETE',
    path: '/collections/{collectionName}/{id}',
    handler: function(req, reply) {
      loadCollection(req.params.collectionName, function(collection) {
        collection.remove({_id: id(req.params.id)}, function(e, result){
           if (e) return reply(e)
           reply((result === 1) ? {msg:'success'} : {msg:'error'})
         })
      })
    }
  },
   {
    method: 'GET',
    path: '/oauth2',
    handler: function(req, reply) {
      logger.logInfo('====oauth2=======1==');
        var url = oauth2.dotest();
      logger.logInfo('====oauth2= url: '+url);
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
        console.log('================================================1==');
        apikeys.urlshortener();
        var locals = {
            title: 'This is my sample app'
        };
        console.log('===============================================2==');
        //reply.view('index', locals);
        //reply.render('index.jade', locals);
        reply({msg: 'auth success'});
    }
  },
    {
    method: 'GET',
    path: '/youtubesearch',
    handler: function(req, reply) {
        console.log('==yt===1==');
        youtube.youtubesearch();
        var locals = {
            title: 'This is my sample app'
        };
        console.log('==yt==2==');
        //reply.view('index', locals);
        //reply.render('index.jade', locals);
        reply({msg: 'auth success'});
    }
  },
    {
    method: 'GET',
    path: '/auth',
    handler: function(req, reply) {
        console.log('================================================1==');
        //auth.googleApiClientReady();
        var locals = {
            title: 'This is my sample app'
        };
        console.log('===============================================2==');
        //reply.view('index', locals);
        //reply.render('index.jade', locals);
        reply({msg: 'auth success'});
    }
  }
])
var options23 = {
    views: {
      engines: { jade: 'jade' },
      path: '../app',
      compileOptions: {
        pretty: true
      }
    }
  };
var options67 = {
    views: {
        engines: { jade: require('jade') },
        path: __dirname + '/templates',
        compileOptions: {
            pretty: true
        }
    }
};
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