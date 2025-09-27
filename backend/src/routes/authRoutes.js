// Imports
import express from 'express'
import * as authController from '../controllers/authController.js'

// Creates router instance
const router = express.Router()

// POST /api/auth/signup
router.post('/signup', authController.signup)

// POST /api/auth/signin
router.post('/signin', authController.signin)

// Export router
export default router
