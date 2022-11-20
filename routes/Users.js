const router = require('express').Router()
const UserModel = require('../models/Users')
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const config = require('../config')

const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../auth/verifyToken");

router.post('/register', async (request, response) => {

    try {

        const body = request.body

        body.password = CryptoJS.AES.encrypt(body.password, config.SEC_KEY)

        const user = await UserModel.create(body)

        const { password, ...newUser } = user["_doc"];

        response.status(201).send({
            status: true,
            message: 'Registration success',
            data: newUser
        })

    } catch (error) {
        response.status(500).send({
            status: false,
            message: 'Error Found',
            error: error
        })
    }

})

router.post('/login', async (request, response) => {

    try {

        const body = request.body

        const user = await UserModel.findOne({ email: body.email });
        !user && response.status(401).json("Wrong Credentials");

        const hashedPassword = CryptoJS.AES.decrypt(user.password, config.SEC_KEY).toString(CryptoJS.enc.Utf8);

        body.password !== hashedPassword && response.status(401).json("Wrong Credentials");

        const { password, ...newUser } = user["_doc"];

        const authToken = jwt.sign({
            id: newUser._id,
            role: newUser.role,
        }, config.JWT_SEC_KEY);

        response.status(200).send({
            status: true,
            message: 'Login success',
            data: { ...newUser, token: authToken },
        })

    } catch (error) {
        response.status(500).send({
            status: false,
            message: 'Error Found',
            error: error
        })
    }

})

router.post('/getallusers', verifyTokenAndAdmin, async (request, response) => {
    try {

        const condition = {}

        if (request.body.role && request.body.role.length) {
            condition.role = request.body.role
        }

        const user = await UserModel.find(condition)

        // user.password = CryptoJS.AES.decrypt(user.password, config.SEC_KEY).toString(CryptoJS.enc.Utf8)

        response.status(200).send({
            status: true,
            message: 'Success',
            data: user
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

// router.post('/:id', verifyToken, async (request, response) => {
//     try {

//         const data = await UserModel.findById(request.params.id)
//         const { password, ...newData } = data["_doc"];
//         response.status(200).send({
//             status: true,
//             message: 'Success',
//             data: newData
//         })

//     } catch (error) {
//         response.status(500).send({
//             status: false,
//             message: 'Error Found',
//             error: error
//         })
//     }
// })

router.post('/update', verifyToken, async (request, response) => {
    try {

        const user = await UserModel.findByIdAndUpdate(request.body.id, {
            $set: request.body
        }, { new: true })
        // const { password, ...newData } = data["_doc"];
        response.status(200).send({
            status: true,
            message: 'User has been updated',
            data: user
        })

    } catch (error) {
        response.status(500).send({
            status: false,
            message: 'Error Found',
            error: error
        })
    }
})

router.post("/delete", verifyTokenAndAdmin, async (request, response) => {

    try {
        await UserModel.findByIdAndDelete(request.body.id);
        response.status(200).json({
            status: true,
            message: "User has been deleted"
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