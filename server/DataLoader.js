const turfDistance = require('turf-distance')

class DataLoader {
  static getGeoJsonPointsFromCoords (coords) {
    return coords.map((coord) => {
      return {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: coord
        }
      }
    })
  }

  static getSpeedFromPoints (points, sampleRate) {
    return points.map((point, index) => {
      if (index === 0) return 0
      return turfDistance(point, points[index - 1]) / (sampleRate / 3600)
    })
  }

  static getDistanceFromPoints (points) {
    const dists = points.map((point, index) => {
      if (index === 0) return 0
      return turfDistance(point, points[index - 1]) * 1000
	})
	if (!dists.length)
		return []
    return dists.reduce((a, b) => a + b)
  }

  static getAverageSpeed (speeds) {
	  if (!speeds.length)
	  	return -1;
    return speeds.reduce((a, b) => a + b) / speeds.length
  }

  static getLastValidedBeacon (beacons) {
    if (beacons.filter((b) => b.valided).length === 0) return 0
    return beacons.filter((b) => b.valided).sort((x, y) => x.time - y.time)[beacons.filter((b) => b.valided).length - 1]
  }

  static evaluateBeacons (points, beacons, beaconRange, speeds, sampleRate) {
    const mybeacons = beacons.map((b) => {
      return {
        id: b.id,
        valided: false,
        name: b.name,
        coords: b.coords,
        avgSpeed: null,
        time: null,
        lap: null
      }
    })
    points.forEach((point, pi) => {
      mybeacons.forEach((beacon) => {
        if (!beacon.valided && turfDistance(point, beacon.coords) * 1000 < beaconRange) {
          const lastValided = DataLoader.getLastValidedBeacon(mybeacons)
          const _speeds = speeds.slice(lastValided.time / sampleRate - 1 || 0, pi + 1)
          beacon.avgSpeed = _speeds.reduce((a, b) => a + b) / _speeds.length
          beacon.valided = true
          beacon.time = pi * sampleRate + 1
          beacon.lap = beacon.time - lastValided.time || beacon.time
        }
      })
    })
    return mybeacons
  }

  static getTime (points, sampleRate) {
    return points.length * sampleRate
  }

  static getBeaconSuccess (session, beaconID) {
    let count = 0
    session.runs.forEach((run) => {
      try {
        if (run.beacons.filter((beacon) => beacon.id === beaconID)[0].valided) {
          count++
        }
      } catch (error) {}
    })
    return (count / session.runs.length) * 100
  }
}

module.exports = DataLoader
