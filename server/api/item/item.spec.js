'use strict';

var should = require('should'),
  app = require('../../app'),
  request = require('supertest'),
  User = require('./../../api/user/user.model'),
  config = require('./../../config/environment'),
  MongoClient = require('mongodb').MongoClient;

var token = '',
  createdBy = '',
  itemId = '',
  categoryId = '';

/**
 * A helper function to build the Authorization header string
 */
function getBearer() {
  return 'Bearer ' + token;
}

describe('/api/items', function() {
  before(function(done) {
    User.find({}).remove(function() {
      User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@test.com',
        password: 'test'
      }, function(err, user) {
        var dummyCategories = [{
          // on Category Schema definition, we set the `createdBy` as a String,
          // so we need to make sure it stored as a hex String
          createdBy: user._id.toString(),
          name: 'Foods',
          weight: 1,
          media: 'http://example.org',
          createdAt: Date.now(),
          modifiedAt: Date.now()
        }];

        // Connect to the db
        MongoClient.connect(config.mongo.uri, function(err, db) {
          if (err) {
            return console.dir(err);
          }

          // Get the documents collection
          var itemsCol = db.collection('items'),
            categoriesCol = db.collection('categories');
          // Insert some documents
          categoriesCol.insert(dummyCategories, function(err, result) {
            categoryId = result[0]._id.toString();

            var dummyItems = [{
              // on Item Schema definition, we set the `createdBy` as a String,
              // so we need to make sure it stored as a hex String
              // TODO reference to categoryId
              category: categoryId,
              createdBy: user._id.toString(),
              name: 'Test item',
              preparation: 123,
              tax: 123,
              weight: 1,
              prices: [{
                name: 'small',
                value: 50
              }, {
                name: 'big',
                value: 100
              }],
              createdAt: Date.now(),
              modifiedAt: Date.now()
            }];

            itemsCol.insert(dummyItems, function(err, result) {
              itemId = result[0]._id.toString();

              done();
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

      var itemsCol = db.collection('items'),
        categoriesCol = db.collection('categories');

      itemsCol.remove(function(err, result) {
        categoriesCol.remove(done);
      });
    });
  });

  describe('Login', function() {

    it('should receive a JSON Web token', function(done) {
      request(app)
        .post('/auth/local')
        .set('Content-Type', 'application/json')
        .send({
          "email": "test@test.com",
          "password": "test"
        })
        .expect('Content-Type', /json/)
        .expect(function(res) {
          token = res.body.token;
        })
        .expect(200, done);
    });
  });

  describe('GET /api/items', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/items')
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          body.should.have.property('result');
          body.result.should.be.instanceof(Array);

          // assert the document structure
          body.result[0].should.have.property('category');

          var categoryField = body.result[0].category;
          categoryField.should.have.property('createdBy');
          categoryField.should.have.property('name');
          categoryField.should.have.property('createdAt');
          categoryField.should.have.property('modifiedAt');
          categoryField.should.have.property('_id');
          categoryField.should.have.property('weight');
          categoryField.should.have.property('media');

          body.result[0].should.have.property('createdBy');

          var createdBy = body.result[0].createdBy;
          createdBy.should.have.property('name');
          createdBy.should.have.property('email');
          createdBy.should.have.property('_id');
          createdBy.should.have.property('role');

          done();
        });
    });
  });

  describe('GET /api/items/:id', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/items/' + itemId)
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          body.should.have.property('result');

          // assert the document structure
          body.result.should.have.property('category');

          var categoryField = body.result.category;
          categoryField.should.have.property('createdBy');
          categoryField.should.have.property('name');
          categoryField.should.have.property('createdAt');
          categoryField.should.have.property('modifiedAt');
          categoryField.should.have.property('_id');
          categoryField.should.have.property('weight');
          categoryField.should.have.property('media');

          body.result.should.have.property('createdBy');

          var createdBy = body.result.createdBy;
          createdBy.should.have.property('name');
          createdBy.should.have.property('email');
          createdBy.should.have.property('_id');
          createdBy.should.have.property('role');

          done();
        });
    });
  });
});