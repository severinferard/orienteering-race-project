<template>
  <div id="container">
    <div id="map"></div>
    <div class="ui-overlay" id="left-meter">
      <v-card flat color="transparent" width="100%">
        <StudentDataCard :value="distance" :percent="(distance / bestDistance) * 100" title="Distance" unit="m"></StudentDataCard>
      </v-card>
    </div>
    <div class="ui-overlay" id="right-meter">
      <v-card flat color="transparent" width="100%">
        <StudentDataCard :value="formatedChrono" :percent="(bestChrono / chrono) * 100" title="Chrono" :unit="null"></StudentDataCard>
      </v-card>
    </div>
    <div class="ui-overlay" id="bar">
      <v-row justify="center">
        <div style="width: 80%; height: 50px">
          <StudentDataBar
            title="Balises"
            :value="beacons.filter((b) => b.valided).length"
            color="#ff9900"
            :percent="(beacons.filter((b) => b.valided).length / beacons.length) * 100"
            :left="true"
          ></StudentDataBar>
        </div>
      </v-row>
    </div>
    <div class="ui-overlay" id="graph">
      <StudentGraphCard
        title="Vitesse"
        unit="km/h"
        :value="averageSpeed"
        icon="mdi-speedometer"
        :values="this.speeds"
        :sampleRate="this.sampleRate"
        :beacons="this.beacons"
      >
      </StudentGraphCard>
    </div>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import axios from "axios";
var Rainbow = require("rainbowvis.js");
import L from "leaflet";
import StudentDataCard from "@/components/StudentDataCard.vue";
import StudentDataBar from "@/components/StudentDataBar.vue";
import StudentGraphCard from "@/components/StudentGraphCard.vue";

export default {
  components: {
    StudentDataCard,
    StudentDataBar,
    StudentGraphCard,
  },
  props: ["center"],
  data() {
    return {
      map: null,
      averageSpeed: 0,
      distance: 0,
      bestDistance: 0,
      chrono: 0,
      bestChrono: 0,
      speeds: [],
      beacons: [],
      mapCenter: [],
      sampleRate: 0,
    };
  },
  methods: {
    setupLeaflet() {
      let map = L.map("map");
      //L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      L.tileLayer("http://dora:5000/atlas/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        maxNativeZoom: 15,
      }).addTo(map);
      document.on;
      map.scrollWheelZoom.disable();
      map.on("focus", () => {
        map.scrollWheelZoom.enable();
      });
      map.on("blur", () => {
        map.scrollWheelZoom.disable();
      });
      map.on("zoom", () => {
        console.log("zoom");
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
        html: "<div class='marker-pin-valided'></div><i class='material-icons'>checkbox-marked</i>",
        iconSize: [30, 42],
        iconAnchor: [15, 42],
      });

      let iconNotValided = L.divIcon({
        className: "custom-div-icon",
        html: "<div class='marker-pin-not-valided'></div><i class='material-icons'>close-box</i>",
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
      });

      //       let iconNotValided = L.icon({
      //     iconUrl: image,

      //     iconSize:     [38, 95], // size of the icon
      //     shadowSize:   [50, 64], // size of the shadow
      //     iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      //     shadowAnchor: [4, 62],  // the same for the shadow
      //     popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
      // });

      let rainbowvis = new Rainbow();
      rainbowvis.setNumberRange(0, 10);
      rainbowvis.setSpectrum("red", "orange", "green");
      L.geoJSON(geojson, {
        pointToLayer: function(feature, latlng) {
          return L.marker(latlng, { icon: iconValided });
        },
        filter: function(feature, layer) {
          console.log(feature.properties.valided, layer);
          return feature.properties.valided;
        },
      }).addTo(this.map);
      L.geoJSON(geojson, {
        pointToLayer: function(feature, latlng) {
          return L.marker(latlng, { icon: iconNotValided });
        },
        filter: function(feature) {
          return feature.geometry.type === "Point" && !feature.properties.valided;
        },
      }).addTo(this.map);
      L.geoJSON(geojson, {
        style: function(feature) {
          return {
            color: "#" + rainbowvis.colorAt(feature.properties.speed),
            weight: 5,
          };
        },
        filter: function(feature) {
          return feature.geometry.type === "LineString" && !feature.properties.valided;
        },
      }).addTo(this.map);
    },
    async loadData() {
      this.loadingData = true;
      try {
        const res = await axios.get(`/api/runs/${this.$route.params.session_id}/${this.$route.params.student_id}`);
        const data = res.data;
        console.log("data", data);
        this.beacons = data.beacons;
        this.id = data.id;
        this.chrono = data.time;
        this.sampleRate = data.sampleRate;
        this.bestChrono = data.bestTime;
        console.log((this.bestChrono / this.chrono) * 100);
        this.averageSpeed = data.avgSpeed.toFixed(1);
        this.distance = data.distance.toFixed();
        this.bestDistance = data.bestDistance.toFixed();
        this.speeds = data.speeds;
        this.geoJson = data.geoJson;
        this.mapCenter = data.beacons[0].coords;
        this.addGeoJson(this.geoJson);
        this.map.setView([this.mapCenter[1], this.mapCenter[0]], 16);
      } catch (error) {
        console.log(error);
      }
      this.loadingData = false;
    },
  },
  computed: {
    formatedChrono() {
      return (
        (this.chrono < 60 ? "0" : (this.chrono / 60).toFixed()) +
        ":" +
        ((this.chrono % 60).toFixed() < 10 ? "0" : "") +
        (this.chrono % 60).toFixed()
      );
    },
  },
  created() {
    this.loadData();
  },
  mounted() {
    this.setupLeaflet();
  },
};
</script>
<style>
#container {
  width: 100%;
  height: 100%;
  position: relative;
  text-align: center;
  /* background: rgb(4, 217, 255) */
}

.ui-overlay {
  position: absolute;
  z-index: 999;
}

#left-meter {
  top: 40px;
  left: 40px;
  height: 0;
}

#right-meter {
  top: 40px;
  right: 40px;
  height: 0;
}

#bar {
  bottom: 75px;
  width: 100%;
}

#graph {
  height: 210px;
  top: 40px;
  width: 800px;
  left: 50%;
  transform: translateX(-50%);
}

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

/* .marker-pin-valided::after {
  content: "";
  width: 24px;
  height: 24px;
  margin: 3px 0 0 3px;
  background: rgb(92, 204, 70);
  position: absolute;
  border-radius: 50%;
  color: white !important;
} */

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
/* .marker-pin-not-valided::after {
  content: "";
  width: 24px;
  height: 24px;
  margin: 3px 0 0 3px;
  background: rgb(206, 29, 29);
  position: absolute;
  border-radius: 50%;
  color: white !important;
} */

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
