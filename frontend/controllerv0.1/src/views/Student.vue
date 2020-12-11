<template>
  <v-main>
    <v-app-bar color="primary" dark app style="z-index: 999999">
         <v-toolbar-title><router-link to="/">
            <h3 class="secondary--text text--lighten-1 font-weight-light px-4">DORA</h3>
          </router-link></v-toolbar-title>
                  <router-link to="/tree">
            <h4 class="secondary--text text--lighten-1 font-weight-light px-4">Dashboard</h4>
          </router-link>
      <!-- <v-toolbar-title> -->
        <!-- <router-link :to="`/schools/${school.id}/classes`" class="text-decoration-none" style="color: inherit"> -->
            <span class="px-3">{{ school.name }}</span>
            <v-icon >mdi-chevron-right</v-icon>
        <!-- </router-link> -->
        <!-- <router-link :to="`/schools/${school.id}/classes/${clss.id}/sessions`" class="text-decoration-none" style="color: inherit"> -->
            <span class="px-3">{{ clss.name }}</span>
            <v-icon >mdi-chevron-right</v-icon>
        <!-- </router-link> -->
        <!-- <router-link :to="`/session/${session.id}`" class="text-decoration-none" style="color: inherit"> -->
            <span class="px-3">{{ session.name }}</span>
            <v-icon >mdi-chevron-right</v-icon>
        <!-- </router-link> -->
        <!-- <router-link :to="`#`" class="text-decoration-none" style="color: inherit"> -->
            <span class="px-3">{{ id }}</span>
        <!-- </router-link> -->
      <!-- </v-toolbar-title> -->
      <v-spacer></v-spacer>
      <v-btn class="mx-3" outlined :to="`/session/${session.id}/#`">Autres éleves</v-btn>
      <v-btn class="mx-3" outlined :to="`/student-summary/${clss.id}/${id}`">Resumé des séances</v-btn>
      <!-- <span class="px-3">{{ session.date }}</span> -->
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
        <StudentFeedbackForm
          :rating="rating"
          :comment="comment"
          v-on:success="snackbar = true"
        ></StudentFeedbackForm>
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
import StudentFeedbackForm from "@/components/StudentFeedbackForm.vue";
export default {
  components: {
    MyMap,
    StudentFeedbackForm,
  },
  data() {
    return {
      id: "",
      session: {id: this.$route.params.session_id, name: "", date: ""},
      school: {id: "", name: ""},
      clss: {id: "", name: ""},
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
        console.log("data", data);
        if (!data.rawPositions.length)
			throw "Le movuino n'a enregistré aucune données"
		if (!data.beacons.length)
			throw "Auncune balises enregistrées"
        this.balises = data.beacons;
        this.session.name = data.session_name;
        this.session.date = data.session_date;
        this.session.id = this.$route.params.session_id;
        this.clss.id = data.class_id;
        this.clss.name = data.class_name;
        this.school.name = data.school_name;
        this.school.id = data.school_id;
        console.log("data.class_name;",data.class_name)
        console.log("date", this.session.date);
        this.id = data.id;
        this.chrono = data.time;
        console.log("chrono",this.chrono)
        this.averageSpeed = data.avgSpeed.toFixed(1);
        this.distance = data.distance.toFixed();
        this.speeds = data.speeds;
        this.comment = data.comment;
        this.rating = data.rating;
        console.log("original rating", this.rating)
        this.geoJson = data.geoJson;
        console.log("geosJson",this.geoJson)
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
  height: 100%;
}
</style>
