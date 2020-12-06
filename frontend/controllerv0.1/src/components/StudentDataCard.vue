<template>
  <v-card height="100%" class="px-3" color="rgba(0,199,200, 0.3)">
    <v-row style="height: 200px">
      <v-col
        ><v-card-actions class="justify-center">
          <v-progress-circular
            :rotate="360"
            :size="150"
            :width="10"
            :value="percent"
            color="blue"
          >
            <v-container fluid class="pt-7" style="color: #fff">
              <v-row justify="center" align="center">
                <div v-if="$slots.value">
                  <slot name="value"></slot>
                </div>
                <span v-else style="font-size: 70px" class="mandalore">{{
                  value
                }}</span>
              </v-row>
            </v-container>
          </v-progress-circular>
          <div style="position: absolute">
            <v-progress-circular
              :rotate="20"
              :size="166"
              :width="8"
              :value="percent"
              color="#fff"
            ></v-progress-circular>
          </div>
          <div style="position: absolute">
            <v-progress-circular
              :rotate="300"
              :size="130"
              :width="4"
              indeterminate
              :value="67"
              color="#ff9900"
            ></v-progress-circular>
          </div> </v-card-actions
      ></v-col>
    </v-row>
    <v-row
      ><v-col>
        <v-card-actions class="justify-center"
          ><span style="color: #fff; font-size: 25px" class="mandalore"
            >{{ title }} {{ unit ? '(' + unit + ')' : "" }}</span
          ></v-card-actions
        ></v-col
      ></v-row
    >
  </v-card>
</template>

<script>
export default {
  props: ["title", "value", "icon", "unit", "percent"],
  data() {
    return {};
  },
};
</script>

<style>
.mandalore {
  font-family: "Mandalore" !important;
}
.lala {
  color: #ff9900;
}
.v-progress-circular--indeterminate .v-progress-circular__overlay {
  animation-duration: 3.4s !important;
}
</style>