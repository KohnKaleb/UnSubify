import { createClient } from "redis";
import { genImapConfig } from "../config/imapconfig.js";

async function saveSession(sessionID, email, tokens) {
  const imapConfig = genImapConfig(email, tokens.access_token);
  console.log("Saving session:", imapConfig);
  const redisClient = createClient();
  redisClient.on("error", (err) => console.error("Redis Client Error", err));
  await redisClient.connect();
  await redisClient.setEx(
    sessionID,
    Math.floor((tokens.expiry_date - Date.now()) / 1000), // seconds
    JSON.stringify(imapConfig)
  );
  await redisClient.quit();
}

async function deleteSession(sessionID) {
  const redisClient = createClient();
  redisClient.on("error", (err) => console.error("Redis Client Error", err));
  await redisClient.connect();
  console.log("Redis client connected");
  try {
    const result = await redisClient.del(sessionID);
    console.log("Session deleted:", result);
    return result;
  } catch (err) {
    console.error("Error deleting session:", err);
    throw err;
  } finally {
    await redisClient.quit();
  }
}

async function getSessionKey(sessionID) {
  const redisClient = createClient();
  redisClient.on("error", (err) => console.error("Redis Client Error", err));
  await redisClient.connect();
  const session = await redisClient.get(sessionID);
  await redisClient.quit();
  if (session) return session;
  return null;
}

async function getSessionExpiry(sessionID) {
  const redisClient = createClient();
  redisClient.on("error", (err) => console.error("Redis Client Error", err));
  await redisClient.connect();
  try {
    const ttl = await redisClient.ttl(sessionID);
    if (ttl === -1) {
      console.error("The key does not have an expiration time.");
      return null;
    } else if (ttl === -2) {
      console.log("The key does not exist.");
      return null;
    } else {
      console.log("Time to live for sessionID:", ttl, "seconds");
      return Date.now() + ttl * 1000;
    }
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    await redisClient.quit();
  }
}

export { saveSession, getSessionKey, getSessionExpiry, deleteSession };
