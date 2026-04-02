const Workshop = require('../models/Workshop');

// @desc    Get all workshops
// @route   GET /api/workshops
const getWorkshops = async (req, res) => {
    try {
        let workshops = await Workshop.find({}).sort({ createdAt: -1 }).populate('createdBy', 'name');
        
        // Auto-update status based on date/time
        const now = new Date();
        let updated = false;
        
        for (let ws of workshops) {
            const wsDate = new Date(ws.date);
            // If the date is passed (simplistic check for end of day)
            wsDate.setHours(23, 59, 59, 999);
            
            if (ws.status !== 'completed' && wsDate < now) {
                ws.status = 'completed';
                await ws.save();
                updated = true;
            }
        }
        
        if (updated) {
            workshops = await Workshop.find({}).sort({ createdAt: -1 }).populate('createdBy', 'name');
        }

        res.json(workshops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get workshop by ID
// @route   GET /api/workshops/:id
const getWorkshopById = async (req, res) => {
    try {
        const workshop = await Workshop.findById(req.params.id).populate('createdBy', 'name');
        if (workshop) res.json(workshop);
        else res.status(404).json({ message: 'Workshop not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create workshop
// @route   POST /api/workshops
const createWorkshop = async (req, res) => {
    const { title, description, featuredDescription, date, time, price, image, seats } = req.body;
    try {
        const workshop = await Workshop.create({
            title, description, featuredDescription, date, time, price, image, seats,
            createdBy: req.user._id
        });
        req.app.get('io').emit('newWorkshop', workshop);
        res.status(201).json(workshop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update workshop
// @route   PUT /api/workshops/:id
const updateWorkshop = async (req, res) => {
    try {
        const workshop = await Workshop.findById(req.params.id);
        if (workshop) {
            workshop.title = req.body.title || workshop.title;
            workshop.description = req.body.description || workshop.description;
            workshop.featuredDescription = req.body.featuredDescription || workshop.featuredDescription;
            workshop.date = req.body.date || workshop.date;
            workshop.time = req.body.time || workshop.time;
            workshop.price = req.body.price || workshop.price;
            workshop.image = req.body.image || workshop.image;
            workshop.seats = req.body.seats || workshop.seats;
            workshop.status = req.body.status || workshop.status;
            const updatedWorkshop = await workshop.save();
            req.app.get('io').emit('workshopUpdated', updatedWorkshop);
            res.json(updatedWorkshop);
        } else {
            res.status(404).json({ message: 'Workshop not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete workshop
// @route   DELETE /api/workshops/:id
const deleteWorkshop = async (req, res) => {
    try {
        const workshop = await Workshop.findById(req.params.id);
        if (workshop) {
            await workshop.deleteOne();
            req.app.get('io').emit('workshopDeleted', req.params.id);
            res.json({ message: 'Workshop removed' });
        } else {
            res.status(404).json({ message: 'Workshop not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getWorkshops, getWorkshopById, createWorkshop, updateWorkshop, deleteWorkshop };
