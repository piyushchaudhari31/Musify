const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');

// Routes
const authRoutes = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');

const app = express();


// Middleware setup
app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://musify-song.onrender.com"
  ],
  credentials: true
}));


// Google OAuth setup
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `https://musify-mxwi.onrender.com/api/auth/google/callback`,
}, (accessToken, refreshToken, profile, done) => {
  // Here, you would typically find or create a user in your database
  // For this example, we'll just return the profile
  return done(null, profile);
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);

module.exports = app;
