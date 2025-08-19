const express = require('express');
const {
  createLog,
  getDeviceLogs,
  getDeviceUsage
} = require('../controllers/logController');
const { validateLog, validateQueryParams } = require('../middleware/validation');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

router.post('/:id/logs', validateLog, createLog);
router.get('/:id/logs', validateQueryParams, getDeviceLogs);
router.get('/:id/usage', validateQueryParams, getDeviceUsage);

module.exports = router;