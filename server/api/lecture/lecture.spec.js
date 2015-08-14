'use strict';

var should = require('should'),
  mongoose = require('mongoose'),
  request = require('supertest'),
  MongoClient = require('mongodb').MongoClient,
  User = require('./../../api/user/user.model'),
  config = require('./../../config/environment'),
  app = require('../../app');

var token = '',
  userId,
  dummyMediaId = mongoose.Types.ObjectId(),
  dummyLectureId = mongoose.Types.ObjectId();

/**
 * A helper function to build the Authorization header string
 */
function getBearer() {
  return 'Bearer ' + token;
}

describe('/api/lectures', function() {

  before(function(done) {
    User.find({}).remove(function() {
      User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@test.com',
        password: 'test'
      }, function(err, user) {
        // setup the dummy documents
        userId = user._id.toString();

        var dummyLectures = [{
          _id: dummyLectureId,
          createdBy: userId,
          title: 'Cooking Lecture',
          body: 'Lecture about cooking',
          youtubeLink: 'http://example.org',
          media: [
            dummyMediaId.toString()
          ],
        }];

        var dummyMedia = [{
          _id: dummyMediaId,
          createdBy: userId,
          uri: 'http://example.org',
          createdAt: Date.now(),
          modifiedAt: Date.now()
        }];

        // Connect to the db
        MongoClient.connect(config.mongo.uri, function(err, db) {
          if (err) {
            return console.dir(err);
          }

          // Get the documents collection
          var lectureCol = db.collection('lectures'),
            mediaCol = db.collection('media');

          // Insert some documents
          lectureCol.insert(dummyLectures, function(err, result) {
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

      var lectureCol = db.collection('lecture'),
        mediaCol = db.collection('media');

      lectureCol.remove(function(err, result) {
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
          email: 'test@test.com',
          password: 'test'
        })
        .expect('Content-Type', /json/)
        .expect(function(res) {
          token = res.body.token;
        })
        .expect(200, done);
    });
  });

  describe('GET /api/lectures', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/lectures')
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          body.result.should.be.instanceof(Array);

          done();
        });
    });
  });


  describe('GET /api/lectures/:id', function() {

    it('should respond with JSON object', function(done) {
      request(app)
        .get('/api/lectures/' + dummyLectureId)
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          body.should.have.property('result');

          // assert the properties
          body.result.should.have.property('title');
          body.result.should.have.property('body');
          body.result.should.have.property('youtubeLink');

          // assert the media item properties
          body.result.should.have.property('media');
          body.result.media[0].should.have.property('createdBy');
          body.result.media[0].should.have.property('uri');
          body.result.media[0].should.have.property('createdAt');
          body.result.media[0].should.have.property('modifiedAt');

          body.result.should.have.property('createdBy');
          // assert the createdBy properties
          body.result.createdBy.should.have.property('name');
          body.result.createdBy.should.have.property('email');
          body.result.createdBy.should.have.property('_id');
          body.result.createdBy.should.have.property('role');

          done();
        });
    });
  });

  describe('POST /api/lectures', function() {
    it('should return the added lectures', function(done) {
      request(app)
        .post('/api/lectures')
        .set('Authorization', getBearer())
        .send({
          media: [
            dummyMediaId
          ],
          title: 'WISI CONSEQUAT SIT ZZRIL.',
          body: 'Ut vulputate te dolor ipsum',
          youtubeLink: 'http://example.org'
        })
        .expect('Content-Type', /json/)
        .expect(function(res) {
          var body = res.body;

          // assert the returned response properties
          body.result.should.have.property('title');
          body.result.should.have.property('body');
          body.result.should.have.property('youtubeLink');
          body.result.should.have.property('media');
          body.result.should.have.property('createdBy');
        })
        .expect(201, done);
    });
  });

  describe('PUT /api/lectures/:id', function() {
    it('should return the updated lectures', function(done) {
      request(app)
        .put('/api/lectures/' + dummyLectureId)
        .set('Authorization', getBearer())
        .send({
          media: [
            dummyMediaId
          ],
          title: 'WISI CONSEQUAT SIT ZZRIL.',
          body: 'Ut vulputate te dolor ipsum',
          youtubeLink: 'http://example.orge',
          topicId: null
        })
        .expect('Content-Type', /json/)
        .expect(function(res) {
          var body = res.body;

          // assert the returned response properties
          body.result.should.have.property('title');
          body.result.should.have.property('body');
          body.result.should.have.property('youtubeLink');
          body.result.should.have.property('media');
          body.result.should.have.property('createdBy');
        })
        .expect(200, done);
    });
  });

  describe('DELETE /api/lectures/:id', function() {
    it('should delete single record', function(done) {
      request(app)
        .del('/api/lectures/' + dummyLectureId)
        .set('Authorization', getBearer())
        .expect(204, done);
    });
  });

  describe('get non-exist document', function() {
    it('should return HTTP 404 Not Found', function(done) {
      request(app)
        .get('/api/lectures/540cebdfd7503d420d54a531')
        .set('Authorization', getBearer())
        .expect(404, done);
    });
  });
});
