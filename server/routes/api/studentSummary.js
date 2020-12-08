const express = require('express')
const mongodb = require('mongodb')
const GeoJsonLoader = require('../../GeoJsonLoader')
const DataLoader = require('../../DataLoader')

const router = express.Router()
module.exports = router

router.get('/:class_id/:student_id', async (req, res) => {
  const client = await mongodb.MongoClient.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  try {
	const sessions = await client.db('orienteering-race-project').collection('sessions').find({"class_id": mongodb.ObjectID(req.params.class_id)}).toArray()
	const runs = sessions.map(session => session.runs.filter(run => run.id == req.params.student_id)[0])
	console.log("runs",runs)
	const clss = await client.db('orienteering-race-project').collection('schools').findOne({"classes" : {$elemMatch: {"_id": mongodb.ObjectID(req.params.class_id)}}})
	runs.forEach(run => {
		if (run !== undefined) {
			const session = sessions.filter(session => session.class_id == req.params.class_id)[0]
			const sessionBeacons = session.beacons
			const beaconRange = 10
			run.bestDistance = session.runs.map(run => DataLoader.getDistanceFromPoints(run.rawPositions)).sort((a, b) => b - a)[0]
			run.bestTime = session.runs.map(run => DataLoader.getTime(run.rawPositions, run.sampleRate)).sort((a, b) => a - b)[0]
			run.speeds = DataLoader.getSpeedFromPoints(run.rawPositions, run.sampleRate)
			run.avgSpeed = DataLoader.getAverageSpeed(run.speeds)
			run.beacons = DataLoader.evaluateBeacons(run.rawPositions, sessionBeacons, beaconRange, run.speeds, run.sampleRate)
			run.beaconsSuccess = (run.beacons.filter(b => b.valided).length / run.beacons.length) * 100
			run.distance = DataLoader.getDistanceFromPoints(run.rawPositions)
			run.time = DataLoader.getTime(run.rawPositions, run.sampleRate)
			run.geoJson = GeoJsonLoader.createGeoJson(run)
			run.session = {name: session.session_name, date: session.session_date}
		} else {
			run = null
		}
	})
	let ret = {
		class_name: clss.classes.filter(c => c._id == req.params.class_id)[0].name,
		class_id: mongodb.ObjectID(req.params.class_id),
		school_name: clss.name,
		school_id: clss._id,
		runs: runs
	}
    res.send(ret)
  } catch (error) {
    console.log(error)
  } finally {
    client.close()
  }
})
