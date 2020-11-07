<template>
  <v-main>
    <v-app-bar color="blue" dark app>
      <v-toolbar-title>
        <router-link :to="`/session/`" class="text-decoration-none" style="color: inherit">
          <v-icon large>mdi-chevron-left</v-icon>
          Sessions
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <span class="px-3">{{ sessionName }}</span>
      <v-btn text @click="settings = true"><v-icon large>mdi-cog</v-icon></v-btn>
    </v-app-bar>
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="4">
          <v-card width="100%" height="400px" class="overflow-y-auto">
            <v-toolbar color="deep-purple" dark>
              <v-toolbar-title class="px-3">{{ sessionName }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-subheader class="px-3">{{ sessionDate }}</v-subheader>
              <v-subheader class="px-3">{{ beacons.length }} Balises</v-subheader>
            </v-toolbar>
            <v-container v-if="loading" style="height: 80%">
              <v-row class="fill-height" align-content="center" justify="center">
                <v-col class="subtitle-1 text-center" cols="12"> Chargement... </v-col>
                <v-col cols="6">
                  <v-progress-linear color="deep-purple accent-4" indeterminate rounded height="6"></v-progress-linear>
                </v-col>
              </v-row>
            </v-container>
            <v-list v-else>
              <v-list-item-group>
                <v-list-item :to="`/session/${this.$route.params.session_id}/teacher-recap`">
                  <v-list-item-icon>
                    <v-icon>mdi-account-tie</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content> Page enseignant </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
              <v-divider></v-divider>
              <v-list-item-group>
                <v-list-item v-for="std in students" :key="std.id" :to="makeLink(std.id)">
                  <v-list-item-icon>
                    <v-icon>mdi-school</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    {{ std.id }}
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- <v-dialog
      v-model="settings"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
    <SessionSettingsDialog v-on:close="settings = false" :sessioName="sessionName" :beacons="beacons"></SessionSettingsDialog>
    </v-dialog> -->
    <v-dialog v-model="settings" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="blue">
          <v-btn icon dark @click="settings = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ sessionName }} | Réglages</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-container>
          <v-card>
            <v-toolbar flat><v-spacer></v-spacer><v-btn @click="newBeacon()">Nouvelle balise</v-btn></v-toolbar>
            <v-row>
              <v-col>
                <v-data-table :headers="headers" :items="beacons">
                  <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="editBeacon(item)"> mdi-pencil </v-icon>
                    <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
                  </template>
                  <template v-slot:no-data> Aucune basise enregistrée </template>
                </v-data-table>
              </v-col>
            </v-row></v-card
          ></v-container
        >
      </v-card>
      <v-dialog v-model="dialog">
        <v-card>
          <v-container>
            <v-row>
              <v-col cols="4">
                <v-text-field v-model="editedItem.id" class="mx-3" label="Balise ID"></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="editedItem.lat" class="mx-3" label="Latitude"></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="editedItem.long" class="mx-3" label="Longitude"></v-text-field>
              </v-col>
            </v-row>
            <v-row align="center" justify="center">
              <v-col cols="2">
                <v-btn @click="modifie ? saveChange() : saveNew()" width="100%">Enregistrer</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="snackbar" :color="axiosSuccess ? 'success' : 'error'">
        <span class="overline font-weight-black">{{ snackbarMsg }}</span>

        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="snackbar = false"> Fermer </v-btn>
        </template>
      </v-snackbar>
    </v-dialog>
  </v-main>
</template>

<script>
import axios from "axios";
// import SessionSettingsDialog from '@/components/SessionSettingsDialog.vue';
export default {
  components: {
    // SessionSettingsDialog,
  },
  data() {
    return {
      students: [],
      sessionName: "",
      sessionDate: "",
      settings: false,
      headers: [
        { text: "Balise ID", align: "start", value: "id" },
        { text: "Latitude", value: "lat" },
        { text: "Longitude", value: "long" },
        { text: "Actions", value: "actions" },
      ],
      beacons: [],
      dialog: false,
      editedIndex: -1,
      editedItem: { _id: "", id: "", lat: "", long: "" },
      modifie: false,
      loading: true,
      snackbarMsg: "",
      snackbar: false,
      axiosSuccess: false,
    };
  },
  methods: {
    makeLink(id) {
      return {
        path: `/session/${this.$route.params.session_id}/student-recap/${id}`,
      };
    },
    async loadData() {
      const res = await axios.get(`/api/sessions/${this.$route.params.session_id}`);
      console.log(res.data);
      this.students = res.data.runs.map((run) => {
        return { id: run.id };
      });
      this.sessionName = res.data.sessionName;
      this.sessionDate = res.data.date;
      this.beacons = res.data.beacons.map((beacon) => {
        return {
          id: beacon.id,
          lat: beacon.coords[0],
          long: beacon.coords[1],
          _id: beacon._id,
        };
      });
      this.loading = false;
    },
    editBeacon(item) {
      console.log(item);
      this.modifie = true;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    newBeacon() {
      this.modifie = false;
      this.editedItem = { _id: "", id: "", lat: "", long: "" };
      this.dialog = true;
    },
    async saveChange() {
      this.dialog = false;
      try {
        await axios.put(`/api/sessions/${this.$route.params.session_id}/`, {
          _id: this.editedItem._id,
          id: parseInt(this.editedItem.id),
          coords: [parseFloat(this.editedItem.lat), parseFloat(this.editedItem.long)],
        });
        Object.assign(this.beacons.filter((b) => b._id === this.editedItem._id)[0], this.editedItem);
        this.axiosSuccess = true;
        this.snackbarMsg = "Changement enregistré avec succès!";
        this.snackbar = true;
      } catch (error) {
        console.log(error);
        this.axiosSuccess = false;
        this.snackbarMsg = "Une erreur c'est produite";
        this.snackbar = true;
      }
      this.modifie = false;
    },

    async saveNew() {
      console.log("new");
      this.dialog = false;
      this.editedItem._id = Math.random().toString(36).slice(-5);
      try {
        await axios.post(`/api/sessions/${this.$route.params.session_id}/`, {
          _id: this.editedItem._id,
          id: parseInt(this.editedItem.id),
          coords: [parseFloat(this.editedItem.lat), parseFloat(this.editedItem.long)],
        });
        this.beacons.push(Object.assign({}, this.editedItem));
        this.axiosSuccess = true;
        this.snackbarMsg = "Nouvelle balise enregistrée avec succès!";
        this.snackbar = true;
      } catch (error) {
        console.log(error);
        this.axiosSuccess = false;
        this.snackbarMsg = "Une erreur c'est produite";
        this.snackbar = true;
      }
      this.modifie = false;
    },
    async deleteItem(item) {
      console.log("iteam to del", item);
      this.beacons.splice(this.beacons.indexOf(item), 1);
      try {
        await axios.delete(`/api/sessions/${this.$route.params.session_id}/`, {
          data: { _id: item._id },
        });
        this.axiosSuccess = true;
        this.snackbarMsg = "Balise suprimée avec succès!";
        this.snackbar = true;
      } catch (error) {
        console.log(error);
        this.axiosSuccess = false;
        this.snackbarMsg = "Une erreur c'est produite";
        this.snackbar = true;
      }
    },
  },
  created() {
    this.loadData();
  },
};
</script>