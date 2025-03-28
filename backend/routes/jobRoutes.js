import express from 'express';
import Job from '../models/Job.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new job
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, company, location, description, salary } = req.body;

    if (!title || !company || !location || !description || !salary) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const newJob = new Job({ title, company, location, description, salary });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// GET all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// GET a single job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.finById(req.params.id); 
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Filter Jobs by company or location
router.get('/filter', async (req, res) => {
  try {
    const { company, location } = req.query;
    const filter = {};

    if (company) filter.company = company;
    if (location) filter.location = location;

    const jobs = await Job.find(filter);
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;
