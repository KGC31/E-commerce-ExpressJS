const express                   = require("express");
const path                      = require("path");
const ejs                       = require("ejs");
const dotenv                    = require("dotenv").config();

const dbConnect                 = require("./config/dbConnect");
const mongoose                  = require("mongoose");

const bodyParser                = require("body-parser");
const cookieParser              = require('cookie-parser')
const flash                     = require('connect-flash');
const cors                      = require('cors')

const passport                  = require('./config/passport')
const session                   = require('express-session')
const LocalStrategy             = require('passport-local').Strategy
const User                      = require('./models/userModel'); 

const authRoute                 = require('./routes/authRoute')
const productRoute              = require('./routes/productRoute')
const homeRoute                 = require('./routes/homeRoute')
const adminRoute                = require('./routes/adminRoute')
const apiRoute                  = require('./routes/apiRoute')

const fetchCategories           = require('./middlewares/fetchCategories')
const fetchBrands               = require('./middlewares/fetchBrands')

// Port of the localhost
const PORT                      = process.env.PORT || 3000;
const app                       = express();

dbConnect();

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));

app.use(cookieParser());

app.use(flash());

app.use(cors())

// View engine 
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs');

// Static files of the frontend
app.use(express.static(path.join(__dirname + '/public')));

// Use session
app.use(session({
    secret: "secret_code",
    resave: false,
    saveUninitialized: false
}))

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Middleware
app.use(fetchCategories)
app.use(fetchBrands)

app.use("", homeRoute)
app.use("/api/user", authRoute)
// app.use("/product", productRoute)
app.use("/admin", adminRoute)
app.use("/api", apiRoute)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});