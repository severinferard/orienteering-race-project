const express = require('express')
const mongodb = require('mongodb')
const DataLoader = require('../../DataLoader')
const GeoJsonLoader = require('../../GeoJsonLoader')

const router = express.Router()
module.exports = router

// Get student data
router.get('/:session_id/:student_id', async (req, res) => {
  console.log('get runs')
  const client = await mongodb.MongoClient.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  try {
    const sessions = client.db('orienteering-race-project').collection('sessions')
    const session = (await sessions.find({ _id: mongodb.ObjectID(req.params.session_id) }).toArray())[0]
    const run = session.runs.filter((run) => run.id === req.params.student_id)[0]
    const sessionBeacons = session.beacons
	const beaconRange = 10
	run.class_name = session.class_name;
	run.class_id = session.class_id
	run.school_name = session.school_name;
	run.school_id = session.school_id;
	run.session_name = session.session_name
	run.session_date = session.date;
	run.class_id = session.class_id;

	run.bestDistance = session.runs.map(run => DataLoader.getDistanceFromPoints(run.rawPositions)).sort((a, b) => b - a)[0]
	run.bestTime = session.runs.map(run => DataLoader.getTime(run.rawPositions, run.sampleRate)).sort((a, b) => a - b)[0]
    run.speeds = DataLoader.getSpeedFromPoints(run.rawPositions, run.sampleRate)
    run.avgSpeed = DataLoader.getAverageSpeed(run.speeds)
    run.beacons = DataLoader.evaluateBeacons(run.rawPositions, sessionBeacons, beaconRange, run.speeds, run.sampleRate)
    run.distance = DataLoader.getDistanceFromPoints(run.rawPositions)
	run.time = DataLoader.getTime(run.rawPositions, run.sampleRate)
	console.log("rawpos len", run.rawPositions.length)
	console.log("samplerate", run.sampleRate)
	console.log("time", run.time)
    run.geoJson = GeoJsonLoader.createGeoJson(run)
    res.send(run)
  } catch (error) {
    console.log(error)
    res.status(500).send()
  } finally {
    client.close()
  }
})

// Store comment and rating
router.post('/:session_id/:student_id', async (req, res) => {
  console.log(req.body)
  const client = await mongodb.MongoClient.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  try {
    const sessions = client.db('orienteering-race-project').collection('sessions')
    const myquery = { _id: mongodb.ObjectID(req.params.session_id) }
    console.log('query', myquery)
    const newvalues = {
      $set: {
        'runs.$[run].comment': req.body.comment,
        'runs.$[run].rating': req.body.rating
      }
    }
    console.log('student_id', req.params.student_id)
    const options = {
      arrayFilters: [{ 'run.id': req.params.student_id }]
    }
    sessions.updateOne(myquery, newvalues, options, (err, res) => {
      if (err) throw err
      client.close()
    })
    res.status(200).send()
  } catch (error) {
    res.status(500).send()
    client.close()
  }
})
