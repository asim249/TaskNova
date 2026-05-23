// src/routes/auth.routes.js

const express = require('express')
const router = express.Router()
const {
    register,
    verifyEmail,
    resend,
    login,
    forgotPassword,
    resetPassword,
    logout, getCurrentUser
} = require('../controller/auth.controller')

// Public Routes
router.post('/register', register)
router.post('/verify-email', verifyEmail)
router.get('/resend/:email', resend)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/login', login)

router.get('/logout', logout)
router.get('/current-user', getCurrentUser)

module.exports = router