const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  device_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  event: {
    type: String,
    required: [true, 'Event type is required'],
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Event value is required']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Map,
    of: String,
    default: new Map()
  }
}, {
  timestamps: true
});

// Index for efficient queries
logSchema.index({ device_id: 1, timestamp: -1 });
logSchema.index({ device_id: 1, event: 1, timestamp: -1 });

// Virtual for log ID
logSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

logSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  }
});

module.exports = mongoose.model('Log', logSchema);