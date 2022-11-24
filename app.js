const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(express.json({ limit: "5mb" }))
app.use(cors())
app.use('/', express.static(__dirname + '/public'));
app.use('*', express.static(__dirname + '/public'));

const PORT = 8000;

const UsersRoutes = require('./routes/Users')
const ComplaintRoutes = require('./routes/Complaints')
const ManageHelpDeskRoutes = require('./routes/ManageHelpDeskRights')

mongoose.connect("mongodb+srv://ecom:ecom@cluster0.a4pfgbe.mongodb.net/helpdesk?retryWrites=true&w=majority").then(() => {
    console.log("Connected");
}).catch((error) => {
    console.log(error);
})

app.use('/user', UsersRoutes)
app.use('/complaint', ComplaintRoutes)
app.use('/rights', ManageHelpDeskRoutes)

// app.get("*", (req, res) => {
//     console.log("Hello World");
//     res.status(200).json({ message: "Hello World" })
// })

app.listen(process.env.PORT || PORT, () => {
    console.log("Running on port ", PORT);
})
