# ⚡ FleetFlow Database - Quick Reference

## 🚀 One-Command Start (After PostgreSQL Setup)

```powershell
npm run dev:all
```

Opens:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

---

## 📋 Essential Commands

### First-Time Setup
```powershell
# 1. Create database
psql -U postgres -c "CREATE DATABASE fleetflow;"

# 2. Setup tables and data
cd server
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### Daily Development
```powershell
# Start both servers
npm run dev:all

# Or separately:
npm run dev              # Frontend
npm run dev:server       # Backend
```

### Database Management
```powershell
cd server

# Visual database editor
npm run prisma:studio

# Add new migration
npm run prisma:migrate

# Reset & re-seed (⚠️ deletes data)
npx prisma migrate reset
npm run prisma:seed
```

---

## 🔑 Default Login

**Email:** `ananya.iyer@fleetflow.in`  
**Password:** `password123`

All test users use same password.

---

## 📊 Database Schema

| Table | Purpose | Indian Features |
|-------|---------|----------------|
| User | Auth & roles | @fleetflow.in emails |
| Vehicle | Fleet management | MH-02-AB-1234 plates |
| Driver | Driver profiles | DL-MH12345 licenses |
| Trip | Dispatch tracking | Mumbai→Pune routes |
| FuelRecord | Fuel consumption | INR (paise) |
| Maintenance | Service history | INR (paise) |

---

## 🔌 API Endpoints

### Authentication
```powershell
POST /api/auth/login
POST /api/auth/register
```

### Entities (CRUD pattern for all)
```powershell
GET    /api/vehicles
GET    /api/vehicles/:id
POST   /api/vehicles
PUT    /api/vehicles/:id
DELETE /api/vehicles/:id

# Same pattern for:
/api/drivers
/api/trips
/api/fuel
/api/maintenance
```

### Query Filters
```powershell
GET /api/trips?status=In Progress
GET /api/fuel?vehicleId=abc123
GET /api/maintenance?status=Scheduled&vehicleId=xyz789
```

---

## 💻 Testing API

### Health Check
```powershell
curl http://localhost:3001/health
```

### Login
```powershell
curl -X POST http://localhost:3001/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"ananya.iyer@fleetflow.in\",\"password\":\"password123\"}"
```

### Get Vehicles
```powershell
curl http://localhost:3001/api/vehicles
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `server/.env` | Database connection |
| `server/prisma/schema.prisma` | Database structure |
| `server/src/routes/` | API endpoints |
| `src/lib/api/` | Frontend API client |
| `DATABASE_SETUP.md` | Full setup guide |
| `NEXT_STEPS.md` | Getting started |

---

## 🐛 Quick Troubleshooting

### Backend won't start
```powershell
# Check PostgreSQL is running
pg_ctl status

# Verify .env file exists
cat server/.env

# Regenerate Prisma client
cd server
npm run prisma:generate
```

### "Database doesn't exist"
```powershell
psql -U postgres -c "CREATE DATABASE fleetflow;"
cd server
npm run prisma:migrate
```

### Port already in use
Edit `server/.env`:
```env
PORT=3002
```

### Frontend can't connect to API
Check `.env` in root:
```env
VITE_API_URL=http://localhost:3001/api
```

---

## 💾 Sample Data

After seeding, you'll have:

| Type | Count | Examples |
|------|-------|----------|
| Users | 4 | Fleet Manager, Dispatcher, etc. |
| Vehicles | 5 | Tata Prima, Ashok Leyland, etc. |
| Drivers | 5 | Rajesh Kumar, Priya Sharma, etc. |
| Trips | 3 | Mumbai→Pune, Delhi→Jaipur, etc. |
| Fuel Records | 3 | Diesel, various stations |
| Maintenance | 3 | Oil change, Inspection, etc. |

---

## 🎨 Frontend Integration

### Using API in Components

```typescript
import { vehiclesApi } from '@/lib/api';
import { useEffect, useState } from 'react';

function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    vehiclesApi.getAll()
      .then(setVehicles)
      .catch(console.error);
  }, []);

  return (
    <div>
      {vehicles.map(v => (
        <div key={v.id}>{v.registration}</div>
      ))}
    </div>
  );
}
```

### Using with Zustand

```typescript
import { create } from 'zustand';
import { vehiclesApi } from '@/lib/api';

export const useVehicleStore = create((set) => ({
  vehicles: [],
  loading: false,
  
  fetchVehicles: async () => {
    set({ loading: true });
    const vehicles = await vehiclesApi.getAll();
    set({ vehicles, loading: false });
  },
}));
```

---

## 📚 Documentation Files

1. **DATABASE_SETUP.md** - PostgreSQL installation & configuration
2. **NEXT_STEPS.md** - Step-by-step getting started
3. **ARCHITECTURE.md** - System architecture diagrams
4. **DATABASE_CHECKLIST.md** - Complete setup checklist
5. **QUICK_REFERENCE.md** - This file!

---

## 🎯 Common Tasks

### Add a new vehicle
```powershell
curl -X POST http://localhost:3001/api/vehicles ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -d "{\"registration\":\"TN-09-AB-1234\",\"make\":\"Tata\",\"model\":\"Ace\",...}"
```

### View all drivers
```powershell
curl http://localhost:3001/api/drivers
```

### Create a trip
```powershell
curl -X POST http://localhost:3001/api/trips ^
  -H "Content-Type: application/json" ^
  -d "{\"vehicleId\":\"...\",\"driverId\":\"...\",\"origin\":\"Mumbai\",...}"
```

---

## 🔒 Security Notes

- JWT tokens expire in 7 days
- Passwords hashed with bcrypt (10 rounds)
- CORS restricted to localhost:5173
- .env files in .gitignore (never commit!)

**Production Checklist:**
- [ ] Change JWT_SECRET
- [ ] Use strong database password
- [ ] Enable HTTPS
- [ ] Update CORS origin
- [ ] Set NODE_ENV=production

---

## 📞 Need Help?

1. **Setup Issues:** See `DATABASE_SETUP.md`
2. **API Questions:** See `ARCHITECTURE.md`
3. **Step-by-step:** See `NEXT_STEPS.md`
4. **Status Check:** See `DATABASE_CHECKLIST.md`

---

## ✨ Quick Tips

- Use `Prisma Studio` for visual database editing
- All prices in paise (divide by 100 for display)
- Indian number format: `new Intl.NumberFormat('en-IN')`
- JWT token auto-stored in localStorage
- API client auto-adds Authorization header

---

**Status:** ✅ Backend ready | ⏳ Needs PostgreSQL + migrations

Run `npm run dev:all` after database setup to start! 🚀
