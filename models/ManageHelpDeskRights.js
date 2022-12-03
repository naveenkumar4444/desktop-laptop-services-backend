const mongoose = require('mongoose')

const ManageHelpDeskRightsSchema = new mongoose.Schema({
    create: { type: Boolean, trim: true, required: false, default: false },
    read: { type: Boolean, trim: true, required: false, default: false },
    update: { type: Boolean, trim: true, required: false, default: false },
    delete: { type: Boolean, trim: true, required: false, default: false },
    reopen: { type: Boolean, trim: true, required: false, default: false },
    assign: { type: Boolean, trim: true, required: false, default: false },
}, { timestamps: true })

module.exports = mongoose.model("ManageHelpDeskRight", ManageHelpDeskRightsSchema)