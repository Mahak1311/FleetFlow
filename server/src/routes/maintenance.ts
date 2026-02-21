import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { convertBigInt } from '../utils/bigint.js';

const router = Router();
const prisma = new PrismaClient();

// Get all maintenance records
router.get('/', async (req, res) => {
  try {
    const { vehicleId, status } = req.query;
    const maintenance = await prisma.maintenance.findMany({
      where: {
        ...(vehicleId && { vehicleId: vehicleId as string }),
        ...(status && { status: status as string }),
      },
      include: {
        vehicle: true,
      },
      orderBy: { scheduledDate: 'desc' },
    });
    res.json(convertBigInt(maintenance));
  } catch (error) {
    console.error('Error fetching maintenance records:', error);
    res.status(500).json({ error: 'Failed to fetch maintenance records' });
  }
});

// Get single maintenance record
router.get('/:id', async (req, res) => {
  try {
    const maintenance = await prisma.maintenance.findUnique({
      where: { id: req.params.id },
      include: {
        vehicle: true,
      },
    });
    
    if (!maintenance) {
      return res.status(404).json({ error: 'Maintenance record not found' });
    }
    
    return res.json(maintenance);
  } catch (error) {
    console.error('Error fetching maintenance record:', error);
    return res.status(500).json({ error: 'Failed to fetch maintenance record' });
  }
});

// Create maintenance record
router.post('/', async (req, res) => {
  try {
    const maintenance = await prisma.maintenance.create({
      data: req.body,
      include: {
        vehicle: true,
      },
    });
    res.status(201).json(maintenance);
  } catch (error) {
    console.error('Error creating maintenance record:', error);
    res.status(500).json({ error: 'Failed to create maintenance record' });
  }
});

// Update maintenance record
router.put('/:id', async (req, res) => {
  try {
    const maintenance = await prisma.maintenance.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        vehicle: true,
      },
    });
    res.json(maintenance);
  } catch (error) {
    console.error('Error updating maintenance record:', error);
    res.status(500).json({ error: 'Failed to update maintenance record' });
  }
});

// Delete maintenance record
router.delete('/:id', async (req, res) => {
  try {
    await prisma.maintenance.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting maintenance record:', error);
    res.status(500).json({ error: 'Failed to delete maintenance record' });
  }
});

export { router as maintenanceRouter };
