<template>
  <v-main>
<v-app-bar color="primary" dark app style="z-index: 999999">
         <v-toolbar-title><router-link to="/">
            <h3 class="secondary--text text--lighten-1 font-weight-light px-4">DORA</h3>
          </router-link></v-toolbar-title>
                  <router-link to="/tree">
            <h4 class="secondary--text text--lighten-1 font-weight-light px-4">Dashboard</h4>
          </router-link>
          <span class="px-3">{{ schoolName }}</span>
          <v-icon >mdi-chevron-right</v-icon>
          <span class="px-3">{{ className }}</span>
          <v-icon >mdi-chevron-right</v-icon>
          <span class="px-3">{{ sessionName }}</span>
          

</v-app-bar>
    <v-alert v-if="loadingError" type="error">{{ loadingErrorStatus }}</v-alert>
    <v-card color="lime" class="map-wrapper mx-5 mt-5">
      <TeacherMap ref="myMap" :geoJson="geoJson" :center="mapCenter" :colors="colorMap"> </TeacherMap>
    </v-card>
    <div class="pt-0 pl-0 mx-5">
      <v-row>
        <v-col>
          <v-card>
            <v-toolbar dense color="">
              <v-toolbar-title class="mr-10">Balises</v-toolbar-title>
              <v-spacer></v-spacer>
              <div>
                <v-tabs v-model="beaconTab" align-with-title>
                  <v-tabs-slider></v-tabs-slider>
                  <v-tab key="plot">
                    <v-icon>mdi-chart-bar</v-icon>
                  </v-tab>
                  <v-tab key="table">
                    <v-icon>mdi-table</v-icon>
                  </v-tab>
                </v-tabs>
              </div>
            </v-toolbar>
            <v-tabs-items v-model="beaconTab">
              <v-tab-item key="table">
                <div style="height: 300px; overflow: scroll">
                  <Plotly
                    :data="beaconPlotData.data"
                    :layout="beaconPlotData.layout"
                    :display-mode-bar="false"
                  ></Plotly>
                </div>
              </v-tab-item>
              <v-tab-item key="plot">
                <v-data-table
                  :headers="beaconTableheader"
                  :items="beacons"
                  hide-default-footer
                  fixed-header
                  height="300px"
                >
                  <template v-slot:[`item.success`]="{ item }"> {{ item.success }}% </template>
                </v-data-table>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-toolbar dense color="">
              <v-toolbar-title class="mr-10">Éleves</v-toolbar-title>
              <v-spacer></v-spacer>
              <div>
                <v-tabs v-model="studentTab" align-with-title>
                  <v-tabs-slider></v-tabs-slider>
                  <v-tab key="plot">
                    <v-icon>mdi-chart-bar</v-icon>
                  </v-tab>
                  <v-tab key="table">
                    <v-icon>mdi-table</v-icon>
                  </v-tab>
                </v-tabs>
              </div>
            </v-toolbar>
            <v-tabs-items v-model="studentTab">
              <v-tab-item key="table">
                <div style="height: 500px; overflow: scroll">
                  <v-toolbar>
                    <v-row justify="center" align="center">
                      <v-col cols="7">
                        <div>
                          <v-tabs fixed-tabs>
                            <v-tab @click="studentTabPlotType = 'time'" v-model="studentTabPlotType" key="time"
                              >Chrono</v-tab
                            >
                            <v-tab @click="studentTabPlotType = 'avgSpeed'" v-model="studentTabPlotType" key="avgSpeed"
                              >Vitesse</v-tab
                            >
                            <v-tab @click="studentTabPlotType = 'distance'" v-model="studentTabPlotType" key="distance"
                              >Distance</v-tab
                            >
                            <v-tab @click="studentTabPlotType = 'beacons'" v-model="studentTabPlotType" key="beacons"
                              >Balises</v-tab
                            >
                          </v-tabs>
                        </div>
                      </v-col>
                    </v-row>
                  </v-toolbar>
                  <Plotly
                    :data="studentPlotData.data"
                    :layout="studentPlotData.layout"
                    :display-mode-bar="false"
                  ></Plotly>
                </div>
              </v-tab-item>
              <v-tab-item key="plot">
                <v-data-table
                  :headers="studentTableHeader"
                  :items="students"
                  hide-default-footer
                  fixed-header
                  height="500px"
                >
                <template v-slot:[`item.time`]="{item}">
                    {{Math.floor(item.time/60)}}:{{getMins(item.time)}}
                </template>
                </v-data-table>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-main>
</template>

