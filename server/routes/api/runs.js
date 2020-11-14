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
    run.sessionName = session.sessionName
    run.speeds = DataLoader.getSpeedFromPoints(run.rawPositions, run.sampleRate)
    run.avgSpeed = DataLoader.getAverageSpeed(run.speeds)
    run.beacons = DataLoader.evaluateBeacons(run.rawPositions, sessionBeacons, beaconRange, run.speeds, run.sampleRate)
    run.distance = DataLoader.getDistanceFromPoints(run.rawPositions)
    run.time = DataLoader.getTime(run.rawPositions, run.sampleRate)
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
  const client = await mongodb.MongoClient.connect('mongodb+srv://dbUser:dbUserPassword@cluster0.fr7ka.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  try {
    const sessions = client.db('orienteering-race-project').collection('sessions')
    const myquery = { sessionId: req.params.session_id }
    const newvalues = {
      $set: {
        'runs.$[run].comment': req.body.comment,
        'runs.$[run].rating': req.body.rating
      }
    }
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
