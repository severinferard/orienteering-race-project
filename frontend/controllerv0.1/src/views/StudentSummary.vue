<template>
    <v-main>
        <v-app-bar color="blue" dark>
      <v-toolbar-title>
        <router-link :to="`/schools/${school.id}/classes`" class="text-decoration-none" style="color: inherit">
            <span class="px-3">{{ school.name }}</span>
            <v-icon large>mdi-chevron-right</v-icon>
        </router-link>
        <router-link :to="`/schools/${school.id}/classes/${clss.id}/sessions`" class="text-decoration-none" style="color: inherit">
            <span class="px-3">{{ clss.name }}</span>
            <v-icon large>mdi-chevron-right</v-icon>
        </router-link>
        <router-link :to="`#`" class="text-decoration-none" style="color: inherit">
            <span class="px-3">{{ id }}</span>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-progress-linear
        :active="loadingData"
        :indeterminate="loadingData"
        absolute
        bottom
        color="blue darken-4"
      ></v-progress-linear> -->
    </v-app-bar>
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
            <v-tab-item key="table" style="height: 100%">
            <div style="overflow: scroll">
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
                        <v-tab @click="studentTabPlotType = 'beaconsSuccess'" v-model="studentTabPlotType" key="beaconsSuccess"
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
            <v-tab-item key="plot" style="height: 100%">
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
			<template v-slot:[`item.distance`]="{item}">
				{{item.distance.toFixed(1)}}
			</template>
			<template v-slot:[`item.avgSpeed`]="{item}">
				{{item.avgSpeed.toFixed(1)}}
			</template>
			<template v-slot:[`item.beaconsSuccess`]="{item}">
				{{item.beaconsSuccess.toFixed(1)}}
			</template>
            </v-data-table>
            </v-tab-item>
        </v-tabs-items>
        </v-card>
    </v-main>
</template>

<script>
import axios from 'axios'
import { Plotly } from "vue-plotly";
// import randomColor from "randomcolor";
export default {
    components: {
        Plotly,
        // randomColor
    },
    data() {
        return {
            students: [],
            school: {name: "", id: "", date: ""},
            clss: {name :"", id: ""},
            id: this.$route.params.student_id,
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
                { text: "Balises", value: "beaconsSuccess" },
            ],
        }
    },
    methods: {
         getMins(chrono) {
      return chrono % 60 < 10 ? "0" + (chrono % 60) : chrono % 60;
    },
        async loadData() {
      this.loadingData = true;
      try {
        const res = await axios.get(
          `/api/student-summary/${this.$route.params.class_id}/${this.$route.params.student_id}`
        );
        const data = res.data;
        console.log("data", data);
        this.school.name = data.school_name
        console.log(this.school.name)
        this.school.id = data.school_id
        this.clss.id = data.class_id
        this.clss.name = data.class_name

		this.students = data.runs.filter(run => !!run);
        console.log("this.students", this.students)
      } catch (error) {
          console.log(error)
        this.loadingError = true;
        this.loadingErrorStatus = error;
      }
      this.loadingData = false;
    },

    },created() {
        this.loadData()
    },
          computed: {
    studentPlotData: function () {
		console.log(this.studentTabPlotType)
		this.students.forEach(run => console.log("run", run[this.studentTabPlotType]))
        let averageValue = [...this.students].reduce( ( p, c ) => p + parseFloat(c[this.studentTabPlotType]), 0 ) / this.students.length
      let ret = {
        data: [
          {
            x: [...this.students.map(run =>run.session.name)],
            y: [...this.students.map(run => run[this.studentTabPlotType])],
            marker: {
              color: "blue"
            },
            type: "scatter",
          },
        ],
        layout: {
        //    height: 400,
          margin: {
            l: 50,
            r: 50,
            b: 40,
            t: 0,
            pad: 4,
          },
          xaxis: {
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
}
</script>