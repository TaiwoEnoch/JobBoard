import express from 'express';
import { getJobs, getJobById, addJob, updateJob, deleteJob } from '../controllers/jobController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import Job from '../models/Job.js';
const router = express.Router();

router.post('/', authMiddleware, addJob);
router.get('/', getJobs);
router.get('/:id', getJobById);
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

router.put('/:id', authMiddleware, updateJob);
router.delete('/:id', authMiddleware, deleteJob);

export default router;
