const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

async function getAdminToken() {
    await mongoose.connect(process.env.MONGO_URI);
    const User = require('./models/User');
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) { console.log('No admin found'); return; }
    
    const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    console.log(token);
    
    const Workshop = require('./models/Workshop');
    const ws = await Workshop.findOne();
    if (!ws) { console.log('No workshop found'); return; }
    console.log(ws._id.toString());
    process.exit(0);
}
getAdminToken();
