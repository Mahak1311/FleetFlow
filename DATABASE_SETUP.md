# FleetFlow Database Setup Guide

## Overview
FleetFlow now includes a PostgreSQL database with Prisma ORM for persistent data storage.

## Prerequisites
- PostgreSQL 14+ installed locally or access to cloud PostgreSQL
- Node.js 18+ installed

## Quick Setup

### 1. Install PostgreSQL (if not installed)

**Windows:**
```powershell
# Using Chocolatey
choco install postgresql

# Or download from: https://www.postgresql.org/download/windows/
```

**After installation:**
```powershell
# Set password for postgres user (use 'postgres' for development)
psql -U postgres
\password postgres
# Enter: postgres
\q
```

### 2. Create Database
```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE fleetflow;

# Exit
\q
```

### 3. Install Server Dependencies
```powershell
cd server
npm install
```

### 4. Configure Environment
The `.env` file is already created with default settings:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fleetflow?schema=public"
PORT=3001
JWT_SECRET="fleetflow-secret-key-dev-2026"
```

Update credentials if your PostgreSQL uses different user/password.

### 5. Run Database Migrations
```powershell
# Generate Prisma Client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# Seed with Indian fleet data
npm run prisma:seed
```

### 6. Start Backend Server
```powershell
# Development mode (auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

Server runs on: http://localhost:3001

## Database Schema

### Tables
- **User** - Authentication (Fleet Manager, Dispatcher, etc.)
- **Vehicle** - Fleet vehicles with Indian registrations
- **Driver** - Driver profiles with Indian licenses
- **Trip** - Trip records (Mumbai-Pune, Delhi-Jaipur, etc.)
- **FuelRecord** - Fuel consumption tracking (INR)
- **Maintenance** - Service and repair records (INR)

### Key Features
- All prices stored in paise (1 INR = 100 paise) for precision
- Indian vehicle registrations (MH-02-AB-1234)
- Indian driver licenses (DL-MH12345)
- Indian locations (Mumbai, Delhi, Bangalore, etc.)
- Cascading deletes for referential integrity

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user

### Vehicles
- `GET /api/vehicles` - List all vehicles
- `GET /api/vehicles/:id` - Get vehicle details
- `POST /api/vehicles` - Create vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Drivers
- `GET /api/drivers` - List all drivers
- `GET /api/drivers/:id` - Get driver with trips
- `POST /api/drivers` - Create driver
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver

### Trips
- `GET /api/trips?status=In Progress` - List trips
- `GET /api/trips/:id` - Get trip details
- `POST /api/trips` - Create trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Fuel Records
- `GET /api/fuel?vehicleId=xxx` - List fuel records
- `GET /api/fuel/:id` - Get fuel record
- `POST /api/fuel` - Create fuel record
- `PUT /api/fuel/:id` - Update fuel record
- `DELETE /api/fuel/:id` - Delete fuel record

### Maintenance
- `GET /api/maintenance?status=Scheduled` - List maintenance
- `GET /api/maintenance/:id` - Get maintenance record
- `POST /api/maintenance` - Create maintenance
- `PUT /api/maintenance/:id` - Update maintenance
- `DELETE /api/maintenance/:id` - Delete maintenance

## Prisma Studio
Visual database browser:
```powershell
npm run prisma:studio
```
Opens at: http://localhost:5555

## Default Users (for testing)
All passwords: `password123`

- ananya.iyer@fleetflow.in - Fleet Manager
- arjun.mehta@fleetflow.in - Dispatcher
- karan.malhotra@fleetflow.in - Safety Officer
- neha.gupta@fleetflow.in - Financial Analyst

## Troubleshooting

### Connection refused
- Ensure PostgreSQL is running: `pg_ctl status`
- Check DATABASE_URL in `.env`

### Migration errors
```powershell
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Then re-seed
npm run prisma:seed
```

### Port 3001 already in use
Change PORT in `.env` file

## Production Deployment

### Using Railway/Render/Heroku
1. Create PostgreSQL database
2. Set DATABASE_URL environment variable
3. Run migrations: `npx prisma migrate deploy`
4. Start server: `npm start`

### Using Docker
```dockerfile
# Dockerfile included in server/
docker build -t fleetflow-api .
docker run -p 3001:3001 --env-file .env fleetflow-api
```

## Next Steps
The frontend Zustand stores need to be updated to fetch data from the API instead of using in-memory data. This will be done automatically.
