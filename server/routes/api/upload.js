const express = require('express')
const mongodb = require('mongodb')
const DataLoader = require('../../DataLoader')
const GeoJsonLoader = require('../../GeoJsonLoader')

const router = express.Router()
module.exports = router

router.get('/', async (req, res) => {
	console.log("get");
	res.send("test");
})

router.post('/', async (req, res) => {
	console.log("Received post on /api/upload")
	console.log(req.body);
return
  const client = await mongodb.MongoClient.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  const sessions = client.db('orienteering-race-project').collection('sessions')
  const currentSession = (await sessions.find().limit(1).sort({ $natural: -1 }).toArray())[0]
  const beacons = currentSession.beacons
  const rawData = req.body
  const sampleRate = 1
  const beaconRange = 10
  const speeds = DataLoader.getSpeedFromPoints(rawData.data, sampleRate)
  const avgSpeed = DataLoader.getAverageSpeed(speeds)
  const distance = DataLoader.getDistanceFromPoints(rawData.data)
  const time = DataLoader.getTime(rawData.data, sampleRate)

  const checkedBeacons = DataLoader.evaluateBeacons(rawData.data, beacons, beaconRange, speeds, sampleRate)
  const obj = {
    id: rawData.id,
    firmwareVersion: rawData.firmwareVersion,
    sampleRate: rawData.sampleRate,
    // beacons: [],
    rawPositions: rawData.data.map(coord => [coord[1], coord[0]]),
    // speeds: [],
    // avgSpeed: null,
    // distance: null,
    // time: null,
    comment: '',
    rating: null
  }
  // const geoJson = GeoJsonLoader.createGeoJson(obj)
  // obj.geoJon = geoJson
  sessions.updateOne({ _id: currentSession._id }, { $push: { runs: obj } })
  console.log("Added data to DB");
  console.log(currentSession._id, currentSession.sessionName)
  res.sendStatus(200)
})
