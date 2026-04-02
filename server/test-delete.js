const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' }); // Server's .env is at ../.env relative to server.js? Let's check server.js where .env is loaded.

async function testDelete() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('connected to db');
        
        const User = require('./models/User');
        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) { console.log('No admin found'); return; }
        
        const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        console.log('token:', token);
        
        const Workshop = require('./models/Workshop');
        const ws = await Workshop.findOne();
        if (!ws) { console.log('No workshop found'); return; }
        console.log('workshop id:', ws._id.toString());
        
        // Let's call the delete API
        const axios = require('axios');
        try {
            const res = await axios.delete(`http://localhost:5001/api/workshops/${ws._id.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Delete Response:', res.data);
        } catch (err) {
            console.log('Delete Error:', err.response?.data || err.message);
        }
        
    } catch (e) {
        console.error('script error', e);
    } finally {
        process.exit();
    }
}
testDelete();
