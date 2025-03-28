import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  console.log('Received request body:', req.body);
  try {
    let { name, email, password } = req.body;

    // Trim input values
    name = name?.trim();
    email = email?.trim();
    password = password?.trim();

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // ✅ Remove manual hashing — Just pass raw password
    const newUser = new User({ name, email, password }); 

    await newUser.save(); // The password will be hashed automatically

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    // Trim input values
    email = email?.trim();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials - User not found' });
    }

    console.log("Entered Password:", password); // Debugging
    console.log("Stored Hashed Password:", user.password); // Debugging

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch); // Debugging

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials - Password mismatch' });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1hr',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;
