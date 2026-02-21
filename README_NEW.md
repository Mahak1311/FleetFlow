# 🚛 FleetFlow - Enterprise Fleet Management System

A comprehensive fleet management solution with PostgreSQL database, built with React + TypeScript frontend and Express + Prisma backend.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### 1. Install Dependencies

**Root (Frontend):**
```powershell
npm install
```

**Backend:**
```powershell
cd server
npm install
```

### 2. Setup PostgreSQL Database

**Install PostgreSQL (if needed):**
```powershell
# Using Chocolatey
choco install postgresql

# Or download from: https://www.postgresql.org/download/
```

**Create Database:**
```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE fleetflow;
\q
```

### 3. Configure Environment

Update `server/.env` with your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/fleetflow"
PORT=3001
JWT_SECRET="your-secret-key"
```

### 4. Initialize Database

```powershell
cd server

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed with Indian fleet data
npm run prisma:seed
```

### 5. Run Application

**Option A: Run both frontend + backend together:**
```powershell
# From root directory
npm run dev:all
```

**Option B: Run separately:**
```powershell
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Prisma Studio: http://localhost:5555 (run `npm run prisma:studio` in server/)

## 📦 Features

### Backend (Express + Prisma + PostgreSQL)
- ✅ RESTful API with TypeScript
- ✅ PostgreSQL database with Prisma ORM
- ✅ JWT authentication
- ✅ CRUD operations for all entities
- ✅ Indian localization (INR, Indian registrations, licenses)
- ✅ Cascading deletes and referential integrity

### Frontend (React + TypeScript + Zustand)
- ✅ Modern React 18 with hooks
- ✅ Type-safe with TypeScript
- ✅ Zustand state management (now syncs with backend)
- ✅ Animated sidebar navigation
- ✅ Interactive dashboards and analytics
- ✅ Dark tactical theme
- ✅ Responsive design

### Database Schema
- **Users** - Authentication with role-based access
- **Vehicles** - Fleet vehicles with Indian registrations
- **Drivers** - Driver profiles with Indian licenses
- **Trips** - Trip tracking with Indian routes
- **Fuel Records** - Fuel consumption in INR
- **Maintenance** - Service and repair records in INR

## 🔑 Default Test Users

All passwords: `password123`

- `ananya.iyer@fleetflow.in` - Fleet Manager
- `arjun.mehta@fleetflow.in` - Dispatcher
- `karan.malhotra@fleetflow.in` - Safety Officer
- `neha.gupta@fleetflow.in` - Financial Analyst

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Vehicles
- `GET /api/vehicles` - List all vehicles
- `GET /api/vehicles/:id` - Get vehicle by ID
- `POST /api/vehicles` - Create vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Drivers
- `GET /api/drivers` - List all drivers
- `GET /api/drivers/:id` - Get driver by ID (includes trips)
- `POST /api/drivers` - Create driver
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver

### Trips
- `GET /api/trips?status=In Progress` - List trips (optional status filter)
- `GET /api/trips/:id` - Get trip by ID
- `POST /api/trips` - Create trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Fuel Records
- `GET /api/fuel?vehicleId=xxx` - List fuel records (optional vehicle filter)
- `GET /api/fuel/:id` - Get fuel record by ID
- `POST /api/fuel` - Create fuel record
- `PUT /api/fuel/:id` - Update fuel record
- `DELETE /api/fuel/:id` - Delete fuel record

### Maintenance
- `GET /api/maintenance?status=Scheduled` - List maintenance (filters: status, vehicleId)
- `GET /api/maintenance/:id` - Get maintenance by ID
- `POST /api/maintenance` - Create maintenance
- `PUT /api/maintenance/:id` - Update maintenance
- `DELETE /api/maintenance/:id` - Delete maintenance

## 🛠️ Development Tools

### Prisma Studio
Visual database browser:
```powershell
cd server
npm run prisma:studio
```
Opens at http://localhost:5555

### Reset Database
⚠️ WARNING: Deletes all data
```powershell
cd server
npx prisma migrate reset
npm run prisma:seed
```

## 📁 Project Structure

```
fleetflow/
├── src/                      # Frontend React app
│   ├── components/           # React components
│   ├── pages/               # Page components
│   ├── store/               # Zustand stores (now sync with API)
│   ├── lib/                 # Utilities and API client
│   │   ├── api/             # API service layer
│   │   └── utils.ts         # Helper functions
│   └── App.tsx              # Main app component
├── server/                   # Backend Express app
│   ├── src/
│   │   ├── routes/          # API routes
│   │   └── index.ts         # Express server
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Seed data script
│   ├── package.json
│   └── tsconfig.json
├── public/                   # Static assets
├── package.json             # Frontend dependencies
└── README.md
```

## 🔧 Configuration

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

### Backend (server/.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/fleetflow"
PORT=3001
JWT_SECRET="your-secret-key-change-in-production"
NODE_ENV="development"
```

## 🚢 Production Deployment

### Backend
1. Set up PostgreSQL database (Railway/Render/Heroku/AWS RDS)
2. Set `DATABASE_URL` environment variable
3. Run migrations: `npx prisma migrate deploy`
4. Build: `npm run build`
5. Start: `npm start`

### Frontend
1. Build: `npm run build`
2. Deploy `dist/` folder to Vercel/Netlify/AWS S3
3. Set `VITE_API_URL` to production backend URL

## 📊 Indian Localization

FleetFlow is fully localized for the Indian market:

- **Currency:** All amounts in Indian Rupees (₹)
- **Vehicle Registrations:** Indian format (MH-02-AB-1234)
- **Driver Licenses:** Indian format (DL-MH12345)
- **Routes:** Indian cities (Mumbai, Delhi, Bangalore, Chennai)
- **Vehicles:** Indian brands (Tata, Ashok Leyland, BharatBenz, Mahindra)
- **Phone Numbers:** +91 format

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - feel free to use for commercial projects

## 🆘 Support

For issues or questions:
1. Check [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed database setup
2. Check [QUICKSTART.md](QUICKSTART.md) for troubleshooting
3. Open an issue on GitHub

---

Built with ❤️ for the Indian logistics industry
