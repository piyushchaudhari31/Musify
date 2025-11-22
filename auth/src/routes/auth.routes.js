const express = require('express')
const { userRegister, googleAuth, LoginUser, checkAuth } = require('../controllers/auth.controller')
const { registerValidator } = require('../middleware/auth.middleware')
const passport = require('passport')

const router = express.Router()

const url = "http://localhost:5173"

router.post('/register',registerValidator,userRegister)
router.post('/login',LoginUser)
router.get('/check-auth',checkAuth)
router.post('/logout', (req, res) => {
  res.clearCookie('token')
  return res.json({ message: 'Logged out successfully' })
})

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', 
    { 
      session:false,
      failureRedirect:`${url}/login`
     }),
  googleAuth
);




module.exports = router