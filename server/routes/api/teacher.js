const express = require('express')
const mongodb = require('mongodb')
const GeoJsonLoader = require('../../GeoJsonLoader')
const DataLoader = require('../../DataLoader')
const { spawn } = require('child_process');

const router = express.Router()
module.exports = router

router.get('/:session_id', async (req, res) => {
  const client = await mongodb.MongoClient.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  try {
    const sessions = client.db('orienteering-race-project').collection('sessions')
    const session = (await sessions.find({ _id: mongodb.ObjectID(req.params.session_id) }).toArray())[0]
    const sessionBeacons = session.beacons
    const beaconRange = 10
    for (const run of session.runs ) {
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
      run.speeds = parsed.speeds
      run.avgSpeed = parsed.avgSpeed
      run.beacons = parsed.beacons
      run.distance = parsed.distance
      run.time = parsed.time
      run.geoJson = GeoJsonLoader.createGeoJson(run)
    }
    session.geoJson = GeoJsonLoader.createTeacherGeoJson(session)
    const beaconArray = session.beacons
    session.beacons = beaconArray.map(beacon => {
      return {
        id: beacon.id,
        coords: beacon.coords,
        success: DataLoader.getBeaconSuccess(session, beacon.id)
      }
    })
    res.send(session)
  } catch (error) {
    console.log(error)
  } finally {
    client.close()
  }
})
