const mongoose = require('mongoose')

function connectToDb(){
    mongoose.connect(process.env.MONGO_URL).then(()=>{console.log("Database connected successfully")}).catch(()=>{console.log("error")})
}

module.exports = connectToDb 