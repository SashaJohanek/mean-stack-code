'use strict';

var should = require('should'),
  app = require('../../app'),
  request = require('supertest'),
  mongoose = require('mongoose'),
  User = require('./../../api/user/user.model'),
  config = require('./../../config/environment'),
  MongoClient = require('mongodb').MongoClient;

var token = '',
  itemId = '',
  userId = '',
  dummyMediaId = mongoose.Types.ObjectId(),
  dummyCategoryId = mongoose.Types.ObjectId(),
  dummyItemId = mongoose.Types.ObjectId(),
  dummyOfferId = mongoose.Types.ObjectId();

/**
 * A helper function to build the Authorization header string
 */
function getBearer() {
  return 'Bearer ' + token;
}

describe('/api/offers', function() {

  before(function(done) {
    User.find({}).remove(function() {
      User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@test.com',
        password: 'test'
      }, function(err, user) {
        userId = user._id.toString();

        var dummyMedia = [{
          _id: dummyMediaId,
          createdBy: userId,
          uri: 'http://example.org',
          createdAt: Date.now(),
          modifiedAt: Date.now()
        }];

        var dummyCategories = [{
          // on Category Schema definition, we set the `createdBy` as a String,
          // so we need to make sure it stored as a hex String
          _id: dummyCategoryId,
          createdBy: userId,
          name: 'Foods',
          weight: 1,
          media: [
            dummyMediaId
          ],
          createdAt: Date.now(),
          modifiedAt: Date.now()
        }];

        var dummyItems = [{
          _id: dummyItemId,
          createdBy: userId,
          category: dummyCategoryId.toString(),
          name: 'Test item name',
          intro: 'Test item intro',
          description: 'Test item desc',
          weight: 1,
          media: [
            dummyMediaId
          ],
          createdAt: Date.now(),
          modifiedAt: Date.now(),
          prices: [{
            name: 'small',
            value: 90
          }],
          tax: 15,
          preparation: 15
        }];

        // setup the dummy documents
        var dummyOffers = [{
          // on Offer Schema definition, we set the `createdBy` as a String,
          // so we need to make sure it stored as a hex String
          _id: dummyOfferId,
          createdBy: userId,
          name: 'Test offer name',
          intro: 'Test offer intro',
          description: 'Test offer desc',
          active: true,
          item: dummyItemId.toString(),
          prices: [{
            name: 'small',
            value: 90
          }],
          media: [
            dummyMediaId
          ],
          createdAt: Date.now(),
          modifiedAt: Date.now()
        }];

        // Connect to the db
        MongoClient.connect(config.mongo.uri, function(err, db) {
          if (err) {
            return console.dir(err);
          }

          // Get the documents collection
          var categoriesCol = db.collection('categories'),
            itemsCol = db.collection('items'),
            offersCol = db.collection('offers'),
            mediaCol = db.collection('media');

          // Insert some documents
          categoriesCol.insert(dummyCategories, function(err, result) {
            itemsCol.insert(dummyItems, function(err, result) {
              offersCol.insert(dummyOffers, function(err, result) {
                mediaCol.insert(dummyMedia, done);
              });
            });
          });
        });
      });
    });
  });

  after(function(done) {
    MongoClient.connect(config.mongo.uri, function(err, db) {
      if (err) {
        return console.dir(err);
      }

      var categoriesCol = db.collection('categories'),
        itemsCol = db.collection('items'),
        offersCol = db.collection('offers'),
        mediaCol = db.collection('media');

      categoriesCol.remove(function(err, result) {
        itemsCol.remove(function(err, result) {
          offersCol.remove(function(err, result) {
            mediaCol.remove(done);
          });
        });
      });
    });
  });

  describe('Login', function() {

    it('should receive a JSON Web token', function(done) {
      request(app)
        .post('/auth/local')
        .set('Content-Type', 'application/json')
        .send({
          'email': 'test@test.com',
          'password': 'test'
        })
        .expect('Content-Type', /json/)
        .expect(function(res) {
          token = res.body.token;
        })
        .expect(200, done);
    });
  });

  describe('GET /api/offers', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/offers')
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          body.should.have.property('page');
          body.should.have.property('page_size');
          body.should.have.property('total');
          body.should.have.property('num_pages');
          body.should.have.property('result');

          body.result.should.be.instanceof(Array);

          done();
        });
    });
  });

  describe('GET /api/offers/:id', function() {

    it('should respond with JSON object', function(done) {
      request(app)
        .get('/api/offers/' + dummyOfferId.toString())
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          body.should.have.property('result');

          body.result.should.have.property('item');
          body.result.item.should.have.property('name');
          body.result.item.should.have.property('intro');
          body.result.item.should.have.property('description');

          body.result.should.have.property('createdBy');
          body.result.createdBy.should.have.property('name');
          body.result.createdBy.should.have.property('email');
          body.result.createdBy.should.have.property('_id');
          body.result.createdBy.should.have.property('role');

          // assert the media item properties
          body.result.should.have.property('media');
          body.result.media[0].should.have.property('createdBy');
          body.result.media[0].should.have.property('uri');
          body.result.media[0].should.have.property('createdAt');
          body.result.media[0].should.have.property('modifiedAt');

          done();
        });
    });
  });

  describe('GET /api/offers/active', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/offers/active')
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          body.should.have.property('result');

          done();
        });
    });
  });
});
