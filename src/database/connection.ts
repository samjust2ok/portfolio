// db.js
import mongoose from "mongoose";
declare global {
  var _mongoose: {
    connection: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

global._mongoose = { connection: null, promise: null };

export async function connect() {
  if (global._mongoose.promise) return global._mongoose.promise;

  try {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_PORTFOLIO_DB;

    if (!uri) throw new Error("Invalid mongodb URI");

    console.log(uri);

    const promise = (global._mongoose.promise = mongoose.connect(uri, {
      dbName,
    }));
    const connection = (global._mongoose.connection = await promise);

    console.log("[CONNECTED] Connected to mongodb database");

    return connection;
  } catch (error) {
    console.log("[CONNECTION FAILED] Failed to connect to mongodb database");
    global._mongoose.promise = null;
    global._mongoose.connection = null;
    throw new Error(
      "We are experiencing some connectivity issue, please try again later"
    );
  }
}
