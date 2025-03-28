const Job = require("../models/jobModel");

// ✅ Get all jobs (Public)
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get a single job by ID (Public)
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Add a new job (Admin Only)
const addJob = async (req, res) => {
  const { title, company, location, description } = req.body;

  if (!title || !company || !location || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const job = await Job.create({ title, company, location, description });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Update job (Admin Only)
const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Delete job (Admin Only)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.deleteOne();
    res.json({ message: "Job removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getJobs, getJobById, addJob, updateJob, deleteJob };
