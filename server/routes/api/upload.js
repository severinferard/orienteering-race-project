const express = require('express')
const mongodb = require('mongodb')
const DataLoader = require('../../DataLoader')
const GeoJsonLoader = require('../../GeoJsonLoader')

const router = express.Router()
module.exports = router

router.post('/', async (req, res) => {
  const client = await mongodb.MongoClient.connect('mongodb+srv://dbUser:dbUserPassword@cluster0.fr7ka.mongodb.net/', {
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
    rawPositions: rawData.data,
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
  res.sendStatus(200)
})
