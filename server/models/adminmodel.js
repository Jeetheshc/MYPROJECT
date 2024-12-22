import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    profilePic: {
        type: String,
        default: 'https://i.pravatar.cc/150?img=3' // Placeholder image URL
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
