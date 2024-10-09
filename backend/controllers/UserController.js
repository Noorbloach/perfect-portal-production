import User from '../models/UserModel.js';
import Otp from '../models/OtpModel.js'; // Adjust if the file name is different
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer'; // For sending emails
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Helper function to generate a 4-digit OTP
const generateOtp = () => {
  return crypto.randomInt(1000, 9999).toString();
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const transporter = nodemailer.createTransport({
  service: "Gmail", // or another email service provider
  auth: {
    user: "wbox7072@gmail.com", // replace with your email
    pass: "gzgj qodr slnq sval", // replace with your email password
  },
});

// Register a new user
export const registerUser = async (req, res) => {
  const { email, password, role, name } = req.body;

  try {
    // Check if all fields are provided
    if (!email || !password || !role || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user
    const user = new User({
      email,
      password: hashedPassword,
      role,
      name,
    });
    await user.save();

    // Create a JWT token
    const token = user.createJWT();

    // Respond with success
    res.status(201).json({ token, user });
  } catch (err) {
    // Log and respond with error
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    try {
      const user = await User.findOne({ email }).select("+password");
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
  
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid pass credentials' });
      }
  
      const token = user.createJWT();
      res.status(200).json({ token, user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password'); // Exclude password field
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password'); // Exclude the password field

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller to update user details by ID
// Update user details by ID, including optional image upload
export const updateUserDetailsById = async (req, res) => {
  try {
    const { id } = req.params; // Destructure the userId from route params
    const { phoneNo, address, name } = req.body; // Get the fields to update from the request body

    // Validate input (optional)
    if (!phoneNo && !address && !name && !req.file) {
      return res.status(400).json({ msg: 'No data provided for update.' });
    }

    // Initialize update object
    let updateFields = { phoneNo, address, name };

    // Check if an image file is uploaded
    if (req.file) {
      const profilePic = req.file.filename; // Get the file name from Multer

      // Optional: If the user already has a profile image, remove the old one from the server
      const user = await User.findById(id);
      if (user.profilePic && user.profilePic !== 'default-profile.png') {
        const oldImagePath = path.join(__dirname, '../uploads', user.profilePic);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Delete the old image
        }
      }

      // Add profileImage to the fields to update
      updateFields.profilePic = profilePic;
    }

    // Find user by ID and update the fields (optional: add more fields to update)
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true } // `new: true` returns the updated user; `runValidators: true` applies schema validations
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    // Return the updated user details
    res.status(200).json({
      msg: 'User details updated successfully',
      updatedUser: {
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        address: updatedUser.address,
        phoneNo: updatedUser.phoneNo,
        profilePic: updatedUser.profilePic, // Adjust this if needed
      },
    });
  } catch (error) {
    console.error('Error updating user details:', error);

    // Check for invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid user ID.' });
    }

    res.status(500).json({ msg: 'Server error' });
  }
};

  // Fetch users with the 'employee' role
  export const getEmployees = async (req, res) => {
    try {
      const employees = await User.find({ role: 'employee' }).select('id name'); // Adjust the fields as needed
      res.status(200).json(employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  


export const getUserDetailsById = async (req, res) => {
  try {
    const { id } = req.params; // Destructure the userId from the route params

    // Find the user by ID, excluding the password from the response
    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    // Return the user details
    res.status(200).json({
      msg: 'User details fetched successfully',
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        address: user.address,
        phoneNo: user.phoneNo,
        profilePic:user.profilePic
      },
    });
  } catch (error) {
    console.error('Error fetching user details:', error);

    // Check for invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid user ID.' });
    }

    res.status(500).json({ msg: 'Server error' });
  }
};


export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

    // Save the token and expiry time in the user document
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // Send the reset link via email
    const resetUrl = `http://localhost:5173/resetpassword/${resetToken}`;
    const message = `You requested a password reset. Click the link below to reset your password:
    ${resetUrl}
    This link will expire in 10 minutes.`;

    await transporter.sendMail({
      from: 'wbox7072@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      text: message,
    });

    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Hash the token to compare with the stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    // Find the user with the matching reset token and valid expiration
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // Check if the token is not expired
    });

    console.log('Token from request:', token);
    console.log('Hashed token:', hashedToken);
    console.log('Database token record:', user ? user.resetPasswordToken : 'No user found');
    console.log('Token expiration time:', user ? user.resetPasswordExpires : 'No user found');

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password and update the user's document
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined; // Clear the reset token
    user.resetPasswordExpires = undefined; // Clear the expiration time
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: error.message });
  }
};

// Controller to update the user's profile picture
export const updateUserProfilePic = async (req, res) => {
  try {
    // Ensure the file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Fetch the user based on the logged-in user's ID (assumed available in `req.user`)
    const userId = req.user.userId; // req.user is populated by auth middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's profile picture with the new file path
    user.profilePic = path.join('uploads', req.file.filename);
    
    // Save the updated user to the database
    await user.save();

    res.status(200).json({
      message: 'Profile picture updated successfully',
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while updating profile picture' });
  }
};