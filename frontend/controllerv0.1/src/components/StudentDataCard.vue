<template>
  <v-card height="100%">
    <v-card-title class="py-0">
      <v-icon x-large color="primary" class="mt-2">{{ icon }}</v-icon>
    </v-card-title>
    <v-row style="height: 200px">
      <v-col
        ><v-card-actions class="justify-center">
          <v-progress-circular
            :rotate="360"
            :size="150"
            :width="5"
            :value="70"
            color="primary"
          >
            <v-container fluid class="pt-7">
              <v-row>
                <v-col class="pa-0">
                  <div v-if="$slots.value">
                    <slot name="value"></slot>
                  </div>
                  <span v-else class="display-2">{{ value }}</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pa-0 text-center">{{ unit }}</v-col>
              </v-row>
            </v-container>
          </v-progress-circular>
        </v-card-actions></v-col
      >
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
export default {
  props: ["title", "value", "icon", "unit"],
  data() {
    return {};
  },
};
</script>