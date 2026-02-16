import express from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../db/connection.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const users = await db.collection('users').find({}).toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      skills: req.body.skills || [],
      github_url: req.body.github_url || '',
      work_style: req.body.work_style || {},
      created_at: new Date(),
    };
    const result = await db.collection('users').insertOne(newUser);
    res.status(201).json({ _id: result.insertedId, ...newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const updates = {
      name: req.body.name,
      email: req.body.email,
      skills: req.body.skills,
      github_url: req.body.github_url,
      work_style: req.body.work_style,
    };
    const result = await db
      .collection('users')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates });
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db
      .collection('users')
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
