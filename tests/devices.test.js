const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');
const Device = require('../models/Device');

describe('Device Endpoints', () => {
  let mongoServer;
  let token;
  let userId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Device.deleteMany({});

    // Create and login a test user
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'SecurePass123'
    });
    await user.save();
    userId = user._id;

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123'
      });

    token = loginResponse.body.token;
  });

  describe('POST /api/devices', () => {
    test('should create a new device', async () => {
      const deviceData = {
        name: 'Living Room Light',
        type: 'light',
        status: 'active'
      };

      const response = await request(app)
        .post('/api/devices')
        .set('Authorization', `Bearer ${token}`)
        .send(deviceData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.device.name).toBe('Living Room Light');
      expect(response.body.device.type).toBe('light');
    });

    test('should not create device without authentication', async () => {
      const deviceData = {
        name: 'Living Room Light',
        type: 'light',
        status: 'active'
      };

      const response = await request(app)
        .post('/api/devices')
        .send(deviceData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/devices', () => {
    beforeEach(async () => {
      const devices = [
        { name: 'Light 1', type: 'light', status: 'active', owner_id: userId },
        { name: 'Camera 1', type: 'camera', status: 'inactive', owner_id: userId }
      ];
      await Device.insertMany(devices);
    });

    test('should get all user devices', async () => {
      const response = await request(app)
        .get('/api/devices')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.devices).toHaveLength(2);
    });

    test('should filter devices by type', async () => {
      const response = await request(app)
        .get('/api/devices?type=light')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.devices).toHaveLength(1);
      expect(response.body.devices[0].type).toBe('light');
    });
  });

  describe('POST /api/devices/:id/heartbeat', () => {
    let deviceId;

    beforeEach(async () => {
      const device = new Device({
        name: 'Test Device',
        type: 'sensor',
        status: 'active',
        owner_id: userId
      });
      await device.save();
      deviceId = device._id;
    });

    test('should update device heartbeat', async () => {
      const response = await request(app)
        .post(`/api/devices/${deviceId}/heartbeat`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'active' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Device heartbeat recorded');
      expect(response.body.last_active_at).toBeDefined();
    });
  });
});