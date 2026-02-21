# FleetFlow - Feature Documentation

## 🎯 Core Features Implemented

### 1. Authentication & Role-Based Access Control (RBAC)

**Login System:**
- Secure email + password authentication
- Session-based state management
- Protected routes with automatic redirect

**User Roles:**
- **Fleet Manager**: Full access to all modules
- **Dispatcher**: Access to vehicles, trips, and drivers
- **Safety Officer**: Access to vehicles, maintenance, and drivers
- **Financial Analyst**: Access to dashboard, fuel, and analytics

**Role Enforcement:**
- Dynamic navigation menu based on role
- Route-level protection
- Feature-level access control

---

### 2. Command Center (Main Dashboard)

**Design:** Dark tactical command center aesthetic

**Features:**
- **KPI Cards:**
  - Active Fleet (vehicles on trip)
  - Vehicles In Shop
  - Utilization Rate (with circular progress gauge)
  - Pending Cargo

- **Fleet Status Grid:**
  - Filterable vehicle cards
  - Filter by: Vehicle Type, Status, Region
  - Real-time status indicators
  - Alert badges for license expiry

- **Alerts Panel:**
  - License expiry alerts
  - Maintenance due alerts
  - Cost spike warnings
  - Driver compliance notifications
  - Dismissible alerts

- **Visual Elements:**
  - Glassmorphism cards
  - Animated circular progress gauge
  - Color-coded status pills
  - Hover effects and micro-interactions

---

### 3. Vehicle Registry (Asset Management)

**CRUD Operations:**
- Add new vehicles
- Edit vehicle details
- Delete vehicles
- View detailed vehicle information

**Vehicle Fields:**
- Vehicle ID (unique identifier)
- Model & Type (Truck, Van, Semi, Trailer)
- License Plate
- Max Capacity (kg)
- Odometer (km)
- Acquisition Cost
- Status (Available, On Trip, In Shop, Retired)
- Region
- License Expiry
- Next Service Due

**Features:**
- Search functionality
- Sortable table view
- Detail modal with financial summary
- License expiry warnings
- Maintenance alerts
- Fuel and maintenance cost tracking per vehicle

**Business Logic:**
- Retired vehicles cannot be dispatched
- License expiry validation
- Service interval tracking
- Cost per km calculations

---

### 4. Trip Dispatcher & Lifecycle Management

**Design:** Kanban-style workflow board

**Trip Lifecycle States:**
1. **Draft**: Initial creation
2. **Dispatched**: Assigned and ready
3. **On Route**: Currently in transit
4. **Completed**: Successfully finished
5. **Cancelled**: Terminated

**Trip Creation:**
- Select available vehicle
- Select on-duty driver
- Enter cargo weight
- Set origin and destination
- Estimate revenue

**Validation Rules:**
✅ Vehicle must be "Available"
✅ Driver must be "On Duty" and compliant
✅ Cargo weight cannot exceed vehicle capacity
✅ Vehicle license must not be expired
✅ Driver license must not be expired
✅ Vehicle cannot be "In Shop"
✅ Driver cannot be "On Trip"

**Trip Management:**
- Dispatch trips (updates vehicle and driver status)
- Start route tracking
- Complete trips (enter final odometer)
- Cancel trips (restore availability)
- Real-time status updates

**State Synchronization:**
- Vehicle status updates on dispatch/completion
- Driver status updates on dispatch/completion
- Odometer updates on completion
- Financial calculations on completion

---

### 5. Maintenance & Service Logs

**Service Types:**
- Oil Change
- Tire Replacement
- Brake Service
- Engine Repair
- Inspection
- Other

**Features:**
- Add service logs with full details
- Auto-update vehicle status to "In Shop"
- Track service costs
- Set next service due
- Service history per vehicle
- Predictive maintenance alerts

**Service Log Fields:**
- Vehicle ID
- Service Type
- Cost
- Date
- Odometer reading
- Description
- Performed by
- Next service due

**Analytics:**
- Total maintenance cost
- Average cost per service
- Cost tracking per vehicle

---

### 6. Fuel & Expense Logging

**Features:**
- Log fuel purchases
- Auto-calculate price per liter
- Track operational costs
- Cost per km calculations
- Trip-level cost aggregation

**Fuel Log Fields:**
- Vehicle ID
- Liters
- Total cost
- Date
- Odometer
- Location
- Price per liter (auto-calculated)

**Metrics:**
- Total fuel cost
- Total liters consumed
- Average price per liter
- Fuel efficiency per vehicle

---

### 7. Driver Profiles & Safety

**Driver Information:**
- Name & contact details
- License number & category (Class A, B, C)
- License expiry date
- Status (On Duty, On Trip, Off Duty, Suspended)
- Safety score (0-100)
- Trip completion rate (%)

**Features:**
- Driver CRUD operations
- License expiry tracking
- Compliance monitoring
- Safety score visualization
- Performance metrics
- Expiry countdown alerts

**Driver Status Management:**
- Automatic status updates on trip dispatch/completion
- Manual status changes
- Suspended driver blocking

**Compliance:**
- License expiry warnings (90-day threshold)
- Expired license blocking
- Safety score tracking
- Trip completion rate monitoring

---

### 8. Financial Analytics Dashboard

**Design:** Clean fintech-style light theme

