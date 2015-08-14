'use strict';

var should = require('should'),
  app = require('../../app'),
  request = require('supertest'),
  User = require('./../../api/user/user.model'),
  config = require('./../../config/environment'),
  mongoose = require('mongoose'),
  MongoClient = require('mongodb').MongoClient;

var token = '',
  userId = '',
  dummyMediaId = mongoose.Types.ObjectId(),
  firstCategoryId = mongoose.Types.ObjectId(),
  secondCategoryId = mongoose.Types.ObjectId();

/**
 * A helper function to build the Authorization header string
 */
function getBearer() {
  return 'Bearer ' + token;
}

describe('/api/courses', function() {
  before(function(done) {
    User.find({}).remove(function() {
      User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@test.com',
        password: 'test'
      }, function(err, user) {
        userId = user._id.toString();

        // setup dummy media
        var dummyMedia = [{
          _id: dummyMediaId,
          createdBy: userId,
          uri: 'http://example.org',
          createdAt: Date.now(),
          modifiedAt: Date.now()
        }];

        // setup the dummy courses
        var dummyCourses = [{
          _id: firstCategoryId,
          // on Category Schema definition, we set the `createdBy` as a String,
          // so we need to make sure it stored as a hex String
          createdBy: userId,
          name: 'Foods',
          weight: 1,
          media: [
            dummyMediaId
          ],
          createdAt: Date.now(),
          modifiedAt: Date.now()
        }, {
          _id: secondCategoryId,
          createdBy: userId,
          name: 'Snacks',
          weight: 1,
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
          var catCol = db.collection('courses'),
            mediaCol = db.collection('media');

          // Insert some documents
          catCol.insert(dummyCourses, function(err, result) {
            mediaCol.insert(dummyMedia, done);
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

      var catCol = db.collection('courses'),
        mediaCol = db.collection('media');

      catCol.remove(function(err, result) {
        mediaCol.remove(done);
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

  describe('GET /api/courses', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/courses')
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          body.should.have.property('result');

          // assert the media item properties
          body.result[0].should.have.property('media');
          body.result[0].media[0].should.have.property('createdBy');
          body.result[0].media[0].should.have.property('uri');
          body.result[0].media[0].should.have.property('createdAt');
          body.result[0].media[0].should.have.property('modifiedAt');

          // assert the document structure
          body.result[0].should.have.property('createdBy');
          body.result[0].should.have.property('name');
          body.result[0].should.have.property('createdAt');
          body.result[0].should.have.property('modifiedAt');
          body.result[0].should.have.property('_id');
          body.result[0].should.have.property('weight');
          body.result[0].should.have.property('media');

          body.result.should.be.instanceof(Array);

          done();
        });
    });
  });

  describe('GET /api/courses/:id', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/courses/' + firstCategoryId)
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          body.should.have.property('result');

          // assert the media item properties
          body.result.should.have.property('media');
          body.result.media[0].should.have.property('createdBy');
          body.result.media[0].should.have.property('uri');
          body.result.media[0].should.have.property('createdAt');
          body.result.media[0].should.have.property('modifiedAt');

          // assert the document structure
          body.result.should.have.property('createdBy');
          body.result.should.have.property('name');
          body.result.should.have.property('createdAt');
          body.result.should.have.property('modifiedAt');
          body.result.should.have.property('_id');
          body.result.should.have.property('weight');
          body.result.should.have.property('media');

          done();
        });
    });
  });
});
