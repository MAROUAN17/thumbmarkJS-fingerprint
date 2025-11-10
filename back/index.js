import express from "express";
import {H3, getRequestIP} from "h3";

const app = express();

app.get("/", (req, res) => {
  res.status(200).send({ mssg: req.headers["x-forwarded-for"] || req.socket.remoteAddress });
});

app.listen(3000, () => {
  console.log("SERVER STARTED");
});
