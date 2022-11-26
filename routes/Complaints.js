const router = require('express').Router()
const ComplaintModel = require('../models/Complaints')

const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../auth/verifyToken");

router.post('/add', verifyToken, async (request, response) => {

    try {

        const body = request.body

        const complaint = await ComplaintModel.create(body)

        response.status(200).send({
            status: true,
            message: 'Complaint added',
            data: complaint
        })

    } catch (error) {
        response.status(500).send({
            status: false,
            message: 'Error Found',
            error: error
        })
    }

})

router.post('/getallcomplaints', verifyToken, async (request, response) => {
    try {

        const condition = {}

        if (request.body.id && request.body.id.length) {
            condition._id = request.body.id
        }
        if (request.body.userId && request.body.userId.length) {
            condition.userId = request.body.userId
        }
        if (request.body.status && request.body.status.length) {
            condition.status = request.body.status
        }

        const complaint = await ComplaintModel.find(condition)

        response.status(200).send({
            status: true,
            message: 'Success',
            data: complaint
        })

    } catch (error) {
        response.status(500).send({
            status: false,
            message: 'Error Found',
            error: error
        })
    }
})

router.post('/update', verifyToken, async (request, response) => {
    try {

        const complaint = await ComplaintModel.findByIdAndUpdate(request.body.id, {
            $set: request.body
        }, { new: true })
        response.status(200).send({
            status: true,
            message: 'Complaint has been updated',
            data: complaint
        })

    } catch (error) {
        console.log(error);
        response.status(500).send({
            status: false,
            message: 'Error Found',
            error: error
        })
    }
})

router.post("/delete", verifyToken, async (request, response) => {

    try {
        await ComplaintModel.findByIdAndDelete(request.body.id);
        response.status(200).json({
            status: true,
            message: "Complaint has been deleted"
        })
    } catch (error) {
        response.status(500).send({
            status: false,
            message: 'Error Found',
            error: error
        })
    }

});

module.exports = router