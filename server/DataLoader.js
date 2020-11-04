const turfDistance = require('turf-distance');

class DataLoader {
    
static getGeoJsonPointsFromCoords(coords) {
    return coords.map((coord) => {
      return {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: coord,
        },
      };
    });
  }

  /**
   * @param {Array}  points Array of GeoJson points.
   * @return {Array} Array of speed for each point in points.
   */
  static getSpeedFromPoints(points, sampleRate) {
    return points.map((point, index) => {
      if (index === 0) return 0;
      return turfDistance(point, points[index - 1]) / (sampleRate / 60);
    });
  }

  static getDistanceFromPoints(points) {
    let dists =  points.map((point, index) => {
        if (index === 0) return 0;
        return turfDistance(point, points[index - 1]) * 1000;
      });
      return dists.reduce((a, b) => a + b);
  }

  static getAverageSpeed(speeds) {
    return speeds.reduce((a, b) => a + b) / speeds.length;
  }

  static getLastValidedBeacon(beacons) {
    if (beacons.filter((b) => b.valided).length === 0) return 0;
    return beacons.filter((b) => b.valided).sort((a, b) => a.time < b.time)[0];
  }

  static evaluateBeacons(points, beacons, beaconRange, speeds, sampleRate) {
    let mybeacons = beacons.map((b) => {
      return {
        id: b.id,
        valided: false,
        name: b.name,
        coords: b.coords,
        avgSpeed: null,
        time: null,
        lap: null,
      };
    });
    points.forEach((point, pi) => {
      mybeacons.forEach((beacon) => {
        if (
          !beacon.valided &&
          turfDistance(point, beacon.coords) * 1000 < beaconRange
        ) {
          let lastValided = DataLoader.getLastValidedBeacon(mybeacons);
          let _speeds = speeds.slice(
            lastValided.time / sampleRate - 1 || 0,
            pi + 1
          );
        //   console.log("_speed", _speeds);
          beacon.avgSpeed = _speeds.reduce((a, b) => a + b) / _speeds.length;
          beacon.valided = true;
          beacon.time = pi * sampleRate + 1;
          beacon.lap = beacon.time - lastValided.time || beacon.time;
        }
      });
    });
    return mybeacons;
  }

  static getTime(points, sampleRate) {
      return points.length / sampleRate
  }
}

module.exports = DataLoader



