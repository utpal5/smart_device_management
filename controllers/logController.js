const Log = require('../models/Log');
const Device = require('../models/Device');
const moment = require('moment');

// @desc    Create log entry
// @route   POST /api/devices/:id/logs
// @access  Private
const createLog = async (req, res, next) => {
  try {
    const { event, value } = req.body;
    const deviceId = req.params.id;

    // Verify device exists and belongs to user
    const device = await Device.findOne({
      _id: deviceId,
      owner_id: req.user._id
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    const log = await Log.create({
      device_id: deviceId,
      event,
      value
    });

    res.status(201).json({
      success: true,
      log
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get device logs
// @route   GET /api/devices/:id/logs
// @access  Private
const getDeviceLogs = async (req, res, next) => {
  try {
    const deviceId = req.params.id;
    const { limit = 10, page = 1, event } = req.query;

    // Verify device exists and belongs to user
    const device = await Device.findOne({
      _id: deviceId,
      owner_id: req.user._id
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Build query
    let query = { device_id: deviceId };
    if (event) query.event = event;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const logs = await Log.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Log.countDocuments(query);

    res.json({
      success: true,
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get device usage analytics
// @route   GET /api/devices/:id/usage
// @access  Private
const getDeviceUsage = async (req, res, next) => {
  try {
    const deviceId = req.params.id;
    const { range = '24h' } = req.query;

    // Verify device exists and belongs to user
    const device = await Device.findOne({
      _id: deviceId,
      owner_id: req.user._id
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Calculate date range
    let startDate;
    switch (range) {
      case '1h':
        startDate = moment().subtract(1, 'hour').toDate();
        break;
      case '24h':
        startDate = moment().subtract(24, 'hours').toDate();
        break;
      case '7d':
        startDate = moment().subtract(7, 'days').toDate();
        break;
      case '30d':
        startDate = moment().subtract(30, 'days').toDate();
        break;
      default:
        startDate = moment().subtract(24, 'hours').toDate();
    }

    // Aggregate usage data for smart meters and similar devices
    const aggregation = await Log.aggregate([
      {
        $match: {
          device_id: device._id,
          timestamp: { $gte: startDate },
          event: { $in: ['units_consumed', 'energy_usage', 'power_consumption'] }
        }
      },
      {
        $group: {
          _id: null,
          totalValue: { $sum: '$value' },
          count: { $sum: 1 },
          avgValue: { $avg: '$value' },
          maxValue: { $max: '$value' },
          minValue: { $min: '$value' }
        }
      }
    ]);

    const usage = aggregation[0] || {
      totalValue: 0,
      count: 0,
      avgValue: 0,
      maxValue: 0,
      minValue: 0
    };

    // Get activity logs
    const activityLogs = await Log.find({
      device_id: deviceId,
      timestamp: { $gte: startDate }
    })
    .sort({ timestamp: -1 })
    .limit(50);

    res.json({
      success: true,
      device_id: deviceId,
      range,
      total_units_last_24h: usage.totalValue,
      analytics: {
        totalValue: usage.totalValue,
        logCount: usage.count,
        averageValue: usage.avgValue,
        maxValue: usage.maxValue,
        minValue: usage.minValue,
        activityLogs: activityLogs.length
      },
      recentActivity: activityLogs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLog,
  getDeviceLogs,
  getDeviceUsage
};