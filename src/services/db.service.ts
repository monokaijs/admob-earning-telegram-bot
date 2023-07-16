import mongoose from "mongoose";

class DbService {
  connect() {
    console.log('Connecting to', process.env.MONGO_URI);
    mongoose.set("strictQuery", false);
    return mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 100
    });
  }
}

export default new DbService();
