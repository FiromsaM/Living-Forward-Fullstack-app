// bring mongoose
const mongoose = require('mongoose')

// have a function and connect with to DB, it returns promise so use async/await
const connectDB =  async () => {
    try {
        // create a connection variable and pass in the connection string from mongoDB in the config.env file
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        // After connecting console log the host
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch(err) {
        // If something goes wrong and can't connect, console log error and stop everything and to exit with failure put the 1
        console.error(err)
        process.exit(1)
    }
}

// Export connectDB to be used in server.js
module.exports = connectDB