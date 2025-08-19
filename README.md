# Curvvtech Smart Device Management Backend

A comprehensive backend system for managing IoT devices with user authentication, device management, logging, and analytics capabilities.

## 🚀 Features

- **User Management**: Registration, authentication, and JWT-based authorization
- **Device Management**: CRUD operations for IoT devices with heartbeat tracking
- **Logging & Analytics**: Comprehensive event logging and usage analytics
- **Security**: Rate limiting, input validation, and secure authentication
- **Background Jobs**: Automatic device deactivation for inactive devices
- **Testing**: Comprehensive unit tests with Jest
- **Docker Support**: Containerized deployment with Docker Compose

## 📋 Requirements

- Node.js 16+ 
- MongoDB 5.0+
- npm or yarn

## 🛠️ Installation

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd curvvtech-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB:**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongo mongo:7.0

   # Or use your local MongoDB installation
   ```

5. **Run the application:**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

### Docker Deployment

1. **Using Docker Compose (Recommended):**
   ```bash
   docker-compose up -d
   ```

2. **Build and run manually:**
   ```bash
   docker build -t curvvtech-backend .
   docker run -p 3000:3000 curvvtech-backend
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "user"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Device Management

#### Create Device
```http
POST /devices
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Living Room Light",
  "type": "light",
  "status": "active"
}
```

#### Get Devices
```http
GET /devices?type=light&status=active&page=1&limit=10
Authorization: Bearer <token>
```

#### Update Device
```http
PATCH /devices/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Device Name",
  "status": "inactive"
}
```

#### Device Heartbeat
```http
POST /devices/:id/heartbeat
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "active"
}
```

### Logging & Analytics

#### Create Log Entry
```http
POST /devices/:id/logs
Authorization: Bearer <token>
Content-Type: application/json

{
  "event": "units_consumed",
  "value": 2.5
}
```

#### Get Device Logs
```http
GET /devices/:id/logs?limit=10&page=1
Authorization: Bearer <token>
```

#### Get Usage Analytics
```http
GET /devices/:id/usage?range=24h
Authorization: Bearer <token>
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/curvvtech` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT token expiration | `24h` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `60000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

### Device Types

Supported device types:
- `light` - Smart lights
- `camera` - Security cameras  
- `sensor` - Environmental sensors
- `thermostat` - Climate control
- `smart_meter` - Energy meters
- `switch` - Smart switches

### Device Status

- `active` - Device is operational
- `inactive` - Device is offline
- `maintenance` - Device under maintenance

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test -- --coverage
```

## 📊 Monitoring & Health Checks

Health check endpoint:
```http
GET /health
```

Background jobs:
- **Device Deactivation**: Runs every 6 hours to deactivate devices inactive for >24h

## 🔒 Security Features

- **Rate Limiting**: 100 requests per minute per IP
- **Helmet**: Security headers
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Joi schema validation
- **Password Hashing**: bcrypt with salt rounds
- **CORS**: Cross-origin resource sharing

## 🚀 Deployment

### Production Checklist

- [ ] Update `JWT_SECRET` with a strong secret key
- [ ] Set `NODE_ENV=production`
- [ ] Configure MongoDB with authentication
- [ ] Set up SSL/TLS certificates
- [ ] Configure reverse proxy (nginx)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

### Docker Production

```bash
# Production build
docker build -t curvvtech-backend:latest .

# Run with production config
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=<your-mongodb-uri> \
  -e JWT_SECRET=<your-jwt-secret> \
  curvvtech-backend:latest
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Postman Collection](./postman/curvvtech-api.postman_collection.json)
- [API Documentation](./docs/api.md)

## 📞 Support

For support and questions:
- Create an issue in the repository
- Email: support@curvvtech.com

---

Built with ❤️ for Curvvtech Assignment