import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['ETA', 'Proposal Sent', 'Approved', 'Rejected','Project Started','Proposal Rejected'],
    required: true,
  },
  adminStatus: {
    type: String,
    enum: ['Pending', 'Takeoff In Progress', 'Pending In Progress', 'Completed', 'On Hold', 'Revision'],
    default: 'Pending',  // Default value for admin status
  },
  description:{
    type:String
  },
  subcategory: {
    type: String,
    enum: ['geoglyphs', 'stellar', 'perfect'],
    default: null,
  },
  projectType: {
    type: String,
    enum: ['residential', 'commercial', 'industrial'],
    default: null,
  },
  clientDueDate: {
    type: Date,
  },
  opsDueDate: {
    type: Date,
  },
  initialAmount: {
    type: Number,
    
  },
  totalAmount: {
    type: Number,
   
  },
  remainingAmount: {
    type: Number,
    
  },
  clientPermanentNotes: {
    type: String,
  },
  rfiAddendum: {
    type: String,
  },
  clientType: {
    type: String,
    enum: ['new', 'old'],
    required: true,
  },
  projectLink: {
    type: String,  // Project link field
   
  },
  estimatorLink: {
    type: String,  // Project link field
    
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',  // Reference to the Client model
    required: true,
  },
  template:{
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
