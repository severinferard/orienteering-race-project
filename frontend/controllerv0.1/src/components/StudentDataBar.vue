<template>
  <v-card class="hud-overlay pt-3 px-4" width="100%" color="#078e889c" outlined>
    <v-row justify="center" align="center">
      <v-col v-if="left" cols="2" class="pt-0 mt-0"
        ><span style="color: #fff; font-size: 30px" class="mandalore">{{
          title
        }}</span></v-col
      >
      <v-col cols="10" class="pt-0 mt-0">
        <v-progress-linear
          height="30px"
          :color="color"
          :value="percent"
          width="200px"
          rounded
        >
          <template v-slot:default>
            <strong class="mandalore" style="font-size: 40px; color: #fff">{{
              value
            }}</strong>
          </template>
        </v-progress-linear></v-col
      >
      <v-col v-if="!left" cols="2" style="text-align: end" class="pt-0 mt-0"
        ><span style="color: #fff; font-size: 30px" class="mandalore">{{
          title
        }}</span></v-col
      >
    </v-row>
    <!-- <v-row justify="center" align="center">
      
      <v-col cols="10">
        <v-progress-linear
          class="mt-0"
          height="30px"
          color="#ff9900"
          value="15"
          width="200px"
        >
          <template v-slot:default>
            <strong class="mandalore" style="font-size: 40px; color: #fff"
              >12:04</strong
            >
          </template>
        </v-progress-linear></v-col
      >
      <v-col cols="2" style="text-align: end"><span style="color: #fff; font-size:30px;" class="mandalore">Chrono</span></v-col>
    </v-row> -->
  </v-card>
</template>

<script>
export default {
  props: ["title", "value", "percent", "color", "left"],
};
</script>