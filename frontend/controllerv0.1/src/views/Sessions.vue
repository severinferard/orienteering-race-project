<template>
  <v-main>
    <v-app-bar color="blue" dark app>
      <v-toolbar-title><router-link :to="`/schools/${schoolId}/classes`" class="text-decoration-none" style="color: inherit">
        <v-icon large>mdi-chevron-left</v-icon>
        Classes
        </router-link></v-toolbar-title>
    </v-app-bar>
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="8">
          <v-card width="100%" height="400px" class="overflow-y-auto">
            <v-toolbar color="blue darken-3" dark>
              <v-toolbar-title>Sessions</v-toolbar-title>
              <v-btn @click.stop="newSession" absolute bottom color="white" fab right light>
                <v-icon>mdi-plus</v-icon></v-btn
              >
            </v-toolbar>
            <v-container v-if="loading" style="height: 80%">
              <v-row class="fill-height" align-content="center" justify="center">
                <v-col class="subtitle-1 text-center" cols="12"> Chargement... </v-col>
                <v-col cols="6">
                  <v-progress-linear color="blue accent-4" indeterminate rounded height="6"></v-progress-linear>
                </v-col>
              </v-row>
            </v-container>
            <v-list v-else>
              <v-list-item-group>
                <v-list-item v-for="sess in sessions" :key="sess.id" :to="makeLink(sess.id)">
                  <v-list-item-content>
                    {{ sess.sessionName }}
                  </v-list-item-content>
                  <v-list-item-content>
                      <v-subheader>{{ sess.date }}</v-subheader>
                    
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="dialog" width="50%">
      <v-card>
        <v-row>
          <v-col><v-text-field v-model="newItem.name" class="mx-4" label="Nom de la session"></v-text-field></v-col>
          <v-col
            ><v-menu
              v-model="dateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="formattedDate"
                  label="Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="newItem.date" @input="dateMenu = false"></v-date-picker> </v-menu
          ></v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="2">
            <v-btn @click="validate()">Créer</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  data() {
    return {
      sessions: [{ id: 1, name: "name" }],
      loading: true,
      schoolId: this.$route.params.school_id,
      dialog: false,
      newItem: {},
      dateMenu: false,
    };
  },
  computed: {
    formattedDate() {
      return this.newItem.date ? moment(this.newItem.date).format("dddd Do MMMM") : "";
    },
  },
  methods: {
    makeLink(id) {
      return {
        path: `/session/${id}`,
      };
    },
    async loadData() {
      const res = await axios.get(`/api/sessions/`, {params: {class_id: this.$route.params.class_id}});
      console.log(res.data);
      this.sessions = res.data;
      this.loading = false;
    },
    newSession() {
      console.log("newsession");
      this.newItem = { name: "", date: "" };
      this.dialog = true;
    },
    async validate() {
      this.dialog = false;
      let newSession = {
        sessionName: this.newItem.name,
        date: this.formattedDate,
      };
      this.sessions.push(newSession);
      try {
        const res = await axios.post(`/api/sessions/`,newSession, {params: {class_id: this.$route.params.class_id}});
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.loadData();
    moment.locale("fr");
  },
};
</script>