**KPI Cards:**
- Total Revenue
- Total Operational Cost
- Net Profit (with margin %)
- Cost per KM

**Charts & Visualizations:**
1. **Revenue vs Expenses Line Chart:**
   - Monthly timeline
   - Revenue, expenses, and profit lines
   - Interactive tooltips

2. **Cost Breakdown Pie Chart:**
   - Fuel vs Maintenance
   - Percentage distribution
   - Color-coded segments

3. **Vehicle ROI Ranking Table:**
   - ROI calculation: (Revenue - Costs) / Acquisition Cost
   - Revenue per vehicle
   - Costs per vehicle
   - Fuel efficiency (km/L)
   - Sortable by ROI

**Export Functionality:**
- CSV export of key metrics
- Date-stamped filename

---

## 🎨 Design System

### Operations Pages (Dark Theme)
- **Background**: Deep navy/charcoal (#0a0e1a, #131826)
- **Primary Accent**: Electric blue (#3b82f6)
- **Success**: Emerald green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Soft red (#ef4444)
- **Cards**: Glassmorphism with backdrop blur
- **Typography**: Inter font family
- **Borders**: Rounded 16px
- **Shadows**: Soft elevated shadows

### Financial Analytics (Light Theme)
- **Background**: Clean white/off-white (#f8fafc, #ffffff)
- **Revenue**: Blue (#3b82f6)
- **Expenses**: Red/Orange (#ef4444)
- **Profit**: Emerald green (#10b981)
- **Typography**: Strong hierarchy
- **Charts**: Recharts with clean styling

---

## 🔧 Technical Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

### Project Structure
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── AppLayout.tsx # Main app layout with sidebar
│   └── ProtectedRoute.tsx # Route protection
├── pages/            # Feature pages
├── store/            # Zustand state stores
├── types/            # TypeScript types
├── lib/              # Utilities and helpers
└── main.tsx          # App entry point
```

### State Management
- **authStore**: User authentication and sessions
- **vehicleStore**: Vehicle fleet management
- **driverStore**: Driver profiles and status
- **tripStore**: Trip lifecycle and dispatch
- **maintenanceStore**: Service logs
- **fuelStore**: Fuel expense tracking
- **alertStore**: System alerts and notifications

---

## 🚀 Key Differentiators

### Premium Features
1. **Fleet Health Score**: Aggregated metrics
2. **Smart Dispatch**: Validation-based suggestions
3. **Risk Alerts Panel**: Proactive notifications
4. **Animated KPI Counters**: Smooth transitions
5. **Slide-in Detail Drawers**: Modal-based details
6. **State Engine**: Comprehensive lifecycle management
7. **Real-time Synchronization**: Cross-module updates
8. **Predictive Maintenance**: Odometer-based alerts
9. **ROI Analytics**: Per-vehicle profitability
10. **Export Functionality**: CSV data export

### User Experience
- Smooth hover states and transitions
- Micro-interactions throughout
- Responsive design (mobile-friendly)
- Intuitive navigation
- Color-coded status system
- Clear visual hierarchy
- Loading states and animations
- Error handling and validation
- Professional enterprise aesthetic

---

## 📊 Business Logic

### Vehicle State Engine
```
Available → On Trip → Available
Available → In Shop → Available
Available → Retired (terminal)
```

### Driver State Engine
```
On Duty → On Trip → On Duty
On Duty → Off Duty → On Duty
On Duty → Suspended (requires manual restore)
```

### Trip Workflow
```
Draft → Dispatched → On Route → Completed
Draft → Cancelled
Dispatched → Cancelled
```

---

## 🔐 Security & Validation

### Input Validation
- Required field validation
- Type checking (numbers, dates, emails)
- Range validation (capacity, weight)
- Business rule enforcement

### Access Control
- Route-level protection
- Role-based feature access
- Session management
- Automatic logout on unauthorized access

---

## 📱 Responsive Design

- Mobile-friendly sidebar (collapsible)
- Responsive grid layouts
- Touch-friendly buttons
- Adaptive card sizing
- Mobile navigation overlay
- Scrollable tables on mobile

---

## 🎯 Next Steps & Enhancements

### Potential Additions
1. Real-time notifications
2. Advanced reporting
3. Fleet health scoring algorithm
4. Smart dispatch recommendations
5. Integration with GPS tracking
6. Automated maintenance scheduling
7. Driver performance trends
8. Cost forecasting
9. API integration
10. Multi-tenant support

---

## 📖 Usage Guide

### Login
Use any of the demo accounts:
- manager@fleetflow.com / password123
- dispatcher@fleetflow.com / password123
- safety@fleetflow.com / password123
- analyst@fleetflow.com / password123

### Navigation
- Access modules from the sidebar
- Role-based menu items
- Click on entities for details
- Use filters for data refinement

### Operations
1. **Add Vehicle** → Vehicle Registry → Add Vehicle button
2. **Create Trip** → Trip Dispatcher → Create Trip
3. **Log Fuel** → Fuel & Expenses → Add Fuel Log
4. **Add Service** → Maintenance → Add Service Log
5. **Manage Drivers** → Drivers → Add/Edit Driver
6. **View Analytics** → Financial Analytics dashboard

---

**Built with ❤️ for Enterprise Fleet Management**
