import mongoose, { Mongoose, MongooseError } from "mongoose";
import { exit } from "node:process";
import { DATABASE_NAME } from "../constants/dbConstants";
import { HttpError } from "../utils/errors.util";

let db: Mongoose;

const connect = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new HttpError(
      "DATABASE_URI is missing in the environment variables!",
    );
  }

  db = await mongoose.connect(uri, { dbName: DATABASE_NAME });

  console.log(
    "Database Connected Successfully",
    db.connection.host,
    db.connection.name,
  );
};

const disconnect = async () => {
  await db.disconnect();
  console.log("Database disconnect()");
};

const getDB = () => {
  if (!db) {
    throw new Error("DB is not Connected!");
  }
  return db;
};

export { connect, disconnect, getDB };
