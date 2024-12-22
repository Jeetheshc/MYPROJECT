import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://jeetheshc:TUSRozswTTbC3VhP@cluster0.zsf5t.mongodb.net/carento_1', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });



    //   await mongoose.connect(process.env.MONGO_URI, {

    //   });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process if connection fails
  }
};
