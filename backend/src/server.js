require('dotenv').config();

const app = require('./App')
const connectDB = require('./data_base/dbSetup.js')
connectDB()

app.listen(process.env.PORT,()=>{
    console.log('Server is running')
})