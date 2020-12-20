<template>
  <v-main>
    <v-app-bar app color="primary" dark style="">
      <v-toolbar-title>
        <router-link to="/">
          <h3 class="secondary--text text--lighten-1 font-weight-light px-4">
            DORA
          </h3>
        </router-link>
      </v-toolbar-title>

      <router-link to="/tree">
        <h4 class="secondary--text text--lighten-1 font-weight-light px-4">
          Dashboard
        </h4>
      </router-link>
    </v-app-bar>
    <v-container fluid class="fill-height">
      <v-row height="100px" class="px-5">
        <v-col>
          <div width="200">
            <v-row>
              <v-col>
                <v-text-field width="100" label="Code de la séance" placeholder="ie: 6ebj7jkbqd63d" v-model="sessionCode"></v-text-field>
              </v-col>
              <v-col>
                <v-btn @click="sendSessionCode">valider</v-btn>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col>
          <div>
            <h3 class="headline mb-5">
              Session 1
            </h3>
            <v-row>
              <v-col>
				  <h4 class="subheading my-5">
                  21 mars 2001
                </h4>
                <h4 class="subtitle-1 my-5">3 Balises enregistrées</h4>
			</v-col>
              <v-col>
                <h4 class="subtitle-1 my-5">Notre dame les oiseaux</h4>
                <h4 class="subtitle-1 my-5">5ème B</h4>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-data-table :headers="headers" :items="data" hide-default-footer fixed-header height="300px"> </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  data() {
    return {
      sessionCode: "",
      headers: [
        { text: "Movuino", value: "id" },
        { text: "Status", value: "status" },
        { text: "Temps", value: "time" },
        { text: "Actions", value: "" },
      ],
      data: [
        {
          id: "mov1",
          status: "connected",
          time: undefined,
        },
      ],
    };
  },
  methods: {
    sendSessionCode() {},
  },
};
</script>
