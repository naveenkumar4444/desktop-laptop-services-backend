const router = require('express').Router()
const UserModel = require('../models/Users')
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const config = require('../config')

const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../auth/verifyToken");
const { sendMail } = require('../sendMail');

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
        !user && response.status(401).json({
            status: false,
            message: "Wrong Credentials",
        });

        const hashedPassword = CryptoJS.AES.decrypt(user.password, config.SEC_KEY).toString(CryptoJS.enc.Utf8);

        body.password !== hashedPassword && response.status(401).json({
            status: false,
            message: "Wrong Credentials",
        });

        const { password, ...newUser } = user["_doc"];

        const authToken = jwt.sign({
            id: newUser._id,
            role: newUser.role,
        },
            config.JWT_SEC_KEY,
            {
                expiresIn: '24h',
            });

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

router.post('/resetLink', async (request, response) => {
    try {
        const body = request.body

        const user = await UserModel.findOne({ email: body.email })

        !user && response.status(404).send({
            status: false,
            message: 'User not found'
        })

        const token = jwt.sign({
            email: body.email,
        },
            config.JWT_SEC_KEY,
            {
                expiresIn: 120,
            });

        const link = `https://desktop-laptop-services-frontend.vercel.app/resetPassword/${token}/${user._id}`
        // const link = `http://localhost:3000/resetPassword/${token}/${user._id}`

        sendMail(user.email, link)

        response.status(200).send({
            status: true,
            message: 'Password reset link has sent'
        })

    } catch (error) {
        response.status(500).send({
            status: false,
            message: error
        })
    }
})

router.post('/resetPassword', async (request, response) => {
    try {
        const body = request.body

        // jwt.verify(body.token, config.JWT_SEC_KEY, (error) => {
        //     if (error) {
        //         return response.status(403).json({
        //             status: false,
        //             message: "Token expired"
        //         });
        //     }

        //     const newpassword = CryptoJS.AES.encrypt(body.password, config.SEC_KEY).toString()

        //     UserModel.findByIdAndUpdate(body.id, {
        //         password: newpassword
        //     }, { new: true }).then((err) => {
        //         if (err) {
        //             console.log("err");
        //             return response.status(403).json({
        //                 status: false,
        //                 message: "Token expired"
        //             });
        //         }
        //     })

        await jwt.verify(body.token, config.JWT_SEC_KEY)

        const newpassword = CryptoJS.AES.encrypt(body.password, config.SEC_KEY).toString()

        await UserModel.findByIdAndUpdate(body.id, {
            password: newpassword
        }, { new: true })

        response.status(200).send({
            status: true,
            message: 'Password reset link has sent'
        })

    } catch (error) {
        response.status(500).send({
            status: false,
            message: 'Token expired'
        })
    }
})

router.post('/verify', (request, response) => {
    const authToken = request.headers.token;
    if (authToken) {
        jwt.verify(authToken, config.JWT_SEC_KEY, (error) => {
            if (error) {
                return response.status(403).json({
                    status: false,
                    message: "You are not authenticated."
                });
            }

            return response.status(200).json({
                status: true,
                message: "User verified."
            });

        });
    } else {
        return response.status(401).json({
            status: false,
            message: "You are not authenticated."
        });
    }
})

module.exports = router