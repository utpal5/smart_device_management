const express = require('express');
const {
  createDevice,
  getDevices,
  getDevice,
  updateDevice,
  deleteDevice,
  heartbeat
} = require('../controllers/deviceController');
const {
  validateDevice,
  validateUpdateDevice,
  validateHeartbeat,
  validateQueryParams
} = require('../middleware/validation');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

router.post('/', validateDevice, createDevice);
router.get('/', validateQueryParams, getDevices);
router.get('/:id', getDevice);
router.patch('/:id', validateUpdateDevice, updateDevice);
router.delete('/:id', deleteDevice);
router.post('/:id/heartbeat', validateHeartbeat, heartbeat);

module.exports = router;