const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'shivavarma336@gmail.com';
        const user = await User.findOneAndUpdate(
            { email },
            { role: 'admin' },
            { new: true }
        );
        if (user) {
            console.log(`Successfully promoted ${email} to admin.`);
        } else {
            console.log(`User ${email} not found in database.`);
        }
    } catch (error) {
        console.error('Error promoting user:', error.message);
    } finally {
        mongoose.connection.close();
    }
};

makeAdmin();
