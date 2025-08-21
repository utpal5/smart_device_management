const Joi = require('joi');

// User validation schemas
const signupSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)')).required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }),
  role: Joi.string().valid('user', 'admin').default('user')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Device validation schemas
const deviceSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  type: Joi.string().valid('light', 'camera', 'sensor', 'thermostat', 'smart_meter', 'switch').required(),
  status: Joi.string().valid('active', 'inactive', 'maintenance').default('active')
});

const updateDeviceSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  type: Joi.string().valid('light', 'camera', 'sensor', 'thermostat', 'smart_meter', 'switch'),
  status: Joi.string().valid('active', 'inactive', 'maintenance')
}).min(1);

const heartbeatSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive', 'maintenance').required()
});

// Log validation schemas
const logSchema = Joi.object({
  event: Joi.string().min(1).max(100).required(),
  value: Joi.alternatives().try(
    Joi.string(),
    Joi.number(),
    Joi.boolean(),
    Joi.object()
  ).required()
});

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    
    next();
  };
};

// Query parameter validation
const validateQueryParams = (req, res, next) => {
  const { type, status, limit, range } = req.query;
  
  if (type && !['light', 'camera', 'sensor', 'thermostat', 'smart_meter', 'switch'].includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid device type'
    });
  }
  
  if (status && !['active', 'inactive', 'maintenance'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    });
  }
  
  if (limit && (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
    return res.status(400).json({
      success: false,
      message: 'Limit must be an integer between 1 and 100'
    });
  }
  
  if (range && !['1h', '24h', '7d', '30d'].includes(range)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid range. Allowed values: 1h, 24h, 7d, 30d'
    });
  }
  
  next();
};

module.exports = {
  validateSignup: validate(signupSchema),
  validateLogin: validate(loginSchema),
  validateDevice: validate(deviceSchema),
  validateUpdateDevice: validate(updateDeviceSchema),
  validateHeartbeat: validate(heartbeatSchema),
  validateLog: validate(logSchema),
  validateQueryParams
};