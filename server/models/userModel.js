import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }, // Assumes a Booking model exists
  profilePic: { 
    type: String, 
    default: 'https://i.pravatar.cc/150?img=3' // Placeholder image URL
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const User = mongoose.model('User', userSchema);

export default User;
