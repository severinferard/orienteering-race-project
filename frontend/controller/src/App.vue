<template>
  <v-app>
<router-view></router-view>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
};
</script>
<style>
@font-face {
  font-family: "Mandalore";
  src: local("Mandalore"),
   url(./fonts/mandalore-font/MandaloreHalftone-OVVBA.otf) format("truetype");
}
  
</style>
