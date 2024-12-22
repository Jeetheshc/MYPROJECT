import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    availability: { type: Boolean, default: true },
    carType: { type: String, required: true },
    carImages: [{ type: String, required: true }], // Array of strings to store image URLs
    features: [{ type: String, required: true }],
    location: { type: String, required: true },
    carNumber: { type: String, required: true, unique: true }, // New field for car number
    ownerDetails: {
      name: { type: String, required: true },
      mobileNumber: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      aadharNumber: { type: String, required: true },
      bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
      
    },
  },
  { timestamps: true }
);

const Car = mongoose.models.Car || mongoose.model("Car", carSchema);

export default Car;
