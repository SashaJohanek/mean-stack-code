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
  dummyQuizId = mongoose.Types.ObjectId();

/**
 * A helper function to build the Authorization header string
 */
function getBearer() {
  return 'Bearer ' + token;
}

describe('/api/quizzes', function() {

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

        var dummyQuizzes = [{
          _id: dummyQuizId,
          createdBy: userId,
          title: 'Any questions',
          body: 'Any questions that will surprise you',
          questions: [{
            question: 'How many fingers do we have?',
            answers: [{
              answer: 5,
              isCorrect: false
            }, {
              answer: 10,
              isCorrect: true
            }, {
              answer: 2,
              isCorrect: false
            }, {
              answer: 4,
              isCorrect: false
            }]
          }, {
            question: 'How many eyes do we have?',
            answers: [{
              answer: 2,
              isCorrect: true
            }, {
              answer: 10,
              isCorrect: false
            }, {
              answer: 5,
              isCorrect: false
            }, {
              answer: 4,
              isCorrect: false
            }]
          }]
        }];

        // Connect to the db
        MongoClient.connect(config.mongo.uri, function(err, db) {
          if (err) {
            return console.dir(err);
          }

          // Get the documents collection
          var quizzesCol = db.collection('quizzes');

          // Insert some documents
          quizzesCol.insert(dummyQuizzes, done);
        });
      });
    });
  });

  after(function(done) {
    MongoClient.connect(config.mongo.uri, function(err, db) {
      if (err) {
        return console.dir(err);
      }

      var quizzesCol = db.collection('quizzes');

      quizzesCol.remove(done);
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

  describe('GET /api/quizzes', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/quizzes')
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


  describe('GET /api/quizzes/:id', function() {

    it('should respond with JSON object', function(done) {
      request(app)
        .get('/api/quizzes/' + dummyQuizId)
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
          body.result.should.have.property('questions');

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

  describe('POST /api/quizzes', function() {
    it('should return the added lectures', function(done) {
      request(app)
        .post('/api/quizzes')
        .set('Authorization', getBearer())
        .send({
          _id: dummyQuizId,
          createdBy: userId,
          title: 'Any questions',
          body: 'Any questions that will surprise you',
          questions: [{
            question: 'How many fingers do we have?',
            answers: [{
              answer: 5,
              isCorrect: false
            }, {
              answer: 10,
              isCorrect: true
            }, {
              answer: 2,
              isCorrect: false
            }, {
              answer: 4,
              isCorrect: false
            }]
          }, {
            question: 'How many eyes do we have?',
            answers: [{
              answer: 2,
              isCorrect: true
            }, {
              answer: 10,
              isCorrect: false
            }, {
              answer: 5,
              isCorrect: false
            }, {
              answer: 4,
              isCorrect: false
            }]
          }]
        })
        .expect('Content-Type', /json/)
        .expect(function(res) {
          var body = res.body;

          // assert the returned response properties
          body.result.should.have.property('title');
          body.result.should.have.property('body');
          body.result.should.have.property('questions');
          body.result.should.have.property('createdBy');
        })
        .expect(201, done);
    });
  });

  describe('PUT /api/quizzes/:id', function() {
    it('should return the updated lectures', function(done) {
      request(app)
        .put('/api/quizzes/' + dummyQuizId)
        .set('Authorization', getBearer())
        .send({
          _id: dummyQuizId,
          createdBy: userId,
          title: 'Any questions',
          body: 'Any questions that will surprise you',
          questions: [{
            question: 'How many hairs do we have?',
            answers: [{
              answer: 3,
              isCorrect: false
            }, {
              answer: 'thousands',
              isCorrect: true
            }, {
              answer: 2,
              isCorrect: false
            }, {
              answer: 4,
              isCorrect: false
            }]
          }, {
            question: 'How many eyes do we have?',
            answers: [{
              answer: 2,
              isCorrect: true
            }, {
              answer: 10,
              isCorrect: false
            }, {
              answer: 5,
              isCorrect: false
            }, {
              answer: 4,
              isCorrect: false
            }]
          }]
        })
        .expect('Content-Type', /json/)
        .expect(function(res) {
          var body = res.body;

          // assert the returned response properties
          body.result.should.have.property('title');
          body.result.should.have.property('body');
          body.result.should.have.property('questions');
          body.result.should.have.property('createdBy');
        })
        .expect(200, done);
    });
  });

  describe('DELETE /api/quizzes/:id', function() {
    it('should delete single record', function(done) {
      request(app)
        .del('/api/quizzes/' + dummyQuizId)
        .set('Authorization', getBearer())
        .expect(204, done);
    });
  });

  describe('get non-exist document', function() {
    it('should return HTTP 404 Not Found', function(done) {
      request(app)
        .get('/api/quizzes/540cebdfd7503d420d54a531')
        .set('Authorization', getBearer())
        .expect(404, done);
    });
  });
});
