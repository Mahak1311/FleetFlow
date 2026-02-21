import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.maintenance.deleteMany();
  await prisma.fuelRecord.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  // Seed Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'ananya.iyer@fleetflow.in',
        name: 'Ananya Iyer',
        password: hashedPassword,
        role: 'Fleet Manager',
      },
    }),
    prisma.user.create({
      data: {
        email: 'arjun.mehta@fleetflow.in',
        name: 'Arjun Mehta',
        password: hashedPassword,
        role: 'Dispatcher',
      },
    }),
    prisma.user.create({
      data: {
        email: 'karan.malhotra@fleetflow.in',
        name: 'Karan Malhotra',
        password: hashedPassword,
        role: 'Safety Officer',
      },
    }),
    prisma.user.create({
      data: {
        email: 'neha.gupta@fleetflow.in',
        name: 'Neha Gupta',
        password: hashedPassword,
        role: 'Financial Analyst',
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Seed Drivers
  const drivers = await Promise.all([
    prisma.driver.create({
      data: {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@fleetflow.in',
        phone: '+91-98765-43210',
        licenseNumber: 'DL-MH12345',
        licenseExpiry: new Date('2026-12-31'),
        experience: 8,
        status: 'Active',
        safetyScore: 95,
        completionRate: 98,
        totalTrips: 324,
        onTimeDelivery: 96,
        address: 'Mumbai, Maharashtra',
        dutyStatus: 'On Duty',
      },
    }),
    prisma.driver.create({
      data: {
        name: 'Priya Sharma',
        email: 'priya.sharma@fleetflow.in',
        phone: '+91-98765-43211',
        licenseNumber: 'DL-DL67890',
        licenseExpiry: new Date('2027-06-15'),
        experience: 5,
        status: 'Active',
        safetyScore: 92,
        completionRate: 95,
        totalTrips: 187,
        onTimeDelivery: 94,
        address: 'Delhi, NCR',
        dutyStatus: 'On Duty',
      },
    }),
    prisma.driver.create({
      data: {
        name: 'Amit Patel',
        email: 'amit.patel@fleetflow.in',
        phone: '+91-98765-43212',
        licenseNumber: 'DL-GJ11223',
        licenseExpiry: new Date('2025-03-20'),
        experience: 12,
        status: 'Active',
        safetyScore: 88,
        completionRate: 89,
        totalTrips: 512,
        onTimeDelivery: 87,
        address: 'Ahmedabad, Gujarat',
        dutyStatus: 'Off Duty',
      },
    }),
    prisma.driver.create({
      data: {
        name: 'Sunita Reddy',
        email: 'sunita.reddy@fleetflow.in',
        phone: '+91-98765-43213',
        licenseNumber: 'DL-TN44556',
        licenseExpiry: new Date('2026-09-10'),
        experience: 6,
        status: 'Active',
        safetyScore: 97,
        completionRate: 99,
        totalTrips: 245,
        onTimeDelivery: 98,
        address: 'Chennai, Tamil Nadu',
        dutyStatus: 'On Duty',
      },
    }),
    prisma.driver.create({
      data: {
        name: 'Vikram Singh',
        email: 'vikram.singh@fleetflow.in',
        phone: '+91-98765-43214',
        licenseNumber: 'DL-HR78901',
        licenseExpiry: new Date('2027-01-25'),
        experience: 10,
        status: 'On Leave',
        safetyScore: 90,
        completionRate: 91,
        totalTrips: 398,
        onTimeDelivery: 89,
        address: 'Gurgaon, Haryana',
        dutyStatus: 'Off Duty',
      },
    }),
  ]);

  console.log(`✅ Created ${drivers.length} drivers`);

  // Seed Vehicles
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        registration: 'MH-02-AB-1234',
        type: 'Truck',
        make: 'Tata',
        model: 'Prima 4940.S',
        year: 2022,
        status: 'On Trip',
        currentDriverId: drivers[0].id,
        mileage: 45000,
        lastService: new Date('2026-01-15'),
        nextService: new Date('2026-04-15'),
        purchasePrice: 4500000000, // 45 lakhs in paise
        currentValue: 4200000000,
        location: 'Mumbai, MH',
      },
    }),
    prisma.vehicle.create({
      data: {
        registration: 'DL-01-XY-5678',
        type: 'Truck',
        make: 'Ashok Leyland',
        model: '4825 Tipper',
        year: 2021,
        status: 'Available',
        mileage: 62000,
        lastService: new Date('2026-02-01'),
        nextService: new Date('2026-05-01'),
        purchasePrice: 4200000000,
        currentValue: 3800000000,
        location: 'Delhi, DL',
      },
    }),
    prisma.vehicle.create({
      data: {
        registration: 'KA-03-DE-9012',
        type: 'Van',
        make: 'Mahindra',
        model: 'Supro Cargo',
        year: 2023,
        status: 'Maintenance',
        mileage: 28000,
        lastService: new Date('2026-02-10'),
        nextService: new Date('2026-05-10'),
        purchasePrice: 1500000000,
        currentValue: 1400000000,
        location: 'Bangalore, KA',
      },
    }),
    prisma.vehicle.create({
      data: {
        registration: 'GJ-01-GH-3456',
        type: 'Truck',
        make: 'BharatBenz',
        model: '4928 TT',
        year: 2020,
        status: 'On Trip',
        currentDriverId: drivers[1].id,
        mileage: 98000,
        lastService: new Date('2026-01-20'),
        nextService: new Date('2026-04-20'),
        purchasePrice: 5000000000,
        currentValue: 4200000000,
        location: 'Ahmedabad, GJ',
      },
    }),
    prisma.vehicle.create({
      data: {
        registration: 'TN-07-JK-7890',
        type: 'Van',
        make: 'Tata',
        model: 'Ace Mega XL',
        year: 2023,
        status: 'Available',
        mileage: 15000,
        lastService: new Date('2026-02-05'),
        nextService: new Date('2026-05-05'),
        purchasePrice: 1200000000,
        currentValue: 1150000000,
        location: 'Chennai, TN',
      },
    }),
  ]);

  console.log(`✅ Created ${vehicles.length} vehicles`);

  // Seed Trips
  const trips = await Promise.all([
    prisma.trip.create({
      data: {
        vehicleId: vehicles[0].id,
        driverId: drivers[0].id,
        origin: 'Mumbai, MH',
        destination: 'Pune, MH',
        distance: 148,
        startTime: new Date('2026-02-21T08:00:00'),
        status: 'In Progress',
        revenue: 4500000, // 45,000 INR
        fuelCost: 1200000,
        cargo: 'Electronics',
      },
    }),
    prisma.trip.create({
      data: {
        vehicleId: vehicles[3].id,
        driverId: drivers[1].id,
        origin: 'Delhi NCR, DL',
        destination: 'Jaipur, RJ',
        distance: 280,
        startTime: new Date('2026-02-20T06:00:00'),
        endTime: new Date('2026-02-20T14:30:00'),
        status: 'Completed',
        revenue: 6500000, // 65,000 INR
        fuelCost: 2100000,
        cargo: 'Textiles',
      },
    }),
    prisma.trip.create({
      data: {
        vehicleId: vehicles[1].id,
        driverId: drivers[3].id,
        origin: 'Bangalore, KA',
        destination: 'Chennai, TN',
        distance: 345,
        startTime: new Date('2026-02-22T09:00:00'),
        status: 'Scheduled',
        revenue: 8500000, // 85,000 INR
        fuelCost: 2800000,
        cargo: 'Automobile Parts',
      },
    }),
  ]);

  console.log(`✅ Created ${trips.length} trips`);

  // Seed Fuel Records
  const fuelRecords = await Promise.all([
    prisma.fuelRecord.create({
      data: {
        vehicleId: vehicles[0].id,
        date: new Date('2026-02-18'),
        fuelType: 'Diesel',
        quantity: 80,
        pricePerUnit: 95.5,
        totalCost: 764000, // 7,640 INR
        location: 'Mumbai Fuel Station',
        odometer: 44500,
        efficiency: 5.2,
      },
    }),
    prisma.fuelRecord.create({
      data: {
        vehicleId: vehicles[1].id,
        date: new Date('2026-02-19'),
        fuelType: 'Diesel',
        quantity: 100,
        pricePerUnit: 94.8,
        totalCost: 948000, // 9,480 INR
        location: 'Delhi Fuel Depot',
        odometer: 61800,
        efficiency: 4.8,
      },
    }),
    prisma.fuelRecord.create({
      data: {
        vehicleId: vehicles[3].id,
        date: new Date('2026-02-20'),
        fuelType: 'Diesel',
        quantity: 120,
        pricePerUnit: 96.2,
        totalCost: 1154400, // 11,544 INR
        location: 'Ahmedabad Petrol Pump',
        odometer: 97500,
        efficiency: 4.5,
      },
    }),
  ]);

  console.log(`✅ Created ${fuelRecords.length} fuel records`);

  // Seed Maintenance Records
  const maintenance = await Promise.all([
    prisma.maintenance.create({
      data: {
        vehicleId: vehicles[2].id,
        type: 'Routine',
        description: 'Oil change and brake inspection',
        cost: 850000, // 8,500 INR
        scheduledDate: new Date('2026-02-21'),
        completedDate: new Date('2026-02-21'),
        status: 'Completed',
        serviceProvider: 'Mahindra Service Center',
        parts: 'Engine Oil, Oil Filter, Brake Pads',
      },
    }),
    prisma.maintenance.create({
      data: {
        vehicleId: vehicles[0].id,
        type: 'Inspection',
        description: 'Pre-trip safety inspection',
        cost: 250000, // 2,500 INR
        scheduledDate: new Date('2026-02-20'),
        completedDate: new Date('2026-02-20'),
        status: 'Completed',
        serviceProvider: 'Tata Motors Workshop',
      },
    }),
    prisma.maintenance.create({
      data: {
        vehicleId: vehicles[1].id,
        type: 'Routine',
        description: 'Tire replacement and alignment',
        cost: 3200000, // 32,000 INR
        scheduledDate: new Date('2026-02-25'),
        status: 'Scheduled',
        serviceProvider: 'Ashok Leyland Service',
        parts: 'Rear Tires (4x)',
      },
    }),
  ]);

  console.log(`✅ Created ${maintenance.length} maintenance records`);

  console.log('✨ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
