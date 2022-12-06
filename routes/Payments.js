const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

router.post("/orders", async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.KEY_ID || "rzp_test_HtVe35bnD87Ad6",
            key_secret: process.env.KEY_SECRET || "TkGRkCqHAuG2Lk2kg7DPtbDb",
        });

        const options = {
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };

        instance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ status: false, message: "Something Went Wrong!" });
            }
            res.status(200).json({ status: true, data: order });
        });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error!" });
        console.log(error);
    }
});

router.post("/verify", async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            return res.status(200).json({ status: true, message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ status: false, message: "Invalid signature sent!" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
});

module.exports = router;
