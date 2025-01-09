import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error('MONGO_URI is not defined');
        }
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch(error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;

