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
  const client = await mongodb.MongoClient.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  const sessions = client.db('orienteering-race-project').collection('sessions')
  const currentSession = (await sessions.find().limit(1).sort({ $natural: -1 }).toArray())[0]
  const rawData = req.body
  const obj = {
    id: rawData.id,
    firmwareVersion: rawData.firmwareVersion,
    sampleRate: rawData.sampleRate,
    rawPositions: rawData.data.map(coord => [coord[1], coord[0]]),
    comment: '',
    rating: null
  }
  sessions.updateOne({ _id: currentSession._id }, { $push: { runs: obj } })
  console.log("Added data to DB");
  console.log(currentSession._id, currentSession.session_name)
  res.sendStatus(200)
})
