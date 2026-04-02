const Razorpay = require('razorpay');
const crypto = require('crypto');

// @desc    Create Razorpay order
// @route   POST /api/payments/order
const createOrder = async (req, res) => {
    const { amount } = req.body;
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'dummy',
            key_secret: process.env.RAZORPAY_SECRET || 'dummy',
        });

        const options = {
            amount: amount * 100, // amount in smallest currency unit
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await instance.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify payment
// @route   POST /api/payments/verify
const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    try {
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET || 'dummy')
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            res.json({ message: "Payment verified successfully" });
        } else {
            res.status(400).json({ message: "Invalid signature" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, verifyPayment };
