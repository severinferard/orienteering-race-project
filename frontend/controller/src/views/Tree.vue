<template>
  <v-main>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>
        <router-link to="/">
          <h3 class="secondary--text text--lighten-1 font-weight-light px-4">
            DORA
          </h3>
        </router-link>
      </v-toolbar-title>

      <router-link to="/tree">
        <h4 class="secondary--text text--lighten-1 font-weight-light text-decoration-underline px-4">
          Dashboard
        </h4>
      </router-link>
    </v-app-bar>
    <v-container fluid class="fill-height">
      <v-row class="fill-height pa-4">
        <v-col cols="5">
          <v-treeview
            hoverable
            transition
            activatable
            :items="items"
            :load-children="loadNode"
            :active.sync="active"
            :open.sync="open"
          ></v-treeview>
          <v-btn @click.stop="newSchool()" style="margin-bottom: 43px" absolute bottom color="white" fab left light> <v-icon>mdi-plus</v-icon></v-btn>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col>
            <!-- ===================================================================================================== No node selected page ========================= -->
          <v-card v-if="!selected" flat class="pt-6">
            <v-card-text class="text-center">
              <v-img src="@/assets/left-arrow.svg" max-height="150" contain class="mb-10"></v-img>
              <span class="display-1 grey--text">Sélectionnez un noeud</span>
            </v-card-text>
          </v-card>
          <!-- ===================================================================================================== School page ====================================== -->
          <v-card v-else-if="nodeTypeMap[selected.id] == 'school'" class="pt-6" flat>
            <v-card-text class="text-center">
              <v-img max-height="150" contain src="@/assets/school.svg" class="mb-6"></v-img>
              <h3 class="headline mb-2">
                {{ selected.name }}
              </h3>
              <h4 class="subheading mb-5">
                {{ selected.city }}
              </h4>
              <v-divider></v-divider>
              <h4 class="subtitle-1 my-5">{{ selected.classes.length }} classes enregistrées</h4>
              <v-toolbar color="#46c4a1" dark dense>
                <v-toolbar-title class="px-3">Classes</v-toolbar-title>
                <v-btn @click.stop="newClass(selected)" absolute bottom color="white" fab right light> <v-icon>mdi-plus</v-icon></v-btn>
              </v-toolbar>
              <v-list>
                <v-list-item-group>
                  <v-list-item v-for="clss in selected.classes" :key="clss.id" @click="test(clss._id)">
                    <v-list-item-icon>
                      <v-avatar>
                        <v-img contain src="@/assets/teamwork.svg"> </v-img>
                      </v-avatar>
                    </v-list-item-icon>
                    <v-list-item-content>
                      {{ clss.name }}
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card-text>
          </v-card>
          <!-- ===================================================================================================== Class page ========================= -->
          <v-card v-else-if="nodeTypeMap[selected.id] == 'class'" class="pt-6" flat>
            <v-card-text class="text-center">
              <v-img max-height="150" contain src="@/assets/teamwork.svg" class="mb-6"></v-img>
              <h3 class="headline mb-5">
                {{ selected.name }}
              </h3>
              <v-divider></v-divider>
              <h4 class="subtitle-1 my-5">{{ selected.sessions.length }} sessions enregistrées</h4>
              <v-toolbar color="#46c4a1" dark dense>
                <v-toolbar-title class="px-3">Sessions</v-toolbar-title>
                <v-btn @click.stop="newSession(selected)" absolute bottom color="white" fab right light> <v-icon>mdi-plus</v-icon></v-btn>
              </v-toolbar>
              <v-list>
                <v-list-item-group>
                  <v-list-item v-for="sess in selected.sessions" :key="sess.id" @click="test(sess._id)">
                    <v-list-item-icon>
                      <v-img max-height="50" contain src="@/assets/map.svg"> </v-img>
                    </v-list-item-icon>
                    <v-list-item-content>
                      {{ sess.session_name }}
                    </v-list-item-content>
                    <v-list-item-content>
                      <v-subheader>{{ sess.date }}</v-subheader>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card-text>
          </v-card>
          <!-- ===================================================================================================== Session page ========================= -->
          <v-card v-else-if="nodeTypeMap[selected.id] == 'session'" class="pt-6" flat>
            <div style="position: absolute; top: 0; right: 0">
              <v-btn class="pa-0 ma-0" width="60" height="60" depressed color="transparent" @click="settings = true">
                <v-img contain height="60" width="30" src="@/assets/marker.svg"></v-img>
              </v-btn>
              <v-btn
                class="pa-0 ma-0"
                width="60"
                height="60"
                depressed
                color="transparent"
                @click="$router.push(`/session/${selected.id}/teacher-recap`)"
              >
                <v-img contain width="30" height="60" src="@/assets/whistle.svg"></v-img>
              </v-btn>
            </div>
            <v-row>
              <v-col cols="5">
                <v-card-text class="text-center">
                  <v-img max-height="150" contain src="@/assets/map.svg" class="mb-6"></v-img>
                </v-card-text>
              </v-col>
              <v-col>
                <v-card-text class="text-center">
                  <h3 class="headline mb-5">
                    {{ selected.name }}
                  </h3>
                  <h4 class="subheading mb-5">
                    {{ selected.date }}
                  </h4>
                  <v-divider></v-divider>
                  <h4 class="subtitle-1 my-5">{{ selected.beacons.length }} Balises enregistrées</h4>
                  <h4 class="subtitle-1 my-5">{{ selected.runs.length }} Éleves enregistrées</h4>
                </v-card-text>
              </v-col>
            </v-row>
            <v-row class="fill-height">
              <v-col cols="12">
                <v-card>
                  <v-toolbar color="#46c4a1" dark dense>
                    <v-toolbar-title class="px-3">Éleves</v-toolbar-title>
                  </v-toolbar>
                  <v-card flat class="overflow-y-auto">
                    <v-list>
                      <v-list-item-group>
                        <v-list-item v-for="run in selected.runs" :key="run.id" @click="test(run._id)">
                          <v-list-item-icon>
                            <v-img max-height="50" contain src="@/assets/chronometer.svg"> </v-img>
                          </v-list-item-icon>
                          <v-list-item-content>
                            {{ run.id }}
                          </v-list-item-content>
                          <v-list-item-content> </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-card>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
          <v-card v-else-if="nodeTypeMap[selected.id] == 'run'" class="pt-6" flat>
            run
            {{ selected.id }}
            {{ selected.parent.id }}
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- ===================================================================================================== New class dialog ========================= -->
    <v-dialog v-model="newClassDialog" width="50%">
      <v-card>
        <v-row>
          <v-col><v-text-field v-model="newItem.name" class="mx-4" label="Nom de classe"></v-text-field></v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="2">
            <v-btn @click="newClassSendPost()">Créer</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
    <!-- ===================================================================================================== New session dialog ========================= -->
    <v-dialog v-model="newSessionDialog" width="50%">
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
            <v-btn @click="newSessionSendPost()">Créer</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
        <!-- ===================================================================================================== Beacons settings dialog ========================= -->
    <v-dialog v-model="settings" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="settings = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Balises</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-container>
          <v-card>
            <v-toolbar flat><v-spacer></v-spacer><v-btn @click="newBeacon()">Nouvelle balise</v-btn></v-toolbar>
            <v-row>
              <v-col>
                <v-data-table :headers="headers" :items="beacons">
                  <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="editBeacon(item)">
                      mdi-pencil
                    </v-icon>
                    <v-icon small @click="deleteItem(item)">
                      mdi-delete
                    </v-icon>
                  </template>
                  <template v-slot:no-data>
                    Aucune basise enregistrée
                  </template>
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
          <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
            Fermer
          </v-btn>
        </template>
      </v-snackbar>
    </v-dialog>
          <v-dialog v-model="newSchoolDialog" width="50%">
      <v-card>
        <v-row>
          <v-col><v-text-field v-model="newItem.name" class="mx-4" label="Nom de l'établissement"></v-text-field></v-col>
          <v-col><v-text-field v-model="newItem.city" class="mx-4" label="Ville"></v-text-field></v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="2">
            <v-btn @click="newSchoolSendPostRequest()">Créer</v-btn>
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
      items: [],
      itemsFlat: [],
      nodeIndexCounter: 1,
      nodeTypeMap: {},
      selectedId: "",
      active: [],
      open: [],
      newItem: {},
      newClassDialog: false,
      newSessionDialog: false,
      beaconSettingsDialog: false,
      newSchoolDialog: false,
      settings: false,
      headers: [
        { text: "Balise ID", align: "start", value: "id" },
        { text: "Latitude", value: "lat" },
        { text: "Longitude", value: "long" },
        { text: "Actions", value: "actions" },
      ],
      dialog: false,
      editedIndex: -1,
      editedItem: { _id: "", id: "", lat: "", long: "" },
      modifie: false,
      loading: true,
      snackbarMsg: "",
      snackbar: false,
      axiosSuccess: false,
      dateMenu: false,
    };
  },
  methods: {
    test(e) {
      this.active.push(e);
    },
    async loadSchools() {
      const res = await axios.get(`/api/schools/`);
      console.log(res.data);
      this.items = res.data.map((school) => {
        this.nodeTypeMap[school.id] = "school";
        let item = {
          id: school.id,
          name: school.name,
          children: [],
          city: school.city,
          classes: school.classes,
        };
        this.itemsFlat.push(item);
        return item;
      });
    },
    async loadNode(parent) {
      let res;

      switch (this.nodeTypeMap[parent.id]) {
        case "school":
          res = await axios.get(`/api/schools/${parent.id}`);
          for (const clss of res.data.classes) {
            this.nodeTypeMap[clss.id] = "class";
            let res = await axios.get(`/api/sessions/`, {
              params: { class_id: clss.id },
            });
            let item = {
              id: clss.id,
              name: clss.name,
              sessions: res.data.sessions,
              children: [],
            };
            this.itemsFlat.push(item);
            parent.children.push(item);
          }
          break;
        case "class":
          res = await axios.get(`/api/sessions/`, {
            params: { class_id: parent.id },
          });
          for (const session of res.data.sessions) {
            let sessionInfo = (await axios.get(`/api/sessions/${session.id}`)).data;
            this.nodeTypeMap[session.id] = "session";
            let item = {
              id: session._id,
              name: session.session_name,
              children: [],
              beacons: session.beacons,
              runs: sessionInfo.runs.map((run) => {
                return { ...run, _id: session._id + run.id };
              }),
              date: session.date,
            };
            this.itemsFlat.push(item);
            parent.children.push(item);
          }
          break;
        case "session":
          res = await axios.get(`/api/sessions/${parent.id}`);
          parent.children = res.data.runs.map((run) => {
            let id = parent.id + run.id;
            this.nodeTypeMap[id] = "run";
            let item = {
              id: id,
              name: run.id,
              parent: parent,
              //   children: []
            };
            this.itemsFlat.push(item);
            return item;
          });
      }
    },
    // ==================================================================================== New class =================================
    newClass(parent) {
      this.newItem = { parent: parent, name: "" };
      this.newClassDialog = true;
      console.log("parent", parent)
    },
    async newClassSendPost() {
      this.newClassDialog = false;
      const res = await axios.post(`/api/schools/${this.newItem.parent.id}`, this.newItem);
      let item = {
        ...this.newItem,
        id: res.data.id,
        children: [],
        sessions: [],
      };
      console.log('adding to', this.itemsFlat.find((e) => (e.id == this.newItem.parent.id)))
      this.itemsFlat.find((e) => (e.id == this.newItem.parent.id)).classes.push(item);
      this.itemsFlat.find((e) => (e.id == this.newItem.parent.id)).children.push(item);
      this.itemsFlat.push(item);
      this.nodeTypeMap[item.id] = "class";
    },
    // ==================================================================================== New session =================================
    newSession(parent) {
      this.newItem = { name: "", date: "", parent: parent };
      this.newSessionDialog = true;
    },
    async newSessionSendPost() {
      this.newSessionDialog = false;
      let item = {
        name: this.newItem.name,
        session_name: this.newItem.name,
        children: [],
        beacons: [],
        runs: [],
        date: this.formattedDate,
      };
      const res = await axios.post(`/api/sessions/`, item, {
        params: { class_id: this.newItem.parent.id },
      });
      item.id = res.data.id;
      this.newItem.parent.sessions.push(item);
      this.newItem.parent.children.push(item);
      this.itemsFlat.push(item);
      this.nodeTypeMap[item.id] = "session";
    },

    // ==================================================================================== Beacon settings dialog =================================
    editBeacon(item) {
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
        await axios.put(`/api/sessions/${this.selected.id}/`, {
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
      this.dialog = false;
      this.editedItem._id = Math.random()
        .toString(36)
        .slice(-5);
      try {
        await axios.post(`/api/sessions/${this.selected.id}/`, {
          _id: this.editedItem._id,
          id: parseInt(this.editedItem.id),
          coords: [parseFloat(this.editedItem.lat), parseFloat(this.editedItem.long)],
        });
        this.selected.beacons.push({
          id: this.editedItem.id,
          coords: [this.editedItem.lat, this.editedItem.long],
        });
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
      this.selected.beacons.splice(this.selected.beacons.indexOf(item), 1);
      try {
        await axios.delete(`/api/sessions/${this.selected.id}/`, {
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
    newSchool() {
            this.newItem = {name: "", city: "", classes: ""}
            this.newSchoolDialog = true
        },
    async newSchoolSendPostRequest() {
            this.newSchoolDialog = false
            const res = await axios.post(`/api/schools/`, this.newItem)
            this.newItem.id = res.data.id
            this.itemsFlat.push(this.newItem)
            this.items.push(this.newItem)
            this.nodeTypeMap[this.newItem.id] = 'school'
            console.log(this.newItem)
        }
  },
  computed: {
    selected() {
      if (!this.active.length) return null;
      let ret = this.itemsFlat.find((element) => element.id == this.active[0]);
      return ret;
    },
    formattedDate() {
      return this.newItem.date ? moment(this.newItem.date).format("dddd Do MMMM") : "";
    },
    beacons() {
      if (this.selected && this.nodeTypeMap[this.selected.id] == "session") {
        return this.selected.beacons.map((beacon) => {
          return {
            id: beacon.id,
            lat: beacon.coords[0],
            long: beacon.coords[1],
            _id: beacon._id,
          };
        });
      }
      return null;
    },
  },
  watch: {
    //   open(val) {
    //       console.log("open changed", val)
    //       if (this.itemsFlat.length)
    //         localStorage.setItem('openedNodes', JSON.stringify(val));
    //        console.log("openedNodes", localStorage.getItem('openedNodes'))
    //   },
    selected(val) {
      if (this.nodeTypeMap[val.id] == "run") {
        this.$router.push(`/session/${val.parent.id}/student-recap/${val.name}`);
      }
      this.open.push(val.id);
    },
  },
  async mounted() {
    await this.loadSchools();
    // console.log(this.itemsFlat)
    // console.log("openedNodes load", localStorage.getItem('openedNodes'))
    // this.open = JSON.parse(localStorage.getItem('openedNodes'))
  },
};
</script>
