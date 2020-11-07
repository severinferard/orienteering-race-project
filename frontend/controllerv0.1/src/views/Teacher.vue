<template>
  <v-main>
    <v-app-bar color="blue" dark>
      <v-toolbar-title>
        <router-link :to="`/session/${sessionId}`" class="text-decoration-none" style="color: inherit">
          <v-icon large>mdi-chevron-left</v-icon>
          {{ sessionName }}
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <span class="px-3">{{ id }}</span>
      <v-progress-linear
        :active="loadingData"
        :indeterminate="loadingData"
        absolute
        bottom
        color="blue darken-4"
      ></v-progress-linear>
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
                      <v-col cols="4">
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
        },
      };
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
        },
      };
    },
    createStudentPlot() {
      this.studentPlotData = {
        data: [
          {
            x: this.students.map((std) => std.id),
            y: this.students.map((std) => std.time),
            name: "Chrono",
            type: "bar",
          },
        ],
        layout: {
          height: 600,
          margin: {
            l: 50,
            r: 50,
            b: 40,
            t: 0,
            pad: 4,
          },
        },
      };
    },
    async loadData() {
      this.loadingData = true;
      try {
        const res = await axios.get(`/api/teacher/${this.$route.params.session_id}/`);
        const data = res.data;
        this.beacons = data.beacons;
        this.sessionName = data.sessionName;
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