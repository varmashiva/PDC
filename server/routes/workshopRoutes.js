const express = require('express');
const router = express.Router();
const { getWorkshops, getWorkshopById, createWorkshop, updateWorkshop, deleteWorkshop } = require('../controllers/workshopController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getWorkshops)
    .post(protect, admin, createWorkshop);

router.route('/:id')
    .get(getWorkshopById)
    .put(protect, admin, updateWorkshop)
    .delete(protect, admin, deleteWorkshop);

module.exports = router;
