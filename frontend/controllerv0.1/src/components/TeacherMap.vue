<template>
  <div id="map"></div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
export default {
  props: ["geoJson", "center", "colors"],
  data() {
    return {
      map: null,
    };
  },
  watch: {
    geoJson: function (newval) {
      this.addGeoJson(newval);
    },
    center: function (newval) {
      console.log("center", newval);
      this.map.setView([newval[1], newval[0]], 16);
    },
  },
  methods: {
    setupLeaflet() {
      let map = L.map("map");
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
    customeIcon(id) {
      return L.divIcon({
        className: "custom-div-icon",
        html: `<div class='marker-pin'></div><span class='id'>${id}</span>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
      });
    },
    addGeoJson(geojson) {
      console.log("addgeoJson", geojson);
      L.geoJSON(geojson, {
        style: (feature) => {
          return { color: this.colors.get(feature.properties.id), weight: 5 };
        },
        filter: function (feature) {
          return feature.geometry.type === "LineString";
        },
        onEachFeature: (feature, layer) => {
          layer.bindPopup(feature.properties.id);
        },
      }).addTo(this.map);
      L.geoJSON(geojson, {
        pointToLayer: (feature, latlng) => {
          return L.marker(latlng, { icon: this.customeIcon(feature.properties.id) });
        },
        filter: function (feature) {
          return feature.geometry.type === "Point";
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

.leaflet-marker-icon .id {
  color: white !important;
  font-weight: thin;
}

.marker-pin{
  width: 30px;
  height: 30px;
  border-radius: 50% 50% 50% 0;
  background: rgb(31, 89, 165);
  position: absolute;
  transform: rotate(-45deg);
  left: 50%;
  top: 50%;
  margin: -15px 0 0 -15px;
}
.marker-pin::after {
  content: "";
  width: 24px;
  height: 24px;
  margin: 3px 0 0 3px;
  background: rgb(42, 118, 218);
  position: absolute;
  border-radius: 50%;
  color: white !important;
}

.custom-div-icon .id {
  position: absolute;
  width: 22px;
  font-size: 22px;
  left: 0;
  right: 0;
  margin: 5px auto;
  text-align: center;
}

</style>