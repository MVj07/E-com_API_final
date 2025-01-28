const express = require('express')
const {connect, connection} = require('mongoose')
const {json} = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()
const app=express()

// enable cors
app.use(cors());

// All Routes
// app.use("/staffs", staffRouter)
const Account = require('./routers/accountrouter')
const Admin = require('./routers/adminrouter')
const Product = require('./routers/productrouter')
const Staff = require('./routers/staffrouter')

// Middleware using
app.use(json())

// Connect to mongodb
connect(process.env.DB_CONNECT_URL)

const db = connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", function(){
    console.log("Connected to database")
})

app.use("/account", Account)
app.use("/admin", Admin)
app.use("/product", Product)
app.use("/staff", Staff)

// server listening
app.listen(5000,function(){
    console.log("server is running")
})
