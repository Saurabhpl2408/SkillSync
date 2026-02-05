import express from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../db/connection.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    const requests = await db
      .collection('partner_requests')
      .find(query)
      .toArray();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const request = await db.collection('partner_requests').findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/sent/:user_id', async (req, res) => {
  try {
    const db = getDB();
    const requests = await db
      .collection('partner_requests')
      .find({
        from_user_id: new ObjectId(req.params.user_id),
      })
      .toArray();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/received/:user_id', async (req, res) => {
  try {
    const db = getDB();
    const requests = await db
      .collection('partner_requests')
      .find({
        to_user_id: new ObjectId(req.params.user_id),
      })
      .toArray();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/project/:project_id', async (req, res) => {
  try {
    const db = getDB();
    const requests = await db
      .collection('partner_requests')
      .find({
        project_id: new ObjectId(req.params.project_id),
      })
      .toArray();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const existingRequest = await db.collection('partner_requests').findOne({
      project_id: new ObjectId(req.body.project_id),
      from_user_id: new ObjectId(req.body.from_user_id),
      to_user_id: new ObjectId(req.body.to_user_id),
    });
    if (existingRequest) {
      return res.status(400).json({ error: 'Request already exists' });
    }
    const newRequest = {
      project_id: new ObjectId(req.body.project_id),
      from_user_id: new ObjectId(req.body.from_user_id),
      to_user_id: new ObjectId(req.body.to_user_id),
      message: req.body.message || '',
      status: 'pending',
      created_at: new Date(),
    };
    const result = await db
      .collection('partner_requests')
      .insertOne(newRequest);
    res.status(201).json({ _id: result.insertedId, ...newRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const db = getDB();
    const validStatuses = ['pending', 'accepted', 'declined'];
    if (!validStatuses.includes(req.body.status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const result = await db
      .collection('partner_requests')
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { status: req.body.status } }
      );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json({ message: 'Request status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const updates = {
      message: req.body.message,
      status: req.body.status,
    };
    const result = await db
      .collection('partner_requests')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates });
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json({ message: 'Request updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('partner_requests').deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json({ message: 'Request deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
