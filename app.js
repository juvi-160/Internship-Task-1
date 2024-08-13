const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config(); // Load environment variables

const authRoutes = require('./Routes/authRoutes'); // Ensure this exports a router

const app = express();
const PORT = process.env.PORT || 9000;

app.set('view engine', 'ejs');

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static file middleware
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key', // Use env variable for secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Use routes
app.use(authRoutes);

app.get('/',(req,res) => {
    res.render('login');
})
// Middleware to make `user` available in all templates
app.use((req, res, next) => {
    res.locals.user = req.session.user_id ? req.session.user : null;
    next();
});

/* MONGOOSE SETUP */
mongoose
  .connect(process.env.MONGO_URL,)
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
