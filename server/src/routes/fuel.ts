import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { convertBigInt } from '../utils/bigint.js';

const router = Router();
const prisma = new PrismaClient();

// Get all fuel records
router.get('/', async (req, res) => {
  try {
    const { vehicleId } = req.query;
    const fuelRecords = await prisma.fuelRecord.findMany({
      where: vehicleId ? { vehicleId: vehicleId as string } : undefined,
      include: {
        vehicle: true,
      },
      orderBy: { date: 'desc' },
    });
    res.json(convertBigInt(fuelRecords));
  } catch (error) {
    console.error('Error fetching fuel records:', error);
    res.status(500).json({ error: 'Failed to fetch fuel records' });
  }
});

// Get single fuel record
router.get('/:id', async (req, res) => {
  try {
    const fuelRecord = await prisma.fuelRecord.findUnique({
      where: { id: req.params.id },
      include: {
        vehicle: true,
      },
    });
    
    if (!fuelRecord) {
      return res.status(404).json({ error: 'Fuel record not found' });
    }
    
    return res.json(fuelRecord);
  } catch (error) {
    console.error('Error fetching fuel record:', error);
    return res.status(500).json({ error: 'Failed to fetch fuel record' });
  }
});

// Create fuel record
router.post('/', async (req, res) => {
  try {
    const fuelRecord = await prisma.fuelRecord.create({
      data: req.body,
      include: {
        vehicle: true,
      },
    });
    res.status(201).json(fuelRecord);
  } catch (error) {
    console.error('Error creating fuel record:', error);
    res.status(500).json({ error: 'Failed to create fuel record' });
  }
});

// Update fuel record
router.put('/:id', async (req, res) => {
  try {
    const fuelRecord = await prisma.fuelRecord.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        vehicle: true,
      },
    });
    res.json(fuelRecord);
  } catch (error) {
    console.error('Error updating fuel record:', error);
    res.status(500).json({ error: 'Failed to update fuel record' });
  }
});

// Delete fuel record
router.delete('/:id', async (req, res) => {
  try {
    await prisma.fuelRecord.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting fuel record:', error);
    res.status(500).json({ error: 'Failed to delete fuel record' });
  }
});

export { router as fuelRouter };
