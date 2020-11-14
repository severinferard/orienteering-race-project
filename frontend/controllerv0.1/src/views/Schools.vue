<template>
  <v-main>
    <v-app-bar color="blue" dark app>
      <v-toolbar-title>
        <router-link :to="`/`" class="text-decoration-none" style="color: inherit">
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="8">
          <v-card width="100%" height="400px" class="overflow-y-auto">
            <v-toolbar color="blue darken-3" dark>
              <v-toolbar-title class="px-3">Établissements</v-toolbar-title>
              <v-btn @click.stop="newSchool" absolute bottom color="white" fab right light>
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
              <v-divider></v-divider>
              <v-list-item-group>
                <v-list-item v-for="school in schools" :key="school.id" :to="`schools/${school.id}/classes`">
                  <v-list-item-icon>
                    <v-icon>mdi-school</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    {{ school.name }}
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="dialog" width="50%">
      <v-card>
        <v-row>
          <v-col><v-text-field v-model="newItem.name" class="mx-4" label="Nom de l'établissement"></v-text-field></v-col>
          <v-col><v-text-field v-model="newItem.city" class="mx-4" label="Ville"></v-text-field></v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="2">
            <v-btn @click="sendPostRequest()">Créer</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
    </v-container>
  </v-main>
</template>

<script>
import axios from "axios";
export default {
    data() {
        return {
            dialog: false,
            loading: false,
            schools : [],
            newItem: {},
        }
    },
    methods: {
        async loadData() {
            const res = await axios.get(`/api/schools/`)
            this.schools = res.data
            console.log('this.schools', this.schools)
        },
        newSchool() {
            this.newItem = {name: "", city: ""}
            this.dialog = true
        },
       async sendPostRequest() {
            this.dialog = false
            const res = await axios.post(`/api/schools/`, this.newItem)
            this.newItem.id = res.data.id
            this.schools.push(this.newItem)
            console.log(this.newItem)
        }
    },
    created() {
        this.loadData()
    },
}
</script>