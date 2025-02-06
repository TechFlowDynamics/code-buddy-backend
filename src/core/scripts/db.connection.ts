import mongoose from "mongoose";
import config from "../../config";
import { Request, Response, NextFunction } from "express";
import customLogger from "../../app/middleware/logger.middleware";

let isConnected: boolean = false;
const dbConnectionUrl = `${config.MONGODB_CONNECTION_URL}/${config.DB_NAME}`;
export async function connectToDatabase() { 
  try {
    if (isConnected) {
      console.log("Using existing MongoDB connection");
      return isConnected;
    }

    await mongoose.connect(dbConnectionUrl);

    isConnected = true;

    console.log("Connected to MongoDB database");

    return isConnected;
  } catch (error) {
    console.error("Error connecting to MongoDB database:", error);
    throw error;
  }
}
export async function connectToReqDatabase(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (isConnected) {
      next();
    }

    console.log("🚀 ~ dbConnectionUrl:", dbConnectionUrl);
    await mongoose.connect(dbConnectionUrl);
    isConnected = true;

    customLogger.info("Connected to MongoDB database");
    next();
  } catch (error) {
    console.error("Error connecting to MongoDB database:", error);
    throw error;
  }
}
export async function connectToServerlessDatabase(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (isConnected) {
      console.log("Using existing MongoDB connection");
      next();
    }

    await mongoose.connect(dbConnectionUrl);
    console.log("Connected to MongoDB database");

    next();
  } catch (error) {
    console.error("Error connecting to MongoDB database:", error);
    throw error;
  }
}

// Connect to the database when this module is imported
connectToDatabase().catch(error => console.error("Error:", error));

export function getDatabaseConnection() {
  if (!isConnected) {
    throw new Error("Database is not connected");
  } else {
    connectToDatabase().catch(error => console.error("Error:", error));
  }
  return mongoose.connection;
}
