import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  zipCode:{
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Client = mongoose.model('Client', clientSchema);

export default Client;
