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
      <MyMap ref="myMap" :geoJson="geoJson" :center="mapCenter"> </MyMap>
    </v-card>
    <div class="pt-0 pl-0 mx-5">
      <v-row height="300px">
        <v-col cols="6">
          <v-row style="height: 100%">
            <v-col cols="4">
              <StudentDataCard icon="mdi-timer" title="Chrono" unit="min" percent="100">
                <template v-slot:value>
                  <span class="display-2">{{ Math.floor(chrono / 60) }}</span>
                  <span class="display-1">:</span>
                  <span class="display-2">{{ getMins(chrono) }}</span>
                </template>
              </StudentDataCard>
            </v-col>
            <v-col cols="4">
              <StudentDataCard
                icon="mdi-shoe-print"
                :value="distance"
                percent="100"
                title="Distance"
                unit="m"
              ></StudentDataCard>
            </v-col>
            <v-col cols="4">
              <StudentDataCard
                icon="mdi-crosshairs-gps"
                :value="validedBeacons"
                title="Balises"
                unit="-"
                :percent="percentBeacons"
              ></StudentDataCard>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-row style="height: 100%">
            <v-col>
              <StudentGraphCard title="Vitesse" unit="km/h" :value="averageSpeed" icon="mdi-speedometer">
                <template v-slot:graph>
                  <v-sheet>
                    <v-sparkline
                      :smooth="16"
                      :gradient="['#ffd200', '#1feaea', '#f72047']"
                      :line-width="3"
                      :value="speeds"
                      auto-draw
                      stroke-linecap="round"
                    ></v-sparkline>
                  </v-sheet>
                </template>
              </StudentGraphCard>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row
        ><v-col
          ><v-card>
            <v-data-table :headers="headers" :items="balises" hide-default-footer fixed-header height="300px">
              <template v-slot:[`item.valided`]="{ item }">
                <v-icon :color="item.valided ? 'green' : 'red'">{{
                  item.valided ? "mdi-checkbox-marked" : "mdi-close-box"
                }}</v-icon>
              </template>
              <template v-slot:[`item.avgSpeed`]="{ item }">
                {{ item.valided ? parseFloat(item.avgSpeed).toFixed(2) : "-" }}
              </template>
              <template v-slot:[`item.time`]="{ item }">
                {{ item.valided ? item.time : "-" }}
              </template>
              <template v-slot:[`item.lap`]="{ item }">
                {{ item.valided ? item.lap : "-" }}
              </template>
            </v-data-table></v-card
          ></v-col
        ></v-row
      >
      <v-row>
        <StudentFeedbackForm :rating="rating" :comment="comment" v-on:success="snackbar = true"></StudentFeedbackForm>
      </v-row>
    </div>
    <v-snackbar v-model="snackbar" color="success">
      <span class="overline font-weight-black">Enregistré !</span>

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false"> Fermer </v-btn>
      </template>
    </v-snackbar>
  </v-main>
</template>

<script>
import axios from "axios";
import MyMap from "@/components/MyMap.vue";
import StudentDataCard from "@/components/StudentDataCard.vue";
import StudentGraphCard from "@/components/StudentGraphCard.vue";
import StudentFeedbackForm from "@/components/StudentFeedbackForm.vue";
export default {
  components: {
    MyMap,
    StudentDataCard,
    StudentGraphCard,
    StudentFeedbackForm,
  },
  data() {
    return {
      id: "",
      sessionName: "",
      sessionId: this.$route.params.session_id,
      averageSpeed: 0,
      distance: 0,
      chrono: 0,
      speeds: [],
      rating: 0,
      comment: "",
      headers: [
        { text: "ID", value: "id" },
        { text: "Temps (s)", value: "time" },
        { text: "Tour (s)", value: "lap" },
        { text: "Vitesse (km/h)", value: "avgSpeed" },
        { text: "Validée", value: "valided" },
      ],
      balises: [],
      geoJson: {},
      mapCenter: null,
      loadingData: false,
      loadingError: false,
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
    getMins(chrono) {
      return chrono % 60 < 10 ? "0" + (chrono % 60) : chrono % 60;
    },
    async loadData() {
      this.loadingData = true;
      try {
        const res = await axios.get(
          `/api/runs/${this.$route.params.session_id}/${this.$route.params.student_id}`
        );
        const data = res.data;
        this.balises = data.beacons;
        this.sessionName = data.sessionName;
        this.id = data.id;
        this.chrono = data.time;
        this.averageSpeed = data.avgSpeed.toFixed(1);
        this.distance = data.distance.toFixed();
        this.speeds = data.speeds;
        this.comment = data.comment;
        this.rating = data.rating;
        this.geoJson = data.geoJon;
        this.mapCenter = data.beacons[0].coords;
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

<style lang="css">
.map-wrapper {
  height: 80%;
}
</style>
