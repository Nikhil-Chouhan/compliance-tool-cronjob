require('dotenv').config();
const express = require("express");
const cron = require("node-cron");

const app = express();

const url = process.env.APP_URL;
const port = process.env.CRON_PORT;

const makeRequest = async () => {
  const response = await fetch(`${url}/api/trigger-cronjobs`);
  const data = await response.json();
  console.log(data);
};

// 0 8 * * *  -- everyday 8 AM 
// */1 * * * * -- after every minute

cron.schedule("*/1 * * * *", function () {
  makeRequest();
  console.log("Running cron job at 8 in the morning");
});

app.get("/", (req, res) => {
  res.send("CronJob Server is running."); 
});

app.listen(port, () => {
  console.log(`CronJob Server is running on URL: ${url} , PORT: ${port}`);
});
