const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const app = express();

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


//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/user'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, console.log(`Server started on port ${PORT}`));