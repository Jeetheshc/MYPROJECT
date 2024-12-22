import mongoose from 'mongoose';

const carProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  cars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }],
  profilePic: { type: String, default: 'https://i.pravatar.cc/150?img=3' }
}, { timestamps: true });

const CarProvider = mongoose.model('CarProvider', carProviderSchema);
export default CarProvider;
