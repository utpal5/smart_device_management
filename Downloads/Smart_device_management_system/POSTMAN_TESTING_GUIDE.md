# Postman Testing Guide - Smart Device Management Platform

## Base URL
```
http://localhost:3000
```

## 1. Health Check (No Auth Required)
**GET** `http://localhost:3000/health`

### Test Case:
- **Method**: GET
- **URL**: http://localhost:3000/health
- **Expected Response**: 
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 2. Authentication Endpoints

### 2.1 User Signup
**POST** `http://localhost:3000/api/auth/signup`

**Headers**:
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test@123456",
  "role": "user"
}
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "user_id_here",
    "username": "testuser",
    "email": "test@example.com",
    "role": "user"
  }
}
```

### 2.2 User Login
**POST** `http://localhost:3000/api/auth/login`

**Headers**:
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "email": "test@example.com",
  "password": "Test@123456"
}
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id_here",
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

**Save the token** from this response for authenticated requests.

## 3. Device Management (Auth Required)

### 3.1 Create Device
**POST** `http://localhost:3000/api/devices/`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body** (raw JSON):
```json
{
  "name": "Smart Thermostat",
  "type": "thermostat",
  "location": "Living Room",
  "status": "active",
  "config": {
    "temperature": 22,
    "mode": "auto"
  }
}
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Device created successfully",
  "device": {
    "_id": "device_id_here",
    "name": "Smart Thermostat",
    "type": "thermostat",
    "location": "Living Room",
    "status": "active",
    "config": {
      "temperature": 22,
      "mode": "auto"
    },
    "lastHeartbeat": null,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3.2 Get All Devices
**GET** `http://localhost:3000/api/devices/`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters** (optional):
- `status`: active/inactive
- `type`: thermostat/camera/sensor/etc
- `page`: 1
- `limit`: 10

**Example**: `http://localhost:3000/api/devices/?status=active&page=1&limit=5`

### 3.3 Get Single Device
**GET** `http://localhost:3000/api/devices/:deviceId`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### 3.4 Update Device
**PATCH** `http://localhost:3000/api/devices/:deviceId`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body** (raw JSON):
```json
{
  "name": "Updated Device Name",
  "status": "inactive",
  "config": {
    "temperature": 25
  }
}
```

### 3.5 Delete Device
**DELETE** `http://localhost:3000/api/devices/:deviceId`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### 3.6 Device Heartbeat
**POST** `http://localhost:3000/api/devices/:deviceId/heartbeat`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body** (raw JSON):
```json
{
  "status": "active",
  "data": {
    "temperature": 23.5,
    "humidity": 45
  }
}
```

## 4. Device Logs (Auth Required)

### 4.1 Get Device Logs
**GET** `http://localhost:3000/api/devices/:deviceId/logs`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters** (optional):
- `level`: info/warning/error
- `startDate`: 2024-01-01
- `endDate`: 2024-01-31
- `page`: 1
- `limit`: 20

### 4.2 Create Device Log
**POST** `http://localhost:3000/api/devices/:deviceId/logs`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body** (raw JSON):
```json
{
  "level": "info",
  "message": "Device temperature updated",
  "data": {
    "oldTemp": 22,
    "newTemp": 23
  }
}
```

## 5. User Profile (Auth Required)

### 5.1 Get User Profile
**GET** `http://localhost:3000/api/auth/profile`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Postman Collection Setup

### Environment Variables
Create a Postman environment with these variables:
- `base_url`: http://localhost:3000
- `token`: (will be set after login)

### Collection Structure
1. **Authentication**
   - Signup
   - Login
   - Get Profile

2. **Device Management**
   - Create Device
   - Get All Devices
   - Get Single Device
   - Update Device
   - Delete Device
   - Send Heartbeat

3. **Device Logs**
   - Get Logs
   - Create Log

## Testing Workflow

1. **Start with Health Check** (no auth required)
2. **Create User** via Signup
3. **Login** to get JWT token
4. **Set token** in Postman environment variables
5. **Test Device CRUD operations**
6. **Test Device Logs**
7. **Test User Profile**

## Error Testing

Test these error scenarios:
- Invalid JWT token
- Missing required fields
- Invalid device ID format
- Rate limiting (make 100+ requests quickly)
- Duplicate email signup
- Wrong login credentials
