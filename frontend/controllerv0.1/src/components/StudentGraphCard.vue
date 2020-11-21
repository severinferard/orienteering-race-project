<template>
  <v-card height="100%">
    <v-card-title class="py-0">
      <v-spacer></v-spacer>
      <v-row align="end">
        <span class="display-1 primary--text">{{ value }}</span>
        <span class="overline ml-1">{{ unit }}</span>
      </v-row>
    </v-card-title>
    <v-row style="height: 200px">
      <v-col>
        <Plotly
          :data="studentPlotData.data"
          :layout="studentPlotData.layout"
          :display-mode-bar="false"
        ></Plotly>
        </v-col>
    </v-row>
    <v-row
      ><v-col>
        <v-card-actions class="justify-center"
          ><span class="overline">{{ title }}</span></v-card-actions
        ></v-col
      ></v-row
    >
  </v-card>
</template>

<script>
import { Plotly } from "vue-plotly";
export default {
  components: {
    Plotly,
  },
  props: ["icon", "title", "unit", "value"],
  data() {
    return {};
  },
  mounted() {},
};
</script>