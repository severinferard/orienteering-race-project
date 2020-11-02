<template>
  <div id="map"></div>
</template>

<script>
import L from "leaflet";
export default {
  data() {
    return {
      geojson: {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {"color": "green"},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            2.2013962268829346,
            48.83850563794739
          ],
          [
            2.20151424407959,
            48.83837146842246
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {"color": "blue"},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            2.2015410661697388,
            48.83835028372777
          ],
          [
            2.2017449140548706,
            48.83835028372777
          ]
        ]
      }
    }
  ]
},
    };
  },
  methods: {
    setupLeaflet() {
      let map = L.map("map").setView([48.838503, 2.200796], 16);

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
      L.geoJSON(this.geojson, {
          style: function(feature) {
              return {
                  color: feature.properties.color
                  }
          }
      }).addTo(map);
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
</style>