// let rawPositions = [
//     [ 48.83842089934189, 2.200108766555786 ],
//     [ 48.83841383778495, 2.2001677751541138 ],
//     [ 48.83841030700611, 2.2002536058425903 ],
//     [ 48.83841030700611, 2.200334072113037 ],
//     [ 48.83841383778495, 2.200414538383484 ],
//     [ 48.839224, 2.203405 ],
//     [ 48.83836087607625, 2.2005271911621094 ],
//     [ 48.83833262980869, 2.200586199760437 ],
//     [ 48.83832909902415, 2.200655937194824 ],
//     [ 48.83833616059302, 2.2007256746292114 ],
//     [ 48.83836087607625, 2.2007793188095093 ],
//     [ 48.838389122327854, 2.200811505317688 ],
//     [ 48.838435022452764, 2.2008275985717773 ],
//     [ 48.838480922535624, 2.2008436918258667 ],
//     [ 48.83852682257639, 2.200870513916015 ],
//     [ 48.83852682257639, 2.2009670734405518 ],
//     [ 48.838502107175046, 2.2010421752929688 ],
//     [ 48.83843855322985, 2.2010475397109985 ],
//     [ 48.838399714668114, 2.2010475397109985 ],
//     [ 48.838364406858574, 2.2011011838912964 ],
//     [ 48.83834322216088, 2.2011440992355347 ],
//     [ 48.8383149758834, 2.201181650161743 ],
//     [ 48.838300852738676, 2.2012192010879517 ],
//     [ 48.83828672958997, 2.2012460231781006 ],
//     [ 48.83826907564849, 2.2012674808502197 ],
//     [ 48.838247890910495, 2.201283574104309 ],
//     [ 48.83820199061414, 2.2012996673583984 ],
//     [ 48.838141967086166, 2.2012996673583984 ],
//     [ 48.83807135107883, 2.201310396194458 ],
//     [ 48.8380254506207, 2.2013050317764282 ],
//     [ 48.837976019311036, 2.201213836669922 ],
//     [ 48.83795836526004, 2.201138734817505 ],
//     [ 48.837951303637915, 2.201106548309326 ],
//     [ 48.837940711202826, 2.2010797262191772 ],
//     [ 48.837937180390654, 2.2010475397109985 ],
//     [ 48.837912464698356, 2.20101535320282 ],
//     [ 48.837838317548325, 2.200988531112671 ],
//     [ 48.837806540164735, 2.2009295225143433 ],
//     [ 48.837799478521184, 2.200886607170105 ],
//     [ 48.837799478521184, 2.2007793188095093 ],
//     [ 48.83783125590928, 2.200714945793152 ],
//     [ 48.837901872255074, 2.20074713230133 ],
//     [ 48.837940711202826, 2.200790047645569 ],
//     [ 48.837976019311036, 2.2008222341537476 ],
//     [ 48.838014858201284, 2.2007685899734497 ],
//     [ 48.83801838900801, 2.2006720304489136 ],
//     [ 48.83801838900801, 2.200607657432556 ],
//     [ 48.83801838900801, 2.200559377670288 ],
//     [ 48.83802191981448, 2.200521826744079 ],
//     [ 48.83802191981448, 2.2004735469818115 ],
//     [ 48.8380254506207, 2.200435996055603 ],
//     [ 48.8380254506207, 2.2003716230392456 ],
//     [ 48.83805722786541, 2.2003179788589478 ],
//     [ 48.83807135107883, 2.200285792350769 ],
//     [ 48.83807488188157, 2.200232148170471 ],
//     [ 48.83807841268404, 2.2001785039901733 ],
//     [ 48.83808194348629, 2.2001463174819946 ],
//     [ 48.83808194348629, 2.200108766555786 ],
//     [ 48.83808900509, 2.2000443935394287 ],
//     [ 48.83811725149493, 2.200033664703369 ],
//     [ 48.83815962107245, 2.2000175714492793 ],
//     [ 48.83819139823208, 2.20001220703125 ],
//     [ 48.83823376774687, 2.20001220703125 ],
//     [ 48.838258483280626, 2.2000497579574585 ],
//     [ 48.83829026037753, 2.2000926733016968 ],
//     [ 48.838318506668955, 2.2001248598098755 ],
//     [ 48.83835381451083, 2.2001034021377563 ]
//   ]
// let rawData = {id: "mov12", firmwareVersion: 0.1, data: rawPositions, sampleRate: 1}
// // console.log(rawPositions) 
// let beacons = [{"_id":"7fjhb33","id":1,"name":"","coords":[48.838426, 2.200067]},{"_id":"6fgcv8","id":2,"name":"","coords":[48.838352,2.203357]},{"_id":"fcj876hj","id":3,"name":"","coords":[48.839387,2.19841]},{"_id":"56gvjny7","id":4,"name":"","coords":[48.839224,2.203405]},{"_id":"45dfVU7","id":5,"name":"","coords":[48.837686,2.200015]},{"_id":"yg57n7","id":6,"name":"","coords":[48.837518,2.20278]},{"_id":"7Jgy57","id":7,"name":"","coords":[48.839373,2.200848]},{"_id":"dxfc4ug","id":8,"name":"","coords":[48.838423,2.198175]},{"_id":"(65guvbu8)","id":9,"name":"","coords":[48.838866,2.20234]}]
// let sampleRate = 1;
// let beaconRange = 10;
// let points = DataLoader.getGeoJsonPointsFromCoords(rawData.data);
// let speeds = DataLoader.getSpeedFromPoints(rawData.data, sampleRate);
// let avgSpeed = DataLoader.getAverageSpeed(speeds);
// let distance = DataLoader.getDistanceFromPoints(rawData.data);
// let checkedBeacons = DataLoader.evaluateBeacons(rawData.data, beacons, beaconRange, speeds, sampleRate);
// // console.log(dataLoader.checkedBeacons)

// let obj = {
//     id: rawData.id,
//     version: rawData.version,
//     sampleRate: rawData.sampleRate,
//     firmwareVersion: rawData.firmwareVersion,
//     beacons: checkedBeacons,
//     rawPositions: rawData.data,
//     speeds: speeds,
//     avgSpeed: avgSpeed,
//     distance: distance,
//     comment: "",
//     rating: null,
// }
// console.dir(points, { depth: null })
