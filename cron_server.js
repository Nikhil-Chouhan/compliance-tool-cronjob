const express = require("express");
const cron = require("node-cron");

const app = express();

const makeRequest = async () => {
  const url = process.env.APP_URL || "http://localhost:3000";
  const response = await fetch(`${url}/api/trigger-cronjobs`);
  const data = await response.json();
  console.log(data);
};

// 0 8 * * *

cron.schedule("*/1 * * * *", function () {
  makeRequest();
  console.log("Running cron job at 8 in the morning");
});

app.get("/", (req, res) => {
  res.send("CronJob Server is running."); 
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`CronJob Server is running on URL: ${process.env.APP_URL} , PORT: ${port}`);
});
