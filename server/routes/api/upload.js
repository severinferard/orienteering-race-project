const express = require("express");
const mongodb = require("mongodb");
const DataLoader = require("../../DataLoader");
const GeoJsonLoader = require("../../GeoJsonLoader")

const router = express.Router();
module.exports = router;

router.get('/', async (req, res) => {
  res.send("hello");
}) 

router.post("/", async (req, res) => {
  const client = await mongodb.MongoClient.connect(
    "mongodb://localhost:27017",
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  sessions = client.db("orienteering-race-project").collection("sessions");
  currentSession = (
    await sessions.find().limit(1).sort({ $natural: -1 }).toArray()
  )[0];
  let beacons     = currentSession.beacons;
  let rawData     = req.body;
  let sampleRate  = 1;
  let beaconRange = 10;
  let speeds      = DataLoader.getSpeedFromPoints(rawData.data, sampleRate);
  let avgSpeed    = DataLoader.getAverageSpeed(speeds);
  let distance    = DataLoader.getDistanceFromPoints(rawData.data);
  let time        = DataLoader.getTime(rawData.data, sampleRate);

  let checkedBeacons = DataLoader.evaluateBeacons(
    rawData.data,
    beacons,
    beaconRange,
    speeds,
    sampleRate
  );

  let obj = {
    id             : rawData.id,
    firmwareVersion: rawData.firmwareVersion,
    sampleRate     : rawData.sampleRate,
    beacons        : checkedBeacons,
    rawPositions   : rawData.data,
    speeds         : speeds,
    avgSpeed       : avgSpeed,
    distance       : distance,
    time           : time,
    comment        : "",
    rating         : null,
  };
  let geoJson = GeoJsonLoader.createGeoJson(obj);
  obj.geoJon = geoJson;
sessions.updateOne({_id: currentSession._id},{"$push": {"runs": obj}})
  console.log("finished")
  res.sendStatus(200);
});

