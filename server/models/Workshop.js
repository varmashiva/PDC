const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    featuredDescription: { type: String, default: 'AN EXCLUSIVE SESSION LED BY INDUSTRY LEADERS. SECURE YOUR SPOT TO MASTER THE ART OF MOTION.' },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    seats: { type: Number, required: true },
    status: { type: String, default: 'active', enum: ['active', 'completed'] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Workshop', workshopSchema);
