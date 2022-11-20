const mongoose = require('mongoose')

const ComplaintSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    model_number: { type: String, trim: true, required: true },
    serial_number: { type: String, trim: true, required: false, default: "" },
    images: [],
    history:[],
    address: { type: String, trim: true, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Users",
    },
}, { timestamps: true })

module.exports = mongoose.model("Complaints", ComplaintSchema)