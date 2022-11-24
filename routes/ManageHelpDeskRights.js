const router = require('express').Router()
const RightsModel = require('../models/ManageHelpDeskRights')

router.post('/create', async (request, response) => {

    try {

        const body = request.body

        const total = await RightsModel.find()



        total.length == 1 && response.status(500).send({
            status: false,
            message: 'Can not add more than 1 document',
        })

        const rights = await RightsModel.create(body)

        response.status(201).send({
            status: true,
            message: 'Rights added',
            data: rights
        })

    } catch (error) {
        response.status(500).send({
            status: false,
            message: 'Error Found',
            error: error
        })
    }

})

router.post('/read', async (request, response) => {

    try {

        const rights = await RightsModel.find()

        response.status(200).send({
            status: true,
            message: 'Rights',
            data: rights[0]
        })

    } catch (error) {
        response.status(500).send({
            status: false,
            message: 'Error Found',
            error: error
        })
    }

})

router.post('/update', async (request, response) => {

    try {

        const body = request.body

        const rights = await RightsModel.findByIdAndUpdate(body._id, {
            $set: request.body
        }, { new: true })

        response.status(200).send({
            status: true,
            message: 'Rights updated',
            data: rights,
        })

    } catch (error) {
        response.status(500).send({
            status: false,
            message: 'Error Found',
            error: error
        })
    }

})

router.post('/delete', async (request, response) => {

    try {

        const body = request.body

        const rights = await RightsModel.findByIdAndDelete(body.id)

        response.status(200).send({
            status: true,
            message: 'Rights deleted',
            data: rights,
        })

    } catch (error) {
        response.status(500).send({
            status: false,
            message: 'Error Found',
            error: error
        })
    }

})

module.exports = router