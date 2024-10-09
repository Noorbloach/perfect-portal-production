import express from 'express';
import * as userController from "../controllers/UserController.js";
import upload from '../config/multer.js';
const router = express.Router();

// @route   POST /auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', userController.registerUser);

// @route   POST /auth/login
// @desc    Login user
// @access  Public
router.post('/login', userController.loginUser);

//router.post('/registerUser', userController.registerEmployee);
router.get('/users', userController.getAllUsers);

router.get('/user/:id', userController.getUserById);

router.put('/update-details/:id', upload.single('profileImage'), userController.updateUserDetailsById);

router.get('/user-details/:id',  userController.getUserDetailsById);

router.get('/users/role/employee', userController.getEmployees);

// Route to request a password reset
router.post('/forgot-password', userController.requestPasswordReset);

// Route to reset the password
router.post('/reset-password/:token', userController.resetPassword);

// Route to upload or update profile picture, protected by auth middleware
router.post('/upload-profile-pic', upload.single('profilePic'), userController.updateUserProfilePic)

export default router;
