<template>
  <v-app>
<router-view></router-view>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
  async created() {
      const date = (new Date()).toISOString().slice(0,10)
      const time = (new Date()).toISOString().substr(11, 8)
      await axios.post(`/api/setTime/`, {date, time});
  },
};
</script>
<style>
@font-face {
  font-family: "Mandalore";
  src: local("Mandalore"),
   url(./fonts/mandalore-font/MandaloreHalftone-OVVBA.otf) format("truetype");
}
  
</style>
