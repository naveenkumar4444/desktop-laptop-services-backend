const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

app.use(express.json({ limit: "5mb" }))
app.use(cors())

const PORT = 8000;

const UsersRoutes = require('./routes/Users')
const ComplaintRoutes = require('./routes/Complaints')

mongoose.connect("mongodb+srv://ecom:ecom@cluster0.a4pfgbe.mongodb.net/helpdesk?retryWrites=true&w=majority").then(() => {
    console.log("Connected");
}).catch((error) => {
    console.log(error);
})

app.get('/', (req, res) => {
    res.send({ message: "Hello World1" })
})

app.use('/user', UsersRoutes)
app.use('/complaint', ComplaintRoutes)

app.use('*', () => {
    console.log("Route not available");
})

app.listen(process.env.PORT || PORT, () => {
    console.log("Running on port ", PORT);
})
