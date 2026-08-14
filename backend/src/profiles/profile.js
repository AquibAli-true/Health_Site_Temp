const express = require('express')
const router = require("express").Router();
const userModel = require("../models/userModel.js");

router.get('/user-data', async (req, res) => {
    try{
        const token = req.cookies.user_session; 
        if (!token) {
            return res.status(401).json({ authenticated: false });
        }
        const user = await userModel.findOne({ token:token });
        if (!user) {
            return res.status(401).json({ authenticated: false });
        }
        res.status(200).json({user: {name: user.name, email: user.email, age: user.age, sex: user.sex, weight: user.weight, height: user.height } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}).patch('/update-profile', async (req, res) => {
    try {
        const token = req.cookies.user_session;
        if (!token) {
            return res.status(401).json({ authenticated: false });
        }

        const { name, age, sex, weight, height } = req.body;

        const updatedUser = await userModel.findOneAndUpdate(
            { token: token },
            { $set: { name, age, sex, weight, height } },
            { new: true, runValidators: true }
        ).select('-password -token');

        if (!updatedUser) {
            return res.status(404).json({ error: 'user not found' });
        }

        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
module.exports = router;