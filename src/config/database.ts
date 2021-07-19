import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connection = async () => {
  try {
    let connect: any;
    const options = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    };
    switch (process.env.NODE_ENV) {
      case 'development':
        connect = await mongoose.connect(process.env.DEV_MONGO_URI, options);
        break;
      case 'test':
        connect = await mongoose.connect(process.env.TEST_MONGO_URI, options);
        break;
      case 'production':
        connect = await mongoose.connect(process.env.PROD_MONGO_URI, options);
        break;
      default:
        console.log('Connection did not succeed');
    }
    console.log(`connected to MongoDB in ${process.env.NODE_ENV} mood on ${connect.connection.host}`);
  } catch (error: any) {
    return error;
  }
};

const dropDB = async () => {
  try {
    for (const collection in mongoose.connection.collections) {
      mongoose.connection.collections[collection].drop(() => {});
    }
  } catch (error) {
    throw error;
  }
};

export { connection, dropDB };
