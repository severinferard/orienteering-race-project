<template>
  <v-main>
    <v-app-bar color="blue" dark>
      <v-toolbar-title>
        <router-link
          :to="`/session/${sessionId}`"
          class="text-decoration-none"
          style="color: inherit"
        >
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
                              ><span class="display-2">{{
                                Math.floor(chrono / 60)
                              }}</span>
                              <span class="display-1">:</span>
                              <span class="display-2">{{
                                chrono % 60
                              }}</span></v-col
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
                              ><span class="display-2">{{ distance }}</span>
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
                        :value="percentBeacons"
                        color="primary lighten-2"
                      >
                        <v-container fluid class="pt-7">
                          <v-row>
                            <v-col class="pa-0"
                              ><span class="display-2">{{
                                validedBeacons
                              }}</span>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col class="pa-0 text-center">-</v-col>
                          </v-row>
                        </v-container>
                      </v-progress-circular>
                    </v-card-actions></v-col
                  ></v-row
                >
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
                    <span class="display-1 primary--text">{{
                      averageSpeed
                    }}</span>
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
            <v-row>
              <v-col cols="5">
                <v-form ref="form" v-model="valid">
                  <v-textarea
                    rows="1"
                    prepend-icon="mdi-comment"
                    auto-grow
                    row-height="15"
                    label="Mon ressenti sur ma course..."
                    v-model="comment"
                    :rules="[
                      (v) => v.length > 0 || 'Un commentaire est requis',
                    ]"
                  >
                  </v-textarea>
                </v-form>
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
              ><v-btn :disabled="!valid" @click="sendForm"
                >Valider</v-btn
              ></v-card-actions
            >
          </v-container>
        </v-card>
      </v-row>
    </div>
    <v-snackbar v-model="snackbar" color="success">
      <span class="overline font-weight-black">Enregistré !</span>

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Fermer
        </v-btn>
      </template>
    </v-snackbar>
  </v-main>
</template>

<script>
import axios from "axios";
import MyMap from "@/components/MyMap.vue";
export default {
  components: {
    MyMap,
  },
  data() {
    return {
      heartbeats: Array.from({ length: 20 }, this.heartbeat),
      id: "",
      sessionName: "",
      sessionId: this.$route.params.session_id,
      averageSpeed: 0,
      distance: 0,
      chrono: 0,
      rating: 0,
      comment: "",
      headers: [
        { text: "ID", value: "id" },
        { text: "Temps (s)", value: "time" },
        { text: "Vitesse (km/h)", value: "avgSpeed" },
        { text: "Validée", value: "valided" },
      ],
      balises: [],
      loadingData: false,
      loadingError: false,
      loadingErrorStatus: "",
      valid: false,
      snackbar: false,
    };
  },
  computed: {
    validedBeacons() {
      return this.balises.filter((b) => b.valided).length;
    },
    percentBeacons() {
      if (!this.balises.length) return 0;
      return (this.validedBeacons / this.balises.length) * 100;
    },
  },
  methods: {
    heartbeat() {
      return Math.ceil(Math.random() * (120 - 80) + 80);
    },
    async loadData() {
      this.loadingData = true;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/runs/${this.$route.params.session_id}/${this.$route.params.student_id}`
        );
        const data = res.data;
        this.sessionName = data.sessionName;
        this.id = data.id;
        this.balises = data.beacons.map((beacon) => {
          if (beacon.valided) return beacon;
          (beacon.time = "-"), (beacon.avgSpeed = "-");
          return beacon;
        });
        this.chrono = data.time;
        this.averageSpeed = data.avgSpeed;
        this.distance = data.distance;
        this.comment = data.comment;
        this.rating = data.rating;
      } catch (error) {
        this.loadingError = true;
        this.loadingErrorStatus = error;
      }
      this.loadingData = false;
    },
    async sendForm() {
      console.log("send");
      try {
        await axios.post(
          `http://localhost:5000/api/runs/${this.$route.params.session_id}/${this.$route.params.student_id}`,
          {
            comment: this.comment,
            rating: this.rating,
          }
        );
        this.snackbar = true;
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.loadData();
  },
};
</script>

<style lang="css">
.map-wrapper {
  height: 80%;
}
</style>
