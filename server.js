const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')
// pull the connectDB from the config/db
const connectDB = require('./config/db')


// Load config
dotenv.config({ path: './config/config.env' })

// Passport config
require('./config/passport')(passport)

// connect to data base
connectDB()

const app = express ()

// logging 
if (process.env.NODE_ENV === 'development') {
    app.use(morgan ('dev'))
}
//Using EJS for views
app.set('view engine', 'ejs')

// Session Middleware
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
    })
)

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// static folder
app.use(express.static(path.join(__dirname, 'public')))
// app.use(express.static('public'))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

// The process.env.PORT pulls the port variable from /config/config.env and stores it in PORT to be used, if there's issues it will use local host 2000 as the port
const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))