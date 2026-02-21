# Backend & Database Setup Guide

## Current State
FleetFlow currently uses **Zustand** for client-side state management with **mock data**. All data is stored in browser memory and resets on page refresh.

## Recommended Backend Architecture

### 1. Backend Framework Options

#### Option A: Node.js + Express + MongoDB (Recommended)
```bash
# Install dependencies
npm install express mongoose cors dotenv bcryptjs jsonwebtoken

# Backend structure
backend/
├── server.js
├── models/
│   ├── Vehicle.js
│   ├── Driver.js
│   ├── Trip.js
│   ├── Maintenance.js
│   ├── FuelLog.js
│   └── Alert.js
├── routes/
│   ├── vehicles.js
│   ├── drivers.js
│   ├── trips.js
│   ├── maintenance.js
│   └── auth.js
└── middleware/
    └── auth.js
```

#### Option B: Node.js + Express + PostgreSQL
```bash
# Install dependencies
npm install express pg sequelize cors dotenv bcryptjs jsonwebtoken

# Use Sequelize ORM for PostgreSQL
```

### 2. Database Schema

#### MongoDB Schema Example (Vehicle Collection)
```javascript
const vehicleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  licensePlate: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    enum: ['Truck', 'Van', 'Container', 'Trailer'],
    required: true 
  },
  make: String,
  model: String,
  year: Number,
  status: {
    type: String,
    enum: ['Available', 'On Trip', 'In Shop', 'Loading', 'Retired'],
    default: 'Available'
  },
  mileage: Number,
  capacity: Number,
  region: String,
  lastMaintenance: Date,
  nextMaintenance: Date,
  fuelType: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### 3. API Endpoints

#### Vehicles API
```
GET    /api/vehicles              - Get all vehicles (with filters)
GET    /api/vehicles/:id          - Get single vehicle
POST   /api/vehicles              - Create new vehicle
PUT    /api/vehicles/:id          - Update vehicle
DELETE /api/vehicles/:id          - Delete vehicle
PATCH  /api/vehicles/:id/status   - Update vehicle status
```

#### Trips API
```
GET    /api/trips                 - Get all trips (with filters)
GET    /api/trips/:id             - Get single trip
POST   /api/trips                 - Create new trip
PUT    /api/trips/:id             - Update trip
DELETE /api/trips/:id             - Delete trip
PATCH  /api/trips/:id/dispatch    - Dispatch trip
PATCH  /api/trips/:id/complete    - Complete trip
```

### 4. Frontend API Integration

#### Create API Service Layer
```typescript
// src/services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const vehicleAPI = {
  getAll: (params?: any) => api.get('/vehicles', { params }),
  getById: (id: string) => api.get(`/vehicles/${id}`),
  create: (data: any) => api.post('/vehicles', data),
  update: (id: string, data: any) => api.put(`/vehicles/${id}`, data),
  delete: (id: string) => api.delete(`/vehicles/${id}`),
  updateStatus: (id: string, status: string) => 
    api.patch(`/vehicles/${id}/status`, { status }),
};

export const tripAPI = {
  getAll: (params?: any) => api.get('/trips', { params }),
  getById: (id: string) => api.get(`/trips/${id}`),
  create: (data: any) => api.post('/trips', data),
  update: (id: string, data: any) => api.put(`/trips/${id}`, data),
  delete: (id: string) => api.delete(`/trips/${id}`),
  dispatch: (id: string) => api.patch(`/trips/${id}/dispatch`),
  complete: (id: string) => api.patch(`/trips/${id}/complete`),
};
```

#### Update Zustand Stores to Use API
```typescript
// src/store/vehicleStore.ts
import { create } from 'zustand';
import { vehicleAPI } from '@/services/api';

interface VehicleStore {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  fetchVehicles: () => Promise<void>;
  createVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<void>;
  updateVehicle: (id: string, data: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
}

export const useVehicleStore = create<VehicleStore>((set, get) => ({
  vehicles: [],
  isLoading: false,
  error: null,

  fetchVehicles: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await vehicleAPI.getAll();
      set({ vehicles: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createVehicle: async (vehicle) => {
    set({ isLoading: true, error: null });
    try {
      const response = await vehicleAPI.create(vehicle);
      set(state => ({ 
        vehicles: [...state.vehicles, response.data],
        isLoading: false 
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateVehicle: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await vehicleAPI.update(id, data);
      set(state => ({
        vehicles: state.vehicles.map(v => v.id === id ? response.data : v),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteVehicle: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await vehicleAPI.delete(id);
      set(state => ({
        vehicles: state.vehicles.filter(v => v.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
```

### 5. Environment Variables

Create `.env` file:
```env
# Backend
VITE_API_URL=http://localhost:5000/api
MONGODB_URI=mongodb://localhost:27017/fleetflow
JWT_SECRET=your_jwt_secret_key_here
PORT=5000

# Frontend (already configured)
NODE_ENV=development
```

### 6. Quick Backend Setup (Express + MongoDB)

Create `backend/server.js`:
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/trips', require('./routes/trips'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/fuel', require('./routes/fuel'));
app.use('/api/alerts', require('./routes/alerts'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### 7. Migration Steps

1. **Set up MongoDB** (or PostgreSQL)
2. **Create backend** with Express
3. **Define models/schemas**
4. **Implement API routes**
5. **Create API service layer** in frontend
6. **Update Zustand stores** to fetch from API
7. **Add loading states** to components
8. **Implement error handling**
9. **Test API endpoints**
10. **Deploy backend** (Heroku, Railway, Render)

### 8. Real-time Updates (Optional)

Add Socket.IO for live updates:
```bash
npm install socket.io socket.io-client
```

```javascript
// Backend
const io = require('socket.io')(server, {
  cors: { origin: 'http://localhost:5173' }
});

io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Emit updates when data changes
  socket.on('vehicle-updated', (data) => {
    io.emit('vehicle-update', data);
  });
});

// Frontend
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('vehicle-update', (data) => {
  // Update Zustand store
  useVehicleStore.getState().fetchVehicles();
});
```

## Deployment Options

### Backend Deployment
- **Railway**: Free tier, auto-deploy from GitHub
- **Render**: Free tier with automatic deployments
- **Heroku**: Free tier (with limitations)
- **DigitalOcean App Platform**: $5/month

### Database Hosting
- **MongoDB Atlas**: Free tier (512MB)
- **Supabase (PostgreSQL)**: Free tier (500MB)
- **PlanetScale (MySQL)**: Free tier (5GB)

## Next Steps

1. Choose your backend stack (MongoDB recommended)
2. Set up database (local or cloud)
3. Build API endpoints
4. Update frontend stores to consume API
5. Add authentication with JWT
6. Deploy backend and database
7. Update frontend API URL

---

**Note**: The current application works perfectly with mock data for development and demo purposes. Backend integration is required only for production deployment with persistent data storage.
