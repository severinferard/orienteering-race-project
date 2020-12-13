<template>
  <div class="rating">
    <input type="radio" name="star" id="star1" />
    <label for="star1" :class="{ active: selected == 'star1' }" @click="select">
      <img src="@/assets/cool.png" />
    </label>
    <input type="radio" name="star" id="star2" />
    <label for="star2" :class="{ active: selected == 'star2' }" @click="select">
      <img src="@/assets/in-love.png" />
    </label>
    <input type="radio" name="star" id="star3" />
    <label for="star3" :class="{ active: selected == 'star3' }" @click="select">
      <img src="@/assets/happy.png" />
    </label>
    <input type="radio" name="star" id="star4" />
    <label for="star4" :class="{ active: selected == 'star4' }" @click="select">
      <img src="@/assets/angry.png" />
    </label>
    <input type="radio" name="star" id="star5" />
    <label for="star5" :class="{ active: selected == 'star5' }" @click="select">
      <img src="@/assets/crying.png" />
    </label>
  </div>
</template>
<script>
export default {
  props: ["value"],
  data() {
    return {
        val: this.rating
    };
  },
  methods: {
    select(e) {
      this.$emit(
        "input",
        e.target.parentNode.getAttribute("for")[
          e.target.parentNode.getAttribute("for").length - 1
        ]
      );
    },
  },
  computed: {
    selected() {
        
      return "star" + this.value;
    },
  },
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.rating {
  position: relative;
  display: flex;
  flex-direction: row;
}
.rating input {
  display: none;
}
.rating label {
  position: relative;
  margin: 0 10px;
  width: 100;
  height: 128px;
  cursor: pointer;
  transition: 0.3s;
  filter: grayscale(1);
  text-align: center;
  opacity: 0.6;
}
.rating label img {
  width: 80px;
}
.rating:hover label {
  opacity: 0.2;
  width: 80px;
}

.rating input:hover + label {
  filter: grayscale(0);
  opacity: 1;
  width: 80px;
}
.active {
  opacity: 1 !important;
  filter: grayscale(0) !important;
}
.rating label:hover {
  opacity: 1;
  filter: grayscale(0);
}
</style>
