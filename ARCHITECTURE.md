# 🏗️ FleetFlow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                    http://localhost:5173                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Pages      │  │  Components  │  │   Routing    │         │
│  │              │  │              │  │              │         │
│  │ - Dashboard  │  │ - AppLayout  │  │ React Router │         │
│  │ - Vehicles   │  │ - Sidebar    │  │ Protected    │         │
│  │ - Drivers    │  │ - Charts     │  │ Routes       │         │
│  │ - Analytics  │  │ - Modals     │  │              │         │
│  └──────┬───────┘  └──────────────┘  └──────────────┘         │
│         │                                                        │
│  ┌──────▼────────────────────────────────────────────┐         │
│  │          Zustand Stores (State Management)        │         │
│  │                                                    │         │
│  │  vehicleStore  driverStore  tripStore            │         │
│  │  fuelStore     maintenanceStore  authStore       │         │
│  └──────┬────────────────────────────────────────────┘         │
│         │                                                        │
│  ┌──────▼────────────────────────────────────────────┐         │
│  │           API Client Layer (src/lib/api)          │         │
│  │                                                    │         │
│  │  - client.ts    (Fetch wrapper with JWT)         │         │
│  │  - index.ts     (Type-safe API functions)        │         │
│  │                                                    │         │
│  │  vehiclesApi   driversApi   tripsApi             │         │
│  │  fuelApi       maintenanceApi  authApi           │         │
│  └──────┬────────────────────────────────────────────┘         │
│         │                                                        │
└─────────┼────────────────────────────────────────────────────────┘
          │
          │ HTTP/JSON
          │ REST API
          │
┌─────────▼────────────────────────────────────────────────────────┐
│                      BACKEND (Express)                            │
│                   http://localhost:3001                           │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    API Routes                               │ │
│  │                                                             │ │
│  │  /api/auth        - Login, Register                        │ │
│  │  /api/vehicles    - CRUD for vehicles                      │ │
│  │  /api/drivers     - CRUD for drivers                       │ │
│  │  /api/trips       - CRUD for trips                         │ │
│  │  /api/fuel        - CRUD for fuel records                  │ │
│  │  /api/maintenance - CRUD for maintenance                   │ │
│  └────────┬───────────────────────────────────────────────────┘ │
│           │                                                       │
│  ┌────────▼───────────────────────────────────────────────────┐ │
│  │               Middleware & Auth                            │ │
│  │                                                             │ │
│  │  - CORS (localhost:5173)                                   │ │
│  │  - JWT verification                                        │ │
│  │  - Error handling                                          │ │
│  │  - JSON body parser                                        │ │
│  └────────┬───────────────────────────────────────────────────┘ │
│           │                                                       │
│  ┌────────▼───────────────────────────────────────────────────┐ │
│  │                 Prisma Client                              │ │
│  │                                                             │ │
│  │  - Auto-generated from schema                              │ │
│  │  - Type-safe database queries                              │ │
│  │  - Query builder                                           │ │
│  └────────┬───────────────────────────────────────────────────┘ │
│           │                                                       │
└───────────┼───────────────────────────────────────────────────────┘
            │
            │ PostgreSQL Protocol
            │
┌───────────▼───────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                           │
│                   postgresql://localhost:5432                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │    User      │  │   Vehicle    │  │    Driver    │           │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤           │
│  │ id           │  │ id           │  │ id           │           │
│  │ email        │  │ registration │  │ name         │           │
│  │ name         │  │ make         │  │ licenseNo    │           │
│  │ password     │  │ model        │  │ safetyScore  │           │
│  │ role         │  │ status       │  │ totalTrips   │           │
│  └──────────────┘  └──────┬───────┘  └──────┬───────┘           │
│                            │                  │                    │
│                            └────────┬─────────┘                    │
│                                     │                              │
│  ┌──────────────┐  ┌───────────────▼─┐  ┌──────────────┐        │
│  │  FuelRecord  │  │      Trip        │  │ Maintenance  │        │
│  ├──────────────┤  ├──────────────────┤  ├──────────────┤        │
│  │ id           │  │ id               │  │ id           │        │
│  │ vehicleId ──────┤ vehicleId (FK)   │  │ vehicleId ───────┐   │
│  │ fuelType     │  │ driverId (FK) ───────▶             │   │   │
│  │ quantity     │  │ origin           │  │ type         │   │   │
│  │ totalCost    │  │ destination      │  │ cost         │   │   │
│  │ efficiency   │  │ revenue          │  │ status       │   │   │
│  └──────────────┘  │ status           │  └──────────────┘   │   │
│                     └──────────────────┘                     │   │
│                                                              │   │
│  All foreign keys with CASCADE DELETE                       │   │
│  Indexes on frequently queried columns                      │   │
│                                                              │   │
└──────────────────────────────────────────────────────────────┘───┘


