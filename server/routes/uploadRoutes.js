const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { protect, admin } = require('../middleware/authMiddleware');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dummy',
    api_key: process.env.CLOUDINARY_API_KEY || 'dummy',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'dummy',
});
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const stream = cloudinary.uploader.upload_stream(
            { folder: 'dance_workshops' },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Stream Error:', error);
                    return res.status(500).json({ message: error.message });
                }
                res.json({ url: result.secure_url });
            }
        );

        stream.end(req.file.buffer);
    } catch (error) {
        console.error('Upload Process Error:', error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/avatar', protect, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const stream = cloudinary.uploader.upload_stream(
            { folder: 'dance_users' },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Stream Error:', error);
                    return res.status(500).json({ message: error.message });
                }
                res.json({ url: result.secure_url });
            }
        );

        stream.end(req.file.buffer);
    } catch (error) {
        console.error('Upload Process Error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
