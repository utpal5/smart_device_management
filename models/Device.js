const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Device name is required'],
    trim: true,
    maxlength: [100, 'Device name cannot exceed 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Device type is required'],
    enum: ['light', 'camera', 'sensor', 'thermostat', 'smart_meter', 'switch'],
    lowercase: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  last_active_at: {
    type: Date,
    default: null
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
deviceSchema.index({ owner_id: 1, type: 1 });
deviceSchema.index({ owner_id: 1, status: 1 });
deviceSchema.index({ last_active_at: 1 });

// Virtual for device ID
deviceSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

deviceSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Device', deviceSchema);