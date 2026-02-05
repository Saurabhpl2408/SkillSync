import express from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../db/connection.js';

const router = express.Router();

// GET all availability slots (optionally filter by user_id)
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const query = req.query.user_id
      ? { user_id: new ObjectId(req.query.user_id) }
      : {};
    const slots = await db
      .collection('availability_slots')
      .find(query)
      .toArray();
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET slots for a specific user
router.get('/user/:user_id', async (req, res) => {
  try {
    const db = getDB();
    const slots = await db
      .collection('availability_slots')
      .find({
        user_id: new ObjectId(req.params.user_id),
      })
      .toArray();
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single slot by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const slot = await db.collection('availability_slots').findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    res.json(slot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new availability slot
router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const newSlot = {
      user_id: new ObjectId(req.body.user_id),
      day: req.body.day,
      start_hour: req.body.start_hour,
      end_hour: req.body.end_hour,
      created_at: new Date(),
    };
    const result = await db.collection('availability_slots').insertOne(newSlot);
    res.status(201).json({ _id: result.insertedId, ...newSlot });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE multiple slots at once (bulk insert)
router.post('/bulk', async (req, res) => {
  try {
    const db = getDB();
    const slots = req.body.slots.map((slot) => ({
      user_id: new ObjectId(slot.user_id),
      day: slot.day,
      start_hour: slot.start_hour,
      end_hour: slot.end_hour,
      created_at: new Date(),
    }));
    const result = await db.collection('availability_slots').insertMany(slots);
    res.status(201).json({ insertedCount: result.insertedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE slot
router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const updates = {
      day: req.body.day,
      start_hour: req.body.start_hour,
      end_hour: req.body.end_hour,
    };
    const result = await db
      .collection('availability_slots')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates });
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    res.json({ message: 'Slot updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE slot
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('availability_slots').deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    res.json({ message: 'Slot deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE all slots for a user
router.delete('/user/:user_id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('availability_slots').deleteMany({
      user_id: new ObjectId(req.params.user_id),
    });
    res.json({ deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
