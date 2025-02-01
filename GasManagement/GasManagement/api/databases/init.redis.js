const { session } = require("../../config/env/production");
// const { session } = require("../../config/env/development");
const { createClient } = require("redis");
const redis = async () => {
  let client;
  try {
    client = createClient({
      url: session.url,
      socket: {
        reconnectStrategy: (retries) => {
          console.log(retries);
          if (retries >= 10) {
            return false;
          }
          return Math.min(retries * 50, 1000);
        },
      },
    });
    await client
      .on("error", (err) => {
        console.log("Redis Client", err);
      })
      .connect();
    return client;
  } catch (e) {
    console.log(`Error Connnect Redis : ${e.message}`);
    try {
      await client.quit();
    } catch (error) {
      console.log("waiting redis server prepare...");
    }
  }
};
const client = redis();
client
  .then(async (c) => {
    if (!c) {
      console.log("Redis connect failed !!!");
      return;
    }
    const pong = await c.ping();
    if (pong === "PONG") {
      console.log("Redis connected !!! --", path);
    }
  })
  .catch((e) => {
    console.log(`Error Connnect Redis : ${e.message}`);
  });

module.exports = { client, redis };
