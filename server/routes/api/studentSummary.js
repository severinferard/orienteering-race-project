const express = require('express')
const mongodb = require('mongodb')
const GeoJsonLoader = require('../../GeoJsonLoader')
const { spawn } = require('child_process');

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
	const clss = await client.db('orienteering-race-project').collection('schools').findOne({"classes" : {$elemMatch: {"_id": mongodb.ObjectID(req.params.class_id)}}})
	for (const run of runs ) {
		if (run !== undefined) {
			const session = sessions.filter(session => session.class_id == req.params.class_id)[0]
			const child = spawn("python3", [__dirname + "/../../analyse.py"])
			// we dont need bestTime or bestDistance so no need to add the other students runs
			const arg = {
				runs: [run],
				beacons: session.beacons
			}
			child.stdin.write(JSON.stringify(arg))
			child.stdin.end();
			let data;
			await new Promise((resolve, reject) => {
				child.stdout.on('data', d => {
					data = d
					resolve()
				})
			})
			let parsed = JSON.parse(data.toString('utf8'))
			run.bestDistance = parsed.bestDistance
			run.bestTime = parsed.bestTime
			run.speeds = parsed.speeds
			run.avgSpeed = parsed.avgSpeed
			run.beacons = parsed.beacons
			run.distance = parsed.distance
			run.time = parsed.time
			run.geoJson = GeoJsonLoader.createGeoJson(run);
			run.beaconsSuccess = (run.beacons.filter(b => b.valided).length / run.beacons.length) * 100
			run.session = {name: session.session_name, date: session.session_date}
		} else {
			run = null
		}
	}
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
