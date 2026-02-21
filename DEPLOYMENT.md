# 🚀 FleetFlow - Deployment & Production Guide

## Production Build

### Build the Application

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Test the production build locally before deployment.

---

## Deployment Options

### 1. Vercel (Recommended)

**One-Click Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**Manual Deployment:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Configuration:**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

### 2. Netlify

**Drag & Drop:**
1. Build: `npm run build`
2. Drag `dist/` folder to Netlify

**CLI Deployment:**

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

**Configuration:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 3. AWS S3 + CloudFront

```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name

# Configure CloudFront distribution
# Enable SPA redirect: Error 404 → /index.html (200)
```

---

### 4. Docker

**Dockerfile:**

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**Build & Run:**

```bash
docker build -t fleetflow .
docker run -p 80:80 fleetflow
```

---

## Environment Configuration

### Production Environment Variables

Create `.env.production`:

```env
VITE_API_URL=https://api.yourfleetflow.com
VITE_APP_NAME=FleetFlow
VITE_VERSION=1.0.0
```

Access in code:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## Performance Optimization

### Already Implemented

✅ Code splitting with React Router
✅ Tree shaking (Vite)
✅ Minification
✅ CSS optimization (TailwindCSS)
✅ Asset optimization

### Additional Optimizations

**1. Enable Compression:**

```typescript
// vite.config.ts
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    compression({ algorithm: 'brotliCompress' })
  ]
});
```

**2. Add PWA Support:**

```bash
npm install vite-plugin-pwa -D
```

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'FleetFlow',
        short_name: 'FleetFlow',
        theme_color: '#3b82f6'
      }
    })
  ]
});
```

---

## Security Checklist

### Pre-Deployment

- [ ] Remove console.logs
- [ ] Update demo passwords
- [ ] Configure CORS properly
- [ ] Enable HTTPS only
- [ ] Add security headers
- [ ] Implement rate limiting (backend)
- [ ] Add input sanitization
- [ ] Configure CSP headers

### Recommended Headers

```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000";
```

---

## Monitoring & Analytics

### Add Error Tracking

**Sentry:**

```bash
npm install @sentry/react @sentry/tracing
```

```typescript
// main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### Add Analytics

**Google Analytics:**

```bash
npm install react-ga4
```

---

## Backend Integration

### API Integration Steps

1. **Create API Service:**

```typescript
// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  vehicles: {
    getAll: () => fetch(`${API_URL}/vehicles`),
    create: (data) => fetch(`${API_URL}/vehicles`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
};
```

2. **Update Zustand Stores:**

```typescript
// src/store/vehicleStore.ts
addVehicle: async (vehicle) => {
  const response = await api.vehicles.create(vehicle);
  const newVehicle = await response.json();
  set((state) => ({ vehicles: [...state.vehicles, newVehicle] }));
}
```

3. **Add Loading States:**

```typescript
interface VehicleState {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
}
```

---

## Database Schema

### Recommended Structure

**PostgreSQL Schema:**

```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id VARCHAR(50) UNIQUE NOT NULL,
  model VARCHAR(100) NOT NULL,
  license_plate VARCHAR(20) UNIQUE NOT NULL,
  max_capacity INTEGER NOT NULL,
  odometer INTEGER NOT NULL,
  acquisition_cost DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  type VARCHAR(20) NOT NULL,
  region VARCHAR(50) NOT NULL,
  license_expiry DATE,
  next_service_due INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  license_number VARCHAR(50) UNIQUE NOT NULL,
  license_category VARCHAR(20) NOT NULL,
  license_expiry DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  safety_score INTEGER CHECK (safety_score >= 0 AND safety_score <= 100),
  trip_completion_rate DECIMAL(5, 2),
  phone VARCHAR(20),
  email VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_number VARCHAR(50) UNIQUE NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id),
  driver_id UUID REFERENCES drivers(id),
  cargo_weight INTEGER NOT NULL,
  origin VARCHAR(200) NOT NULL,
  destination VARCHAR(200) NOT NULL,
  status VARCHAR(20) NOT NULL,
  estimated_revenue DECIMAL(10, 2) NOT NULL,
  start_odometer INTEGER,
  end_odometer INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  dispatched_at TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE TABLE maintenance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id),
  service_type VARCHAR(50) NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  odometer INTEGER NOT NULL,
  description TEXT,
  performed_by VARCHAR(100),
  next_service_due INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fuel_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id),
  liters DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  odometer INTEGER NOT NULL,
  location VARCHAR(200),
  price_per_liter DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Scaling Considerations

### Frontend

- [ ] Implement virtual scrolling for large lists
- [ ] Add pagination for tables
- [ ] Use React.lazy() for code splitting
- [ ] Implement caching strategy
- [ ] Add service worker for offline support

### Backend

- [ ] Add Redis for caching
- [ ] Implement rate limiting
- [ ] Use CDN for static assets
- [ ] Add database indexing
- [ ] Implement database connection pooling

---

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy FleetFlow

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## Testing

### Unit Tests

```bash
npm install -D vitest @testing-library/react
```

```typescript
// src/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency } from '@/lib/utils';

describe('formatCurrency', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
  });
});
```

### E2E Tests

```bash
npm install -D playwright
```

---

## Maintenance

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update all
npm update

# Update major versions
npx npm-check-updates -u
npm install
```

### Security Audits

```bash
# Check vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Force fix (may have breaking changes)
npm audit fix --force
```

---

## Support & Resources

### Documentation
- React: https://react.dev
- Vite: https://vitejs.dev
- TailwindCSS: https://tailwindcss.com
- Zustand: https://zustand-demo.pmnd.rs
- Recharts: https://recharts.org

### Community
- GitHub Issues: For bug reports
- Discussions: For questions and ideas
- Pull Requests: For contributions

---

**Ready for Production! 🚀**

FleetFlow is built with modern best practices and ready to scale.
