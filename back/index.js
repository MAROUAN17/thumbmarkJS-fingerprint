import express from "express";
import { getRequestIP } from "h3";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://marouan-hp:5173",
      "http://192.168.100.37:5173",
    ],
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
    ["components.hardware.deviceMemory", 0.18],
    ["components.hardware.vendor", 0.18],
    ["components.hardware.videocard.renderer", 0.18],
    ["components.screen.colorDepth", 0.1],
    ["components.screen.maxTouchPoints", 0.1],
    ["components.system.platform", 0.08],
    ["components.system.browser.name", 0.06],
    ["components.system.browser.version", 0.06],
    ["components.locales.timezone", 0.04],
    ["ipAddress", 0.02],
  ];

  let score = 0;

  for (const [path, weight] of fields) {
    const oldValue = getNested(oldData, path);
    const newValue = getNested(newData, path);

    if (oldValue && newValue && oldValue != newValue) {
      console.log(
        "path -> ",
        path,
        " |",
        "old -> ",
        oldValue,
        "| new -> ",
        newValue
      );

      score += weight * 100;
    }
  }

  return score;
}

function getLastDataFile(directory) {
  const files = fs
    .readdirSync(directory)
    .filter((file) => file.startsWith("data-")); // only data-* files

  if (files.length === 0) return null;

  // Sort alphabetically (works with Date.now() filenames)
  files.sort();

  return path.join(directory, files[files.length - 1]);
}

app.post("/save", (req, res) => {
  try {
    let readData = null;
    let score = 0;
    const data = req.body.data;

    const lastFile = getLastDataFile("./");
    if (lastFile) {
      const file = fs.readFileSync(lastFile);
      readData = JSON.parse(file);
    }

    const h3Event = createH3Event(req);
    const clientIp = getRequestIP(h3Event);

    data.ipAddress = clientIp;

    // console.log('previous data -> ', readData);
    if (readData) score = calculateRiskScore(readData, data);
    if (score != 0) data.confidence_score = score;

    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(`data-${Date.now()}.json`, jsonString);

    res.status(200).send({ score });
  } catch (error) {
    console.log(error);
    res.status(500).send({ mssg: "An Error Occurred" });
  }
});

app.listen(3000, "localhost", () => {
  console.log("SERVER STARTED");
});
