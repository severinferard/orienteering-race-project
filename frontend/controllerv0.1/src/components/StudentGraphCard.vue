<template>
  <v-card height="100%" class="px-3 hud-overlay" color="#078e889c" outlined>
    <v-card-title class="py-0">
      <v-spacer></v-spacer>
      <v-row align="end">
          <span style="color: #fff; font-size: 25px" class="mandalore"
            >{{ title }}</span>
        <span style="color: #fff; font-size: 35px" class="mandalore mx-3">{{ value }}</span>
        <span style="color: #fff; font-size: 25px" class="mandalore">{{ unit }}</span>
      </v-row>
    </v-card-title>
    <v-row style="height: 200px">
      <v-col>
        <Plotly
          :data="plotData.data"
          :layout="plotData.layout"
          :display-mode-bar="false"
        ></Plotly>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { Plotly } from "vue-plotly";
export default {
  components: {
    Plotly,
  },
  props: ["icon", "title", "unit", "value", "values", "sampleRate", "beacons"],
  data() {
    return {};
  },
  mounted() {},
  computed: {
    plotData: function () {
      let ret = {
        data: [
          {
            y: [...this.values],
            x: [...Array(this.values.length).keys()].map(
              (s) => s * this.sampleRate
            ),
            // marker: {
            //   color: [...this.students]
            //     .sort((a, b) => b[this.studentTabPlotType] - a[this.studentTabPlotType])
            //     .map((std) => std.color),
            // },
            type: "scatter",
            line: { shape: "spline", color: "rgb(255, 255, 255)", width: 6 },
          },
        ],
        layout: {
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          height: 170,
          margin: {
            l: 50,
            r: 50,
            b: 40,
            t: 0,
            pad: 4,
          },
          xaxis: {
            tickangle: -45,
            visible: false,
            showgrid: false
          },
                 yaxis: {
            showgrid: false,
            visible: false,
          },
          shapes: [],
          annotations: [],
        },
      };
      console.log("beacons", this.beacons);
      this.beacons.forEach((beacon) => {
        if (beacon.valided) {
          ret.layout.shapes.push({
            type: "line",
            x0: beacon.time,
            y0: 0,
            x1: beacon.time,
            y1: Math.max(...this.values),
            text: "test",
            line: {
              color: "#2297F3",
              width: 6,
              dash: "dash"
            },
          });
          ret.layout.annotations.push({
            x: beacon.time,
            y: 0,
            xref: "x",
            yref: "paper",
            text: '<b>'+beacon.id+'</b>',
			showarrow: false,
			yanchor: 'top',
            font: {
              size: 28,
              weight: 15,
              color: "#2297F3",
            },
          });
        }
      });
      return ret;
    },
  },
};
</script>
<style>
	.hud-overlay {
		border-width: 3px !important;
		border-color: #6fe0dbad !important;
		}
</style>