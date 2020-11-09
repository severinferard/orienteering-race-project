<template>
  <div id="map"></div>
</template>

<script>
import "leaflet/dist/leaflet.css";
var Rainbow = require("rainbowvis.js");
import L from "leaflet";
export default {
  props: ["geoJson", "center"],
  data() {
    return {
      map: null,
    };
  },
  watch: {
    geoJson: function (newval) {
      this.addGeoJson(newval);
    },
    center: function(newval) {
      console.log('center', newval)
      this.map.setView([newval[1], newval[0]], 16)
    }
  },
  methods: {
    setupLeaflet() {
      let map = L.map("map");
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      document.on;
      map.scrollWheelZoom.disable();
      map.on("focus", () => {
        map.scrollWheelZoom.enable();
      });
      map.on("blur", () => {
        map.scrollWheelZoom.disable();
      });

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
      });

      L.geoJSON(this.geojson).addTo(map);
      this.map = map;
    },
    addGeoJson(geojson) {
      let iconValided = L.divIcon({
        className: "custom-div-icon",
        html:
          "<div class='marker-pin-valided'></div><i class='material-icons'>checkbox-marked</i>",
        iconSize: [30, 42],
        iconAnchor: [15, 42],
      });

      let iconNotValided = L.divIcon({
        className: "custom-div-icon",
        html:
          "<div class='marker-pin-not-valided'></div><i class='material-icons'>close-box</i>",
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
      });

      let rainbowvis = new Rainbow();
      rainbowvis.setNumberRange(0, 10);
      rainbowvis.setSpectrum("red", "orange", "green");
      L.geoJSON(geojson, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, { icon: iconValided });
        },
        filter: function (feature, layer) {
          console.log(feature.properties.valided, layer);
          return feature.properties.valided;
        },
      }).addTo(this.map);
      L.geoJSON(geojson, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, { icon: iconNotValided });
        },
        filter: function (feature) {
          return (
            feature.geometry.type === "Point" && !feature.properties.valided
          );
        },
      }).addTo(this.map);
      L.geoJSON(geojson, {
        style: function (feature) {
          return {
            color: "#" + rainbowvis.colorAt(feature.properties.speed),
            weight: 5,
          };
        },
        filter: function (feature) {
          return (
            feature.geometry.type === "LineString" &&
            !feature.properties.valided
          );
        },
      }).addTo(this.map);
    },
  },
  mounted() {
    this.setupLeaflet();
  },
};
</script>
<style>
#map {
  height: 100%;
}
.marker-pin-valided {
  width: 30px;
  height: 30px;
  border-radius: 50% 50% 50% 0;
  background: rgb(76, 167, 58);
  position: absolute;
  transform: rotate(-45deg);
  left: 50%;
  top: 50%;
  margin: -15px 0 0 -15px;
}

.leaflet-marker-icon .material-icons {
  color: white !important;
  font-weight: bold;
}

.marker-pin-valided::after {
  content: "";
  width: 24px;
  height: 24px;
  margin: 3px 0 0 3px;
  background: rgb(92, 204, 70);
  position: absolute;
  border-radius: 50%;
  color: white !important;
}

.marker-pin-not-valided {
  width: 30px;
  height: 30px;
  border-radius: 50% 50% 50% 0;
  background: rgb(179, 25, 25);
  position: absolute;
  transform: rotate(-45deg);
  left: 50%;
  top: 50%;
  margin: -15px 0 0 -15px;
}
.marker-pin-not-valided::after {
  content: "";
  width: 24px;
  height: 24px;
  margin: 3px 0 0 3px;
  background: rgb(206, 29, 29);
  position: absolute;
  border-radius: 50%;
  color: white !important;
}

.custom-div-icon i {
  position: absolute;
  width: 22px;
  font-size: 22px;
  left: 0;
  right: 0;
  margin: 10px auto;
  text-align: center;
}

.custom-div-icon i.awesome {
  margin: 12px auto;
  font-size: 17px;
}
</style>