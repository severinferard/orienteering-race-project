<template>
<v-card height="100%">
                <v-card-title class="py-0">
                  <v-icon x-large color="primary lighten-1" class="mt-2">
                    {{icon}}
                  </v-icon>
                  <v-spacer></v-spacer>
                  <v-row align="end">
                    <span class="display-1 primary--text">{{
                      value
                    }}</span>
                    <span class="overline ml-1">{{unit}}</span>
                  </v-row>
                </v-card-title>
                <v-row style="height: 200px"
                  ><v-col>
                      <div v-if="$slots.graph">
                          <slot name=graph></slot>
                      </div>
                    </v-col
                ></v-row>
                <v-row
                  ><v-col>
                    <v-card-actions class="justify-center"
                      ><span class="overline">{{title}}</span></v-card-actions
                    ></v-col
                  ></v-row
                >
              </v-card>
</template>

<script>
export default {
    props: ["icon", "title", "unit", "value"]
}
</script>