const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const Article = require('./models/article');
const methodOverride = require('method-override');
const { patch } = require('./routes');
const bodyParser = require('body-parser');
const path = require('path');
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

    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      next();
    });

//EJS
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Bodyparser
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false}));

app.use(methodOverride('_method'));

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

//Routers
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/user'));

app.use(express.static(__dirname + '/'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

module.exports = app;