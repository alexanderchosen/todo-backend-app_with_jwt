const mongoose = require('mongoose')
const CONFIG = require('../config/config')

function ConnectToDb(){
// create a mongoose connection
mongoose.connect(CONFIG.MONGODB_URI)

mongoose.connection.on("connected", ()=>{
    console.log("Connected to MongoDB successfully")
})

mongoose.connection.on("error", (err)=>{
    console.log("An error occured")
    console.error(err)
})
}

module.exports = ConnectToDb
