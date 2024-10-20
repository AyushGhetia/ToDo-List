const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', async(req,res) => {
    const {username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ error: 'User Already Exists' });

        const user = new User({ username, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h'});
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error in Server'});
    }
});

router.post('/login', async(req,res) => {
    const {username, password } = req.body;
    try{
        const user = await User.findOne({ username });
        if(!user) return res.status(400).json({ error: 'Invalid Credentials '});

        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.status(400).json({ error: 'Invalid Credentials'});
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error in Server'});
    }
});

module.exports = router;