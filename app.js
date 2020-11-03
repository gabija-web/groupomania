const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//passport config
require('./config/passport')(passport);

//DB config
const db = require('./config/keys').MongoURI;

//Connect to mongo db
mongoose.connect(
    db, 
    { useNewUrlParser: true, 
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    .then(() => {
      console.log('Successfully connected to MongoDB');
    })
    .catch((error) => {
      console.log('Unable to connect to MongoDB Atlas!');
      console.error(error);
    });

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({ extended: false }));

// express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

//global vars
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/user.js'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, console.log(`Server started on port ${PORT}`));