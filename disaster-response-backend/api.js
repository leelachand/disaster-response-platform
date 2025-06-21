const express = require('express');
const router = express.Router();

const {
  createDisaster,
  getDisasters,
  deleteDisaster,
  updateDisaster,
  getNearbyDisasters,
  getDisastersGeoJSON
} = require('./disasterController');

const {
  register,
  login
} = require('./authController');

const {
  receiveAlert
} = require('./alertController');

const {
  getSocialMediaPosts
} = require('./socialMediaController'); // ✅ Import new route

// 🚨 Disaster Routes
router.post('/disasters', createDisaster);
router.get('/disasters', getDisasters);
router.get('/disasters/nearby', getNearbyDisasters);
router.delete('/disasters/:id', deleteDisaster);
router.put('/disasters/:id', updateDisaster);
router.get('/disasters/geojson', getDisastersGeoJSON);

// 📡 Social Media Route
router.get('/disasters/:id/social-media', getSocialMediaPosts); // ✅ New route

// 📢 Alert Route
router.post('/alerts', receiveAlert);

// 🔐 Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);

module.exports = router;
