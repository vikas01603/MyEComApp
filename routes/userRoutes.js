const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Simple test route
router.get('/test', (req, res) => {
    res.send("API is working!");
});

// Create user via GET (for browser testing)
router.get('/createUser', async (req, res) => {
    const { name, email, password } = req.query;
    if(!name || !email || !password) return res.send("Provide name, email, password");

    const existingUser = await User.findOne({ email });
    if(existingUser) return res.send("User already exists");

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.send(`User ${name} saved!`);
});

// Login via GET (for browser testing)
router.get('/login', async (req, res) => {
    const { email, password } = req.query;
    if(!email || !password) return res.send("Provide email and password");

    const user = await User.findOne({ email });
    if(!user) return res.send("User not found");
    if(user.password !== password) return res.send("Wrong password");

    res.send(`Login successful for ${email}`);
});

// View all users (optional, for browser)
router.get('/allUsers', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

module.exports = router;
