const mongoose = require('mongoose')

const ComplaintSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true },
    price: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    model_number: { type: String, trim: true, required: true },
    serial_number: { type: String, trim: true, required: false, default: "" },
    images: [],
    history: [],
    payments: [],
    mobile: { type: String, trim: true, required: true },
    address: { type: String, trim: true, required: true },
    status: { type: String, trim: true, required: false, default: "pending" },
    engineer: [],
    remarks: [],
    deleted: { type: Boolean, trim: true, required: false, default: false },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: "Users",
    },
    engineerId: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: false,
        ref: "Users",
        default: null,
    },
}, { timestamps: true })

module.exports = mongoose.model("Complaints", ComplaintSchema)