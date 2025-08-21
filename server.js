const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { MongoMemoryServer } = require('mongodb-memory-server');
const cron = require('node-cron');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const logRoutes = require('./routes/logRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const deviceService = require('./services/deviceService');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Memory Server for development
let mongoServer;

async function startMongoServer() {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    console.log('MongoDB Memory Server started at:', mongoUri);
    return mongoUri;
  } catch (error) {
    console.error('Failed to start MongoDB Memory Server:', error);
    throw error;
  }
}

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/devices', logRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Background job: Auto-deactivate devices inactive for > 24h
cron.schedule('0 */6 * * *', async () => {
  console.log('Running background job: Auto-deactivating inactive devices...');
  try {
    await deviceService.deactivateInactiveDevices();
  } catch (error) {
    console.error('Background job error:', error.message);
  }
});

// Database connection
async function connectToDatabase() {
  try {
    let mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.log('No MongoDB URI provided, starting in-memory MongoDB...');
      mongoUri = await startMongoServer();
    }
    
    await mongoose.connect(mongoUri, {
    });
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  try {
    await connectToDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  
  if (mongoServer) {
    await mongoServer.stop();
    console.log('MongoDB Memory Server stopped');
  }
  
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  
  process.exit(0);
});

module.exports = app;