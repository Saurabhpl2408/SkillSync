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
    if (req.query.owner_id) {
      query.owner_id = new ObjectId(req.query.owner_id);
    }
    const projects = await db.collection('project_posts').find(query).toArray();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const project = await db.collection('project_posts').findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/user/:owner_id', async (req, res) => {
  try {
    const db = getDB();
    const projects = await db
      .collection('project_posts')
      .find({
        owner_id: new ObjectId(req.params.owner_id),
      })
      .toArray();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/skill/:skill', async (req, res) => {
  try {
    const db = getDB();
    const projects = await db
      .collection('project_posts')
      .find({
        skills_need: { $in: [req.params.skill] },
        status: 'open',
      })
      .toArray();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const newProject = {
      owner_id: new ObjectId(req.body.owner_id),
      title: req.body.title,
      description: req.body.description || '',
      skills_have: req.body.skills_have || [],
      skills_need: req.body.skills_need || [],
      status: 'open',
      created_at: new Date(),
    };
    const result = await db.collection('project_posts').insertOne(newProject);
    res.status(201).json({ _id: result.insertedId, ...newProject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const updates = {
      title: req.body.title,
      description: req.body.description,
      skills_have: req.body.skills_have,
      skills_need: req.body.skills_need,
      status: req.body.status,
    };
    const result = await db
      .collection('project_posts')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates });
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('project_posts').deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
