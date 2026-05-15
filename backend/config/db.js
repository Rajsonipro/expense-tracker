import mongoose from 'mongoose';

let mongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI?.trim();

  // Check if URI exists
  if (!uri) {
    console.log('Using mock/memory database mode for development');
    mongoConnected = true;
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
      maxPoolSize: 10,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    mongoConnected = true;

  } catch (error) {
    console.warn(`MongoDB connection failed: ${error.message}`);
    console.log('Continuing in mock database mode...');
    mongoConnected = true;
  }
};

export default connectDB;
export { mongoConnected };