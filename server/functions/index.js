import { onRequest } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import mongoose from "mongoose";
import app from "./app.js";
import cleanupBillings from "./cron/cleanupBillings.js";
import cleanGuestData from "./cron/cleanGuestData.js";
import extendOrRecycleFlashSales from "./cron/cleanFlashSales.js";

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { dbName: "exclusive-ecommerce" })
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => logger.error("Mongo error:", err));

export const api = onRequest(app);

export const cleanGuestDataJob = onSchedule("0 0 * * *", async () => {
  logger.info("Running guest data cleanup");
  await cleanGuestData();
});

export const billingCleanupJob = onSchedule("0 * * * *", async () => {
  logger.info("Running billing cleanup");
  await cleanupBillings();
});

export const flashSaleExtensionJob = onSchedule("0 0 * * *", async () => {
  logger.info("Running flash sale extension");
  await extendOrRecycleFlashSales();
});

