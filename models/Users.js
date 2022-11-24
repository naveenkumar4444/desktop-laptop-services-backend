const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true },
    image: { type: String, trim: true, required: false, default: "" },
    role: { type: String, trim: true, required: true },
    mobile: { type: String, trim: true, required: true, unique: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, trim: true, required: true },
    deactivated: { type: Boolean, trim: true, required: false, default: false },
}, { timestamps: true })

module.exports = mongoose.model("Users", UserSchema)