┌─────────────────────────────────────────────────────────────────┐
│                      DEVELOPMENT TOOLS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Prisma Studio  →  http://localhost:5555                       │
│  Visual database browser and editor                             │
│                                                                  │
│  Concurrently   →  npm run dev:all                             │
│  Runs frontend + backend together                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Example: Fetching Vehicles

```
1. User opens Vehicles Page
   └→ Component mounts, calls useVehicleStore()

2. Zustand Store
   └→ Calls fetchVehicles()
       └→ Uses vehiclesApi.getAll()

3. API Client (src/lib/api/client.ts)
   └→ GET http://localhost:3001/api/vehicles
       └→ Includes JWT token from localStorage
       └→ Sets Content-Type: application/json

4. Express Server (server/src/routes/vehicles.ts)
   └→ Receives request
       └→ Routes to vehicles.getAll()
           └→ Calls prisma.vehicle.findMany()

5. Prisma Client
   └→ Generates SQL query
       └→ SELECT * FROM "Vehicle" ORDER BY "createdAt" DESC;

6. PostgreSQL Database
   └→ Executes query
       └→ Returns rows

7. Response flows back:
   PostgreSQL → Prisma → Express → API Client → Zustand → React
   
8. React Component
   └→ Receives vehicles array
       └→ Re-renders with data
```

## 🔐 Authentication Flow

```
1. User enters credentials on LoginPage
   ↓
2. Submit → authApi.login({ email, password })
   ↓
3. POST /api/auth/login
   ↓
4. Backend verifies:
   - Find user by email
   - Compare password with bcrypt
   - Generate JWT token
   ↓
5. Response: { user: {...}, token: "jwt..." }
   ↓
6. Frontend stores token:
   - localStorage.setItem('auth_token', token)
   - apiClient.setToken(token)
   - useAuthStore.setUser(user)
   ↓
7. All subsequent requests include:
   Authorization: Bearer <token>
```

## 📦 Currency Handling (Indian Rupees)

```
Database Storage (paise):
  purchasePrice: 4500000000  (45,00,00,000 paise)
                  ↓
  Prisma returns as integer

Frontend Display:
  formatCurrency(4500000000 / 100)
                  ↓
  ₹45,00,000 (with Indian number formatting)
```

## 🚀 Development Commands

```powershell
# Start everything together
npm run dev:all

# Or separately:
npm run dev              # Frontend only (port 5173)
npm run dev:server       # Backend only (port 3001)

# Database management:
cd server
npm run prisma:studio    # Visual editor (port 5555)
npm run prisma:migrate   # Run new migrations
npm run prisma:seed      # Re-populate data
```

## 🎯 Key Technologies

- **Frontend:** React 18 + TypeScript + Vite
- **State:** Zustand (lightweight state management)
- **Styling:** TailwindCSS + Dark theme
- **Backend:** Express + TypeScript
- **Database:** PostgreSQL 14+
- **ORM:** Prisma 5
- **Auth:** JWT + bcrypt
- **Dev Tools:** tsx (TS execution), concurrently

## 📁 Project Structure

```
fleetflow/
├── src/                     # Frontend React application
│   ├── components/          # Reusable components
│   ├── pages/              # Page components
│   ├── store/              # Zustand stores
│   ├── lib/
│   │   ├── api/            # API client layer ✨
│   │   └── utils.ts        # Helpers
│   └── App.tsx
│
├── server/                  # Backend Express API ✨
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   └── index.ts        # Server entry
│   ├── prisma/
│   │   ├── schema.prisma   # DB schema
│   │   └── seed.ts         # Sample data
│   ├── package.json
│   └── tsconfig.json
│
├── public/                  # Static assets
├── package.json            # Frontend dependencies
├── vite.config.ts          # Vite configuration
└── tailwind.config.js      # Tailwind styling

✨ = New database-related additions
```

## 🌐 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | User login |
| POST | /api/auth/register | User registration |
| GET | /api/vehicles | List all vehicles |
| POST | /api/vehicles | Create vehicle |
| PUT | /api/vehicles/:id | Update vehicle |
| DELETE | /api/vehicles/:id | Delete vehicle |
| GET | /api/drivers | List all drivers |
| GET | /api/drivers/:id | Get driver with trips |
| GET | /api/trips?status=X | List trips (filtered) |
| GET | /api/fuel?vehicleId=X | Fuel records (filtered) |
| GET | /api/maintenance | List maintenance |

Full API docs in `DATABASE_SETUP.md`

---

Built with 💙 for FleetFlow
