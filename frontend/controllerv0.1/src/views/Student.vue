<template>
  <v-main>
    <v-app-bar color="blue" dark>
      <v-icon large>mdi-chevron-left</v-icon>
      <v-toolbar-title
        ><span>{{ sessionName }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <span class="px-3">{{ "MOV12" }}</span>
    </v-app-bar>
    <v-card color="lime" class="map-wrapper mx-5 mt-5">
      <MyMap ref="myMap"> </MyMap>
    </v-card>
    <div class="pt-0 pl-0 mx-5">
      <v-row height="300px">
        <v-col cols="6">
          <v-row style="height: 100%">
            <v-col cols="4">
              <v-card height="100%">
                <v-card-title class="py-0">
                  <v-icon x-large color="primary" class="mt-2"
                    >mdi-timer</v-icon
                  >
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
                            <v-col class="pa-0"
                              ><span class="display-2">7</span>
                              <span class="display-1">:</span>
                              <span class="display-2">48</span></v-col
                            >
                          </v-row>
                          <v-row>
                            <v-col class="pa-0 text-center">min</v-col>
                          </v-row>
                        </v-container>
                      </v-progress-circular>
                    </v-card-actions></v-col
                  >
                </v-row>
                <v-row
                  ><v-col>
                    <v-card-actions class="justify-center"
                      ><span class="overline">Chrono</span></v-card-actions
                    ></v-col
                  ></v-row
                >
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card height="100%">
                <v-card-title class="py-0">
                  <v-icon x-large color="primary lighten-1" class="mt-2"
                    >mdi-shoe-print</v-icon
                  ></v-card-title
                >

                <v-row style="height: 200px"
                  ><v-col
                    ><v-card-actions class="justify-center">
                      <v-progress-circular
                        :rotate="360"
                        :size="150"
                        :width="5"
                        :value="86"
                        color="primary lighten-1"
                      >
                        <v-container fluid class="pt-7">
                          <v-row>
                            <v-col class="pa-0"
                              ><span class="display-2">1207</span>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col class="pa-0 text-center">m</v-col>
                          </v-row>
                        </v-container>
                      </v-progress-circular>
                    </v-card-actions></v-col
                  ></v-row
                >
                <v-row
                  ><v-col>
                    <v-card-actions class="justify-center"
                      ><span class="overline">Distance</span></v-card-actions
                    ></v-col
                  ></v-row
                >
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card height="100%">
                <v-card-title class="py-0">
                  <v-icon x-large color="primary lighten-2" class="mt-2">
                    mdi-crosshairs-gps
                  </v-icon>
                </v-card-title>
                <v-row style="height: 200px"
                  ><v-col
                    ><v-card-actions class="justify-center">
                      <v-progress-circular
                        :rotate="360"
                        :size="150"
                        :width="5"
                        :value="100"
                        color="primary lighten-2"
                      >
                        <v-container fluid class="pt-7">
                          <v-row>
                            <v-col class="pa-0"
                              ><span class="display-2">16</span>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col class="pa-0 text-center">-</v-col>
                          </v-row>
                        </v-container>
                      </v-progress-circular>
                    </v-card-actions></v-col
                  ></v-row>
                <v-row
                  ><v-col>
                    <v-card-actions class="justify-center"
                      ><span class="overline">Balises</span></v-card-actions
                    ></v-col
                  ></v-row
                >
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-row style="height: 100%">
            <v-col>
              <v-card height="100%">
                <v-card-title class="py-0">
                  <v-icon x-large color="primary lighten-1" class="mt-2">
                    mdi-speedometer
                  </v-icon>
                  <v-spacer></v-spacer>
                  <v-row align="end">
                    <span class="display-1 primary--text">3.6</span>
                    <span class="overline ml-1">km/h</span>
                  </v-row>
                </v-card-title>
                <v-row style="height: 200px"
                  ><v-col>
                    <v-sheet>
                      <v-sparkline
                        :smooth="16"
                        :gradient="['#ffd200', '#1feaea', '#f72047']"
                        :line-width="3"
                        :value="heartbeats"
                        auto-draw
                        stroke-linecap="round"
                      ></v-sparkline> </v-sheet></v-col
                ></v-row>
                <v-row
                  ><v-col>
                    <v-card-actions class="justify-center"
                      ><span class="overline">Vitesse</span></v-card-actions
                    ></v-col
                  ></v-row
                >
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row
        ><v-col
          ><v-card>
            <v-data-table
              :headers="headers"
              :items="balises"
              hide-default-footer
              fixed-header
              height="300px"
            >
              <template v-slot:[`item.valided`]="{ item }">
                <v-icon :color="item.valided ? 'green' : 'red'">{{
                  item.valided ? "mdi-checkbox-marked" : "mdi-close-box"
                }}</v-icon>
              </template>
            </v-data-table></v-card
          ></v-col
        ></v-row
      >
      <v-row>
        <v-card class="ma-3" width="100%">
          <v-container>
            <v-row
              ><v-col cols="5">
                <v-textarea
                  rows="1"
                  prepend-icon="mdi-comment"
                  auto-grow
                  row-height="15"
                  label="Mon ressenti sur ma course..."
                  v-model="comment"
                >
                </v-textarea>
              </v-col>
              <v-col></v-col>
              <v-col cols="5" class="text-center">
                <v-rating
                  v-model="rating"
                  background-color="primary lighten-3"
                  color="primary"
                  large
                ></v-rating>
              </v-col>
            </v-row>
            <v-card-actions class="justify-center"
              ><v-btn>Valider</v-btn></v-card-actions
            >
          </v-container>
        </v-card>
      </v-row>
    </div>
  </v-main>
</template>

<script>
import MyMap from "@/components/MyMap.vue";
export default {
  components: {
    MyMap,
  },
  data() {
    return {
      heartbeats: Array.from({ length: 20 }, this.heartbeat),
      sessionName: "Session 1",
      rating: 0,
      comment: "",
      headers: [
        {
          text: "Balise",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Temps (s)", value: "time" },
        { text: "Vitesse (km/h)", value: "speed" },
        { text: "Validée", value: "valided" },
      ],
      balises: [
        { name: "Balise 1", time: 164, speed: 3.5, valided: true },
        { name: "Balise 1", time: 164, speed: 3.5, valided: true },
        { name: "Balise 1", time: 164, speed: 3.5, valided: true },
        { name: "Balise 1", time: 164, speed: 3.5, valided: false },
        { name: "Balise 1", time: 164, speed: 3.5, valided: true },
        { name: "Balise 1", time: 164, speed: 3.5, valided: true },
        { name: "Balise 1", time: 164, speed: 3.5, valided: false },
        { name: "Balise 1", time: 164, speed: 3.5, valided: true },
        { name: "Balise 1", time: 164, speed: 3.5, valided: true },
        { name: "Balise 1", time: 164, speed: 3.5, valided: true },
      ],
    };
  },
  methods: {
    heartbeat() {
      return Math.ceil(Math.random() * (120 - 80) + 80);
    },
  },
};
</script>

<style lang="css">
.map-wrapper {
  height: 80%;
}
</style>
