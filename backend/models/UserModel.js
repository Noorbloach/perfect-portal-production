import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'employee', 'management'],
    default: 'user',
  },
  name: {
    type: String,
    required: true,
  },
  address:{
    type:String,
  },
  
  phoneNo:{
    type:String,
  },
  profilePic: {
    type: String, // Stores the file path or URL of the uploaded profile picture
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

  return resetToken;
};
// Pre-save middleware for hashing the password
// Pre-save middleware for hashing the password


// Method to generate JWT
userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, role: this.role, name: this.name },
    'jwtSecret', // You may want to use an environment variable in a real-world scenario
    {
      expiresIn: '1h',
    }
  );
};

// Password comparison method



const User = mongoose.model('User', userSchema);

export default User;
