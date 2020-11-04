<template>
<v-card>
    <v-card flat>
      <v-toolbar dark color="blue">
        <v-btn icon dark @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ sessionName }} | Réglages</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialog = false"> Save </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-card>
          <v-toolbar flat
            ><v-spacer></v-spacer
            ><v-btn @click="newBeacon()">Nouvelle balise</v-btn></v-toolbar
          >
          <v-row>
            <v-col>
              <v-data-table :headers="headers" :items="beacons">
                <template v-slot:[`item.actions`]="{ item }">
                  <v-icon small class="mr-2" @click="editBeacon(item)">
                    mdi-pencil
                  </v-icon>
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
              <v-text-field
                v-model="editedItem.id"
                class="mx-3"
                label="Balise ID"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="editedItem.lat"
                class="mx-3"
                label="Latitude"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="editedItem.long"
                class="mx-3"
                label="Longitude"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-col cols="2">
              <v-btn @click="modifie ? saveChange() : saveNew()" width="100%"
                >Enregistrer</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="axiosSuccess ? 'success' : 'error'">
      <span class="overline font-weight-black">{{ snackbarMsg }}</span>

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Fermer
        </v-btn>
      </template>
    </v-snackbar>
    </v-card>
</template>


<script>
import axios from "axios";
export default {
  name: "SessionSettingsDialog",
  props: ["value", "sessionName"],
  data() {
    return {
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
      snackbarMsg: "",
      snackbar: false,
      axiosSuccess: false,
    };
  },
  methods: {
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
        await axios.put(
          `http://localhost:5000/api/sessions/${this.$route.params.session_id}/`,
          {
            _id: this.editedItem._id,
            id: parseInt(this.editedItem.id),
            coords: [this.editedItem.lat, this.editedItem.long],
          }
        );
        Object.assign(
          this.beacons.filter((b) => b._id === this.editedItem._id)[0],
          this.editedItem
        );
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
        await axios.post(
          `http://localhost:5000/api/sessions/${this.$route.params.session_id}/`,
          {
            _id: this.editedItem._id,
            id: parseInt(this.editedItem.id),
            coords: [this.editedItem.lat, this.editedItem.long],
          }
        );
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
        await axios.delete(
          `http://localhost:5000/api/sessions/${this.$route.params.session_id}/`,
          { data: {_id: item._id} });
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
};
</script>