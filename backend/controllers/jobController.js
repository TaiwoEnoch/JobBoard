import Job from "../models/Job.js";

// ✅ Get all jobs (Public)
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    console.error("Get Jobs Error:", error); // Added logging
    res.status(500).json({ message: "Server Error", error: error.message });
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
    console.error("Get Job By ID Error:", error); // Added logging
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Add a new job (Admin Only)
const addJob = async (req, res) => {
  if (!req.user) { // Added user check
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { title, company, location, description, salary } = req.body;

  if (!title || !company || !location || !description || !salary) {
    return res.status(400).json({ message: "All fields are required" });
  }

  console.log("Add Job Request Body:", req.body); // Added logging

  try {
    const job = await Job.create({ title, company, location, description, salary });
    res.status(201).json(job);
  } catch (error) {
    console.error("Add Job Error:", error); // Added logging
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Update job (Admin Only)
const updateJob = async (req, res) => {
  if (!req.user) { // Added user check
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(job);
  } catch (error) {
    console.error("Update Job Error:", error); // Added logging
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Delete job (Admin Only)
const deleteJob = async (req, res) => {
  if (!req.user) { // Added user check
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.deleteOne();
    res.json({ message: "Job removed successfully" });
  } catch (error) {
    console.error("Delete Job Error:", error); // Added logging
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export { getJobs, getJobById, addJob, updateJob, deleteJob };
