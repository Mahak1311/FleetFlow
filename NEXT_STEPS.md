# 🎯 FleetFlow Database - Next Steps

## ✅ What's Been Set Up

### Backend Infrastructure
- ✅ Express + TypeScript server (`server/src/`)
- ✅ PostgreSQL + Prisma ORM configuration
- ✅ Complete REST API with CRUD operations
- ✅ JWT authentication endpoints
- ✅ Database schema with Indian localization
- ✅ Seed script with realistic Indian fleet data

### Frontend Integration
- ✅ API client service layer (`src/lib/api/`)
- ✅ Type-safe API interfaces
- ✅ Environment configuration
- ✅ Concurrent dev script for running both servers

## 🚀 To Start Using the Database

### Step 1: Install PostgreSQL

**Windows (if not installed):**
```powershell
# Option A: Using Chocolatey
choco install postgresql

# Option B: Download installer
# Visit: https://www.postgresql.org/download/windows/
```

**After installation, set password:**
```powershell
psql -U postgres
\password postgres
# Enter: postgres (or your preferred password)
\q
```

### Step 2: Create Database

```powershell
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE fleetflow;

# Verify
\l
\q
```

### Step 3: Configure Connection

Update `server/.env` if needed:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/fleetflow"
```

### Step 4: Run Migrations & Seed

```powershell
cd server

# Generate Prisma Client
npm run prisma:generate

# Create tables
npm run prisma:migrate
# When prompted, enter migration name: "init"

# Seed with data
npm run prisma:seed
```

### Step 5: Start Development

**Option A - Both servers together:**
```powershell
# From root directory
npm run dev:all
```

**Option B - Separate terminals:**
```powershell
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

## 🔍 Verify Setup

### Check Backend is Running
```powershell
# In browser or curl
curl http://localhost:3001/health

# Should return: {"status":"ok","message":"FleetFlow API is running"}
```

### Browse Database
```powershell
cd server
npm run prisma:studio
# Opens visual database browser at http://localhost:5555
```

### Test API Endpoints
```powershell
# Get all vehicles
curl http://localhost:3001/api/vehicles

# Login
curl -X POST http://localhost:3001/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"ananya.iyer@fleetflow.in\",\"password\":\"password123\"}"
```

## 📊 What's in the Database

### Users (4)
- Ananya Iyer (Fleet Manager)
- Arjun Mehta (Dispatcher)  
- Karan Malhotra (Safety Officer)
- Neha Gupta (Financial Analyst)
- Password for all: `password123`

### Vehicles (5)
- Tata Prima 4940.S (MH-02-AB-1234)
- Ashok Leyland 4825 (DL-01-XY-5678)
- Mahindra Supro Cargo (KA-03-DE-9012)
- BharatBenz 4928 TT (GJ-01-GH-3456)
- Tata Ace Mega XL (TN-07-JK-7890)

### Drivers (5)
- Rajesh Kumar (DL-MH12345)
- Priya Sharma (DL-DL67890)
- Amit Patel (DL-GJ11223)
- Sunita Reddy (DL-TN44556)
- Vikram Singh (DL-HR78901)

### Sample Data
- 3 Trips (Mumbai-Pune, Delhi-Jaipur, Bangalore-Chennai)
- 3 Fuel Records
- 3 Maintenance Records

## 🔄 Next: Update Frontend Stores

The frontend stores (`src/store/*`) still use in-memory data. To connect them to the database:

### Example: Update vehicleStore

```typescript
import { create } from 'zustand';
import { vehiclesApi, Vehicle } from '@/lib/api';

interface VehicleStore {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  fetchVehicles: () => Promise<void>;
  addVehicle: (vehicle: Partial<Vehicle>) => Promise<void>;
  updateVehicle: (id: string, data: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
}

export const useVehicleStore = create<VehicleStore>((set) => ({
  vehicles: [],
  loading: false,
  error: null,

  fetchVehicles: async () => {
    set({ loading: true, error: null });
    try {
      const vehicles = await vehiclesApi.getAll();
      set({ vehicles, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addVehicle: async (vehicle) => {
    try {
      const newVehicle = await vehiclesApi.create(vehicle);
      set((state) => ({ vehicles: [...state.vehicles, newVehicle] }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  updateVehicle: async (id, data) => {
    try {
      const updated = await vehiclesApi.update(id, data);
      set((state) => ({
        vehicles: state.vehicles.map((v) => (v.id === id ? updated : v)),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  deleteVehicle: async (id) => {
    try {
      await vehiclesApi.delete(id);
      set((state) => ({
        vehicles: state.vehicles.filter((v) => v.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },
}));
```

### Then in components:
```typescript
// Fetch data on mount
useEffect(() => {
  fetchVehicles();
}, []);
```

## 🛠️ Useful Commands

```powershell
# Server commands (run in server/ directory)
npm run dev              # Start dev server with auto-reload
npm run build            # Build for production
npm run start            # Start production server
npm run prisma:generate  # Regenerate Prisma Client
npm run prisma:migrate   # Run new migrations
npm run prisma:seed      # Re-seed database
npm run prisma:studio    # Open database browser

# Frontend commands (run in root directory)
npm run dev              # Start Vite dev server
npm run dev:all          # Start both frontend + backend
npm run build            # Build for production
```

## 🐛 Troubleshooting

### "Connection refused" error
- Ensure PostgreSQL is running: `pg_ctl status`
- Check DATABASE_URL in `server/.env`

### "Database does not exist"
```powershell
psql -U postgres
CREATE DATABASE fleetflow;
\q
```

### Reset everything
```powershell
cd server
npx prisma migrate reset  # WARNING: Deletes all data
npm run prisma:seed
```

### Port 3001 already in use
Change `PORT=3002` in `server/.env`

## 🎉 You're All Set!

Once PostgreSQL is set up and migrations are run, you'll have:
- 💾 Persistent data storage
- 🔒 Secure authentication
- 🚀 RESTful API
- 🇮🇳 Indian localization
- 📊 Visual database management

Happy building! 🚛
