const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
// pull the connectDB from the config/db
const connectDB = require('./config/db')


// Load config
dotenv.config({ path: './config/config.env' })

// Passport config
require('./config/passport')(passport)

// connect to data base
connectDB()

const app = express ()

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method override
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    }))

// logging 
if (process.env.NODE_ENV === 'development') {
    app.use(morgan ('dev'))
}

// Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')

// Handlebars
app.engine('.hbs', exphbs.engine({ helpers: {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select,
}, 
    defaultLayout: 'main', 
    extname: '.hbs',
 })
 )
app.set('view engine', '.hbs')

// Session Middleware
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({mongoUrl:process.env.MONGO_URI })
    })
)

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global var
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})

// static folder
app.use(express.static(path.join(__dirname, 'public')))
// app.use(express.static('public'))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

// The process.env.PORT pulls the port variable from /config/config.env and stores it in PORT to be used, if there's issues it will use local host 2000 as the port
const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))