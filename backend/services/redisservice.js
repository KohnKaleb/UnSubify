import { createClient } from "redis";

async function saveSession(sessionID, imapConfig) {
  console.log("Saving session:", imapConfig);
  const redisClient = createClient();
  redisClient.on("error", (err) => console.error("Redis Client Error", err));
  await redisClient.connect();

  console.log("Redis client connected");
  await redisClient.setEx(
    sessionID,
    1800000, // Convert milliseconds to seconds
    JSON.stringify(imapConfig)
  );
  console.log("Session saved");
  await redisClient.quit();
}

async function deleteSession(sessionID) {
  const redisClient = createClient();
  redisClient.on("error", (err) => console.error("Redis Client Error", err));
  await redisClient.connect();
  console.log("Redis client connected");

  return new Promise((resolve, reject) => {
    redisClient.del(sessionID, (err, res) => {
      if (err) {
        console.error("Error deleting session:", err);
        reject(err);
      } else {
        console.log("Session deleted:", res);
        resolve(res);
      }
    });
  });
}

async function getSession(sessionID) {
  const redisClient = createClient();
  redisClient.on("error", (err) => console.error("Redis Client Error", err));
  await redisClient.connect();
  console.log("Redis client connected");

  const sessionData = await redisClient.get(sessionID);
  await redisClient.quit();

  if (sessionData) {
    return JSON.parse(sessionData);
  } else {
    console.log("Session not found");
    return null;
  }
}

export { saveSession, getSession, deleteSession };
