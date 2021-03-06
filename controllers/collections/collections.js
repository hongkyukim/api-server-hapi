/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 */
var mongoskin = require('mongoskin');

var google = require('googleapis');
var urlshortener = google.urlshortener('v1');

var logger = require('../../utils/logger');
var util = require('util');
var https = require('https');

var db = mongoskin.db('mongodb://@localhost:27017/test', {safe:true})
var id = mongoskin.helper.toObjectID

var loadCollection = function(name, callback) {
  callback(db.collection(name))
}


exports.methods = [
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
  }]
