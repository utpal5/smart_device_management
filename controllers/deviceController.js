const Device = require('../models/Device');
const Log = require('../models/Log');

// @desc    Register new device
// @route   POST /api/devices
// @access  Private
const createDevice = async (req, res, next) => {
  try {
    const { name, type, status } = req.body;

    const device = await Device.create({
      name,
      type,
      status,
      owner_id: req.user._id
    });

    res.status(201).json({
      success: true,
      device: {
        id: device._id,
        name: device.name,
        type: device.type,
        status: device.status,
        last_active_at: device.last_active_at,
        owner_id: device.owner_id
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all user devices
// @route   GET /api/devices
// @access  Private
const getDevices = async (req, res, next) => {
  try {
    const { type, status, page = 1, limit = 10 } = req.query;
    
    // Build query
    let query = { owner_id: req.user._id };
    
    if (type) query.type = type;
    if (status) query.status = status;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const devices = await Device.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Device.countDocuments(query);

    res.json({
      success: true,
      devices,
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

// @desc    Get single device
// @route   GET /api/devices/:id
// @access  Private
const getDevice = async (req, res, next) => {
  try {
    const device = await Device.findOne({
      _id: req.params.id,
      owner_id: req.user._id
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    res.json({
      success: true,
      device
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update device
// @route   PATCH /api/devices/:id
// @access  Private
const updateDevice = async (req, res, next) => {
  try {
    const device = await Device.findOneAndUpdate(
      { _id: req.params.id, owner_id: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    res.json({
      success: true,
      device
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete device
// @route   DELETE /api/devices/:id
// @access  Private
const deleteDevice = async (req, res, next) => {
  try {
    const device = await Device.findOneAndDelete({
      _id: req.params.id,
      owner_id: req.user._id
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Also delete all logs for this device
    await Log.deleteMany({ device_id: req.params.id });

    res.json({
      success: true,
      message: 'Device removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update device heartbeat
// @route   POST /api/devices/:id/heartbeat
// @access  Private
const heartbeat = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const device = await Device.findOneAndUpdate(
      { _id: req.params.id, owner_id: req.user._id },
      { 
        last_active_at: new Date(),
        status: status
      },
      { new: true, runValidators: true }
    );

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    res.json({
      success: true,
      message: 'Device heartbeat recorded',
      last_active_at: device.last_active_at
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDevice,
  getDevices,
  getDevice,
  updateDevice,
  deleteDevice,
  heartbeat
};