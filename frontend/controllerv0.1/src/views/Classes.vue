<template>
  <v-main>
    <v-app-bar color="blue" dark app>
      <!-- <v-toolbar-title>
        <router-link :to="`/schools`" class="text-decoration-none" style="color: inherit">
        <v-icon large>mdi-chevron-left</v-icon>
        Établissements
        </router-link>
      </v-toolbar-title> -->
      <v-toolbar-title>
        <router-link :to="`/schools/${schoolId}/classes`" class="text-decoration-none" style="color: inherit">
            <span class="px-3">{{ schoolName }}</span>
            <v-icon large>mdi-chevron-right</v-icon>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="8">
          <v-card width="100%" height="400px" class="overflow-y-auto">
            <v-toolbar color="blue darken-3" dark>
              <v-toolbar-title class="px-3">{{schoolName}}</v-toolbar-title>
              <v-btn @click.stop="newClass" absolute bottom color="white" fab right light>
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
                <v-list-item v-for="clss in clsses" :key="clss.id" :to="`classes/${clss.id}/sessions`">
                  <v-list-item-icon>
                    <v-icon>mdi-school</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    {{ clss.name }}
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
          <v-col><v-text-field v-model="newItem.name" class="mx-4" label="Nom de classe"></v-text-field></v-col>
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
            schoolId: this.$route.params.school_id,
            schoolName: "",
            clsses : [],
            newItem: {},
        }
    },
    methods: {
        async loadData() {
            const res = await axios.get(`/api/schools/${this.$route.params.school_id}`)
            this.clsses = res.data.classes
            this.schoolName = res.data.name
            console.log('this.clsses', this.clsses)
        },
        newClass() {
            this.newItem = {name: ""}
            this.dialog = true
        },
       async sendPostRequest() {
            this.dialog = false
            const res = await axios.post(`/api/schools/${this.$route.params.school_id}`, this.newItem)
            this.newItem.id = res.data.id
            this.clsses.push(this.newItem)
            console.log(this.newItem)
        }
    },
    created() {
        this.loadData()
    },
}
</script>