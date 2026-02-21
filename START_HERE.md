# 🚀 START HERE - Database Setup

## 👋 Welcome!

Your FleetFlow application now has **PostgreSQL database** integration! Follow these simple steps to get started.

---

## ⏱️ Time Required
**15-30 minutes** for first-time setup

---

## 📋 Prerequisites Checklist

- [ ] Node.js installed (v18+)
- [ ] npm working
- [ ] Basic terminal/PowerShell knowledge

---

## 🎯 Setup Steps

### 1️⃣ Install PostgreSQL

**Option A: Using Chocolatey (Recommended)**
```powershell
choco install postgresql
```

**Option B: Manual Download**
Download from: https://www.postgresql.org/download/windows/

**Set Password:**
```powershell
psql -U postgres
\password postgres
# Enter: postgres
\q
```

---

### 2️⃣ Create Database

```powershell
psql -U postgres
```

Then in psql prompt:
```sql
CREATE DATABASE fleetflow;
\l
\q
```

You should see `fleetflow` in the database list.

---

### 3️⃣ Setup Backend

```powershell
cd server
npm install
npm run prisma:generate
npm run prisma:migrate
```

When prompted for migration name, type: **init**

---

### 4️⃣ Load Sample Data

```powershell
npm run prisma:seed
```

This creates:
- ✅ 4 user accounts
- ✅ 5 vehicles (Tata, Ashok Leyland, etc.)
- ✅ 5 drivers (Rajesh, Priya, Amit, etc.)
- ✅ 3 active trips
- ✅ 3 fuel records
- ✅ 3 maintenance records

---

### 5️⃣ Start Development

```powershell
cd ..
npm run dev:all
```

This starts:
- 🎨 **Frontend:** http://localhost:5173
- 🔧 **Backend:** http://localhost:3001

---

### 6️⃣ Test Login

Open browser: http://localhost:5173

**Credentials:**
- Email: `ananya.iyer@fleetflow.in`
- Password: `password123`

---

## ✅ Success Checklist

After setup, verify these are working:

- [ ] Backend health check: http://localhost:3001/health
- [ ] Frontend loads: http://localhost:5173
- [ ] Can login with test credentials
- [ ] Can see vehicles, drivers, trips

---

## 🎉 You're Done!

Your FleetFlow now has:
- ✅ Persistent PostgreSQL database
- ✅ RESTful API backend
- ✅ JWT authentication
- ✅ Indian localized data

---

## 📚 What to Read Next

| If you want to... | Read this |
|-------------------|-----------|
| See quick commands | `QUICK_REFERENCE.md` |
| Understand architecture | `ARCHITECTURE.md` |
| Troubleshoot issues | `DATABASE_SETUP.md` |
| Learn API usage | `NEXT_STEPS.md` |

---

## 🛠️ Daily Development

From now on, just run:
```powershell
npm run dev:all
```

Everything starts automatically!

---

## 🆘 Having Issues?

### PostgreSQL won't start
```powershell
# Check status
pg_ctl status

# Restart
pg_ctl restart
```

### Database doesn't exist
```powershell
psql -U postgres -c "CREATE DATABASE fleetflow;"
```

### Migration errors
```powershell
cd server
npx prisma migrate reset
npm run prisma:seed
```

### Port already in use
Edit `server/.env`:
```env
PORT=3002
```

---

## 🎯 Quick Commands

```powershell
# Start everything
npm run dev:all

# Visual database browser
cd server
npm run prisma:studio

# Reset database (⚠️ deletes data)
cd server
npx prisma migrate reset
npm run prisma:seed

# Check backend is running
curl http://localhost:3001/health
```

---

## 📊 What's in the Database

### Test Users (all password: `password123`)
- `ananya.iyer@fleetflow.in` - Fleet Manager
- `arjun.mehta@fleetflow.in` - Dispatcher
- `karan.malhotra@fleetflow.in` - Safety Officer
- `neha.gupta@fleetflow.in` - Financial Analyst

### Sample Vehicles
- Tata Prima 4940.S (MH-02-AB-1234)
- Ashok Leyland 4825 (DL-01-XY-5678)
- Mahindra Supro Cargo (KA-03-DE-9012)
- BharatBenz 4928 TT (GJ-01-GH-3456)
- Tata Ace Mega XL (TN-07-JK-7890)

### Sample Trips
- Mumbai → Pune (148 km)
- Delhi → Jaipur (280 km)
- Bangalore → Chennai (345 km)

---

## 🚀 Next Steps

1. **Explore Prisma Studio:**
   ```powershell
   cd server
   npm run prisma:studio
   ```
   Opens at: http://localhost:5555

2. **Test API Endpoints:**
   ```powershell
   curl http://localhost:3001/api/vehicles
   curl http://localhost:3001/api/drivers
   ```

3. **Update Frontend Stores** (optional):
   See `NEXT_STEPS.md` for examples of connecting Zustand stores to the API

---

## 🎓 Learn More

- **PostgreSQL Basics:** https://www.postgresql.org/docs/
- **Prisma ORM:** https://www.prisma.io/docs/
- **Express API:** https://expressjs.com/

---

## ✨ Features You Now Have

| Feature | Status |
|---------|--------|
| Persistent Database | ✅ |
| User Authentication | ✅ |
| RESTful API | ✅ |
| CRUD Operations | ✅ |
| Indian Localization | ✅ |
| Type-Safe Queries | ✅ |
| Visual DB Editor | ✅ |
| Sample Data | ✅ |

---

## 🎉 Congratulations!

You've successfully added a professional-grade database to FleetFlow!

**Now start developing:** `npm run dev:all`

---

**Questions?** Check the other documentation files or the code comments!

**Happy Coding! 🚛💨**
