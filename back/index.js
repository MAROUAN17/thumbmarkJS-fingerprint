import express from "express";
import { getRequestIP } from "h3";
import cors from "cors";
import fs from "fs";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

function createH3Event(req) {
  return {
    req,
    node: {
      req,
    },
  };
}

function getNested(data, path) {
  return path.split(".").reduce((acc, curr) => acc && acc[curr], data);
}

function calculateRiskScore(oldData, newData) {
  const fields = [
    ["components.hardware.deviceMemory", 0.2],
    ["components.hardware.videocard.renderer", 0.2],
    ["components.system.platform", 0.15],
    ["components.system.browser.name", 0.1],
    ["components.system.browser.version", 0.1],
    ["components.locales.timezone", 0.1],
    ["components.screen.colorDepth", 0.05],
    ["components.screen.maxTouchPoints", 0.05], 
    ["ipAddress", 0.05],
  ];

  let score = 0;

  for (const [path, weight] of fields) {
    const oldValue = getNested(newData, path);
    const newValue = getNested(oldData, path);

    if (oldValue && newValue && oldValue != newValue) {
      score += weight * 100;
    }
  }

  return score;
}

app.post("/save", (req, res) => {
  try {
    let readData = {};
    let score = 0;
    const data = req.body.data;

    if (fs.existsSync("data.json")) {
      const file = fs.readFileSync("data.json");
      readData = JSON.parse(file);
    }

    const h3Event = createH3Event(req);
    const clientIp = getRequestIP(h3Event);

    data.ipAddress = clientIp;

    if (readData)
      score = calculateRiskScore(readData, data);

    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync("data.json", jsonString);

    res.status(200).send({ score });
  } catch (error) {
    console.log(error);
    res.status(500).send({ mssg: "An Error Occurred" });
  }
});

//playwright
app.listen(3000, () => {
  console.log("SERVER STARTED");
});
