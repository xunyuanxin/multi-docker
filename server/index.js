const keys = require("./keys");
 
// Express App Setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
 
const app = express();
app.use(cors());
app.use(bodyParser.json());
 
// Postgres Client Setup
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
  ssl: {
    rejectUnauthorized: false      // production needed
  }
});
 
pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});
 
// Redis Client Setup
const redis = require("redis");
const redisClient = redis.createClient({
  url: `redis://${keys.redisHost}:${keys.redisPort}`,
  retry_strategy: () => 1000,
});
const redisPublisher = redisClient.duplicate();
 
(async () => {
  await redisClient.connect();
  await redisPublisher.connect();
})();
 
// Express route handlers
 
app.get("/", (req, res) => {
  res.send("Hi");
});
 
app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * from values");
 
  res.send(values.rows);
});
 
app.get("/values/current", async (req, res) => {
  const values = await redisClient.hGetAll("values");
  res.send(values);
});
 
app.post("/values", async (req, res) => {
  const index = req.body.index;
 
  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }
 
  await redisClient.hSet("values", index, "Nothing yet!");
  await redisPublisher.publish("insert", index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);
 
  res.send({ working: true });
});
 
app.listen(5000, (err) => {
  console.log("Listening");
});