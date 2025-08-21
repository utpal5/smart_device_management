const Device = require('../models/Device');
const moment = require('moment');

// Auto-deactivate devices that haven't been active for more than 24 hours
const deactivateInactiveDevices = async () => {
  try {
    const cutoffTime = moment().subtract(24, 'hours').toDate();
    
    const result = await Device.updateMany(
      {
        last_active_at: { $lt: cutoffTime },
        status: 'active'
      },
      {
        status: 'inactive'
      }
    );

    console.log(`Deactivated ${result.modifiedCount} inactive devices`);
    return result.modifiedCount;
  } catch (error) {
    console.error('Error deactivating inactive devices:', error);
    throw error;
  }
};

// Get device statistics
const getDeviceStats = async (userId) => {
  try {
    const stats = await Device.aggregate([
      { $match: { owner_id: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const typeStats = await Device.aggregate([
      { $match: { owner_id: userId } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    return {
      statusStats: stats,
      typeStats: typeStats
    };
  } catch (error) {
    console.error('Error getting device stats:', error);
    throw error;
  }
};

module.exports = {
  deactivateInactiveDevices,
  getDeviceStats
};