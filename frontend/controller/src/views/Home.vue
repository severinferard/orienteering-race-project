<template>
  <div>
<v-app-bar app color="transparent" dark flat>
      <v-toolbar-title>
        <router-link to="/">
            <h3 class="secondary--text text--lighten-1 font-weight-light px-4">DORA</h3>
          </router-link>
        </v-toolbar-title>

          <router-link to="/tree">
            <h4 class="secondary--text text--lighten-1 font-weight-light px-4">Dashboard</h4>
          </router-link>
    
    </v-app-bar>
    <div class="top">
      <img class="drawing" width="30%" src="@/assets/undraw_img.svg" />
      <div class="slogan">
        <span class="display-2 white--text font-weight-thin"
          ><span class="font-weight-regular">D</span>igital
          <span class="font-weight-regular">O</span>rienteering <br /><span
            class="font-weight-regular"
            >R</span
          >ace <span class="font-weight-regular">A</span>pplication</span
        >
      </div>
      <div class="buttons">
        <v-btn x-large dark outlined to="/tree">Dashboard</v-btn>
      </div>
    </div>
    <div class="bot pa-5">
      <v-row class="fill-height">
        <v-col>
          <v-card height="100%">
              <div class="logo" id="logo-makerlab"></div>
          </v-card>
        </v-col>
        <v-col>
       <v-card height="100%">
              <div class="logo" id="logo-movuino"></div>
          </v-card>
        </v-col>
        <v-col>
       <v-card height="100%">
              <div class="logo" id="logo-i3sp"></div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>

export default {
  name: "Home",
  components: {},
  data() {
    return {};
  },
};
</script>
<style>
.top {
  position: absolute;
  height: 65%;
  width: 100%;
  background-image: url("../assets/bg.svg");
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
}

.bot {
  position: absolute;
  top: 65%;
  width: 100%;
  height: 35%;
}

.drawing {
  position: absolute;
  right: 10%;
  top: 20%;
}

.slogan {
  position: absolute;
  top: 35%;
  left: 10%;
  width: 40%;
}

.buttons {
  position: absolute;
  top: 60%;
  left: 10%;
  width: 40%;
}

.logo {
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 80%;
}

#logo-makerlab {
    background-size: contain;
    background-image: url("../assets/logo-makerlab.png")
}

#logo-movuino {
    background-image: url("../assets/logo-movuino.jpg")
}

#logo-i3sp {
    background-image: url("../assets/logo-i3sp.png")
}
</style>
