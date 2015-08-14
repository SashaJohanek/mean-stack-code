'use strict';

var _ = require('lodash'),
  Media = require('./media.model'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  s3 = require('s3'),
  config = require('./../../config/environment');

var BUCKET = 'skounis-dev',
  UPLOAD_DIR = 'news-app/';

var client = s3.createClient({
  maxAsyncS3: 20,                     // this is the default
  s3RetryCount: 3,                    // this is the default
  s3RetryDelay: 1000,                 // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640,      // this is the default (15 MB)
  s3Options: {
    accessKeyId: process.env['AWS_ACCESS_KEY'],
    secretAccessKey: process.env['AWS_SECRET_KEY']
  }
});

/**
 * A helper to upload the images from file system to AWS S3 storage
 */
function uploader(req, res) {
  if (req.body) {
    // get the file name which will be used for S3 as well
    var targetFilename = req.body.file.path.split('/').slice(-1)[0];
    var targetKey = UPLOAD_DIR + req.user._id.toString() + '/' + targetFilename;

    var uploadData = {
      userId: req.user._id,
      key: targetKey,
      createdAt: Date.now(),
      modifiedAt: Date.now()
    };
  }

  var params = {
    localFile: req.body.file.path,
    s3Params: {
      Bucket: BUCKET,
      Key: uploadData.key,
      ACL: 'public-read-write'
    }
  };

  var uploader = client.uploadFile(params);

  uploader.on('error', function(err) {
    handleError(res, err);
  });

  uploader.on('end', function(data) {
    uploadData.uri = s3.getPublicUrlHttp(BUCKET, uploadData.key);

    // omit the picture field when picture is not provided
    // or maybe we can provide a default picture
    if (uploadData.uri === '') delete uploadData.uri;

    // delete the image stored on local file system
    fs.unlink(req.body.file.path, function() {
      Media.create(uploadData, function(err, doc) {
        if (err) return res.json(500, err);

        return res.json(201, {
          url: 'http://localhost:9000/api/uploads/' + doc._id,
          jsonrpc: '2.0',
          result: doc
        });
      });
    });
  });
}

function deleter(req, res) {

  var mediaId = req.params.id

  Media.findById(mediaId, function(err, media) {
    if (err) {
      handleError(res, err);
    }

    var url = media.uri;
    var token = "s3.amazonaws.com/";
    var key = url.substring(url.indexOf(token)).replace(token, "")
    console.log("S3, deleting file: " + key);
    // delete image in S3
    var params = {
      Bucket: BUCKET,
      Delete: {
        Objects: [{
          Key: key
        }]
      }
    };

    var deleter = client.deleteObjects(params);

    deleter.on('error', function(err) {
      handleError(res, err);
    });

    deleter.on('end', function() {
      media.remove(function(err) {
        if (err) {
          return handleError(res, err);
        }
        return res.send(204);
      });
    });

  });
}

/**
 * Creates a new media
 */
exports.create = function(req, res) {
  uploader(req, res);
  // return res.json(201, {
  //   result: req.files
  // });
};

exports.show = function(req, res) {
  Media.findOne({
    _id: mongoose.Types.ObjectId(req.params.id),
    createdBy: req.user._id.toString()
  }, function(err, doc) {

    if (err) {
      return handleError(res, err);
    }

    if (doc) {
      return res.json(200, {
        url: 'http://localhost/api/uploads/' + doc._id,
        jsonrpc: '2.0',
        result: doc
      });
    }

    if (doc == null) {

      return res.json(404, {
        message: 'The media you are looking for is not exist'
      });
    }
  });
};

/**
 * Delete media
 */
exports.destroy = function(req, res) {
  deleter(req, res);
};

function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}
