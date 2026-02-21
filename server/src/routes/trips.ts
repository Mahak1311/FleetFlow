import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { convertBigInt } from '../utils/bigint.js';

const router = Router();
const prisma = new PrismaClient();

// Get all trips
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const trips = await prisma.trip.findMany({
      where: status ? { status: status as string } : undefined,
      include: {
        vehicle: true,
        driver: true,
      },
      orderBy: { startTime: 'desc' },
    });
    res.json(convertBigInt(trips));
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// Get single trip
router.get('/:id', async (req, res) => {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: req.params.id },
      include: {
        vehicle: true,
        driver: true,
      },
    });
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    return res.json(trip);
  } catch (error) {
    console.error('Error fetching trip:', error);
    return res.status(500).json({ error: 'Failed to fetch trip' });
  }
});

// Create trip
router.post('/', async (req, res) => {
  try {
    const trip = await prisma.trip.create({
      data: req.body,
      include: {
        vehicle: true,
        driver: true,
      },
    });
    res.status(201).json(trip);
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

// Update trip
router.put('/:id', async (req, res) => {
  try {
    const trip = await prisma.trip.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        vehicle: true,
        driver: true,
      },
    });
    res.json(trip);
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ error: 'Failed to update trip' });
  }
});

// Delete trip
router.delete('/:id', async (req, res) => {
  try {
    await prisma.trip.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

export { router as tripRouter };