<script>
import TeacherMap from "@/components/TeacherMap.vue";
import axios from "axios";
import { Plotly } from "vue-plotly";
import randomColor from "randomcolor";
export default {
  components: {
    TeacherMap,
    Plotly,
  },
  data() {
    return {
      test: 1,
      sessionId: this.$route.params.session_id,
      mapCenter: null,
      id: null,
      geoJson: null,
      schoolName: "",
      className: "",
      beacons: [],
      students: [],
      beaconPlotData: { data: null, layout: null },
      sessionName: "",
      loadingData: true,
      loadingError: false,
      loadingErrorStatus: null,
      colorMap: null,
      beaconTab: "plot",
      studentTab: "plot",
      studentTabPlotType: "time",
      beaconTableheader: [
        { text: "Balise ID", value: "id" },
        { text: "Succès", value: "success" },
      ],
      studentTableHeader: [
        { text: "ID", value: "id" },
        { text: "Chrono", value: "time" },
        { text: "Distance (m)", value: "distance" },
        { text: "Vitesse moyenne (km/h)", value: "avgSpeed" },
        { text: "Balises", value: "beacons" },
      ],
    };
  },
  computed: {
    studentPlotData: function () {
        let averageValue = [...this.students].reduce( ( p, c ) => p + parseFloat(c[this.studentTabPlotType]), 0 ) / this.students.length
      let ret = {
        data: [
          {
            x: [...this.students]
              .sort((a, b) => b[this.studentTabPlotType] - a[this.studentTabPlotType])
              .map((std) => std.id),
            y: [...this.students]
              .sort((a, b) => b[this.studentTabPlotType] - a[this.studentTabPlotType])
              .map((std) => std[this.studentTabPlotType]),
            marker: {
              color: [...this.students]
                .sort((a, b) => b[this.studentTabPlotType] - a[this.studentTabPlotType])
                .map((std) => std.color),
            },
            type: "bar",
          },
        ],
        layout: {
          height: 400,
          margin: {
            l: 50,
            r: 50,
            b: 40,
            t: 0,
            pad: 4,
          },
          xaxis: {
            tickangle: -45,
          },
          shapes: [{
        type: 'line',
        xref: 'paper',
        x0: 0,
        y0: averageValue,
        x1: 1,
        y1: averageValue,
        line:{
            color: '#ddd',
            width: 4,
            dash:'dot'
        }
    }],
    annotations: [{
            x: 1,
            y: averageValue,
            xref: "paper",
            yref: "y",
            text: 'Moyenne',
            showarrow: false,
            font: {
              size: 28,
              weight: 15,
              color: "#ddd",
            },
            yanchor:"bottom"
          }]
        },
      };
      console.log("average", averageValue)
      console.log([...this.students])
      return ret;
    },
  },
  methods: {
    getMins(chrono) {
      return chrono % 60 < 10 ? "0" + (chrono % 60) : chrono % 60;
    },
    createBeaconPlot() {
      this.beaconPlotData = {
        data: [
          {
            x: this.beacons.map((beacon) => beacon.id),
            y: this.beacons.map((beacon) => beacon.success),
            type: "bar",
          },
        ],
        layout: {
          height: 300,
          margin: {
            l: 50,
            r: 50,
            b: 40,
            t: 0,
            pad: 4,
          },
          xaxis: {tickmode:'linear'}
        },
      };
    },
    async loadData() {
      this.loadingData = true;
      try {
        const res = await axios.get(`/api/teacher/${this.$route.params.session_id}/`);
        const data = res.data;
        console.log('data', data)
        this.beacons = data.beacons;
        this.sessionName = data.session_name;
        this.className = data.class_name;
        this.schoolName = data.school_name;
        this.id = data.id;
        this.geoJson = data.geoJson;
        this.colorMap = new Map();
        data.runs.forEach((run) => {
          this.colorMap.set(
            run.id,
            randomColor({
              luminosity: "bright",
              hue: "random",
            })
          );
        });
        this.students = data.runs.map((run) => {
          return {
            id: run.id,
            time: run.time,
            distance: run.distance.toFixed(0),
            avgSpeed: run.avgSpeed.toFixed(1),
            beacons: run.beacons.filter((b) => b.valided).length,
            color: this.colorMap.get(run.id),
          };
        });
        this.mapCenter = data.beacons[0].coords;
        this.createBeaconPlot();
      } catch (error) {
        this.loadingError = true;
        this.loadingErrorStatus = error;
      }
      this.loadingData = false;
    },
  },
  created() {
    this.loadData();
  },
};
</script>