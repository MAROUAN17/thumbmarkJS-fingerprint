import express from "express";
import { getRequestIP } from "h3";

const app = express();

function createH3Event(req) {
  return {
    req,
    node: {
      req,
    },
  };
}

app.get("/ip", (req, res) => {
  const h3Event = createH3Event(req);
  const clientIp = getRequestIP(h3Event);
  res.status(200).send({ ip: clientIp });
});

app.get("/", (req, res) => {
  res
    .status(200)
    .send({ mssg: req.headers["x-forwarded-for"] || req.socket.remoteAddress });
});

app.listen(3000, () => {
  console.log("SERVER STARTED");
});
