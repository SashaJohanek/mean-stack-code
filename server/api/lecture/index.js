'use strict';

var express = require('express'),
  controller = require('./lecture.controller'),
  auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/public/:createdBy',    controller.public.index);
router.get('/public/topic/:topic',  controller.public.indexByTopic);

router.get('/',       auth.isAuthenticated(), controller.index);
router.get('/topic/:id', auth.isAuthenticated(), controller.indexByTopic);
router.get('/:id',    auth.isAuthenticated(), controller.show);
router.post('/',      auth.isAuthenticated(), controller.create);
router.put('/:id',    auth.isAuthenticated(), controller.update);
router.patch('/:id',  auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
