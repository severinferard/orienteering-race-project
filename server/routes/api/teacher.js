const express = require('express')
const mongodb = require('mongodb')
const GeoJsonLoader = require('../../GeoJsonLoader')
const DataLoader = require('../../DataLoader')

const router = express.Router()
module.exports = router

router.get('/:session_id', async (req, res) => {
  const client = await mongodb.MongoClient.connect('mongodb+srv://dbUser:dbUserPassword@cluster0.fr7ka.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  try {
    const sessions = client.db('orienteering-race-project').collection('sessions')
    const session = (await sessions.find({ sessionId: req.params.session_id }).toArray())[0]
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
