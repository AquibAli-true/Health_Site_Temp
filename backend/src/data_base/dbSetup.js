const mongoose = require('mongoose')
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function connectDB(){
    try{
    await mongoose.connect(process.env.MONGODB_SRV)
    console.log('Connected to Database')
    }
    catch(e){
        console.log('Error connecting to Database:', e.message)
    }
}

module.exports = connectDB