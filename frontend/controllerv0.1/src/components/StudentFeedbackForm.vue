<template>
  <v-card class="ma-3" width="100%">
    <v-container>
      <v-row>
        <v-col cols="5">
          <v-form ref="form" v-model="valid">
            <v-textarea
              rows="1"
              prepend-icon="mdi-comment"
              auto-grow
              row-height="15"
              label="Mon ressenti sur ma course..."
              v-model="newComment"
              :rules="[(v) => v.length > 0 || 'Un commentaire est requis']"
            >
            </v-textarea>
          </v-form>
        </v-col>
        <v-col></v-col>
        <v-col cols="5" class="text-center">
          <v-rating
            v-model="newRating"
            background-color="primary lighten-3"
            color="primary"
            large
          ></v-rating>
        </v-col>
      </v-row>
      <v-card-actions class="justify-center"
        ><v-btn :disabled="!valid" @click="sendForm"
          >Envoyer</v-btn
        ></v-card-actions
      >
    </v-container>
  </v-card>
</template>

<script>
import axios from "axios";
export default {
  props: ["rating", "comment"],
  data() {
    return {
      valid: false,
      newRating: this.rating,
      newComment: this.comment,
    };
  },
  watch: {
    rating: function (val) {
      this.newRating = val;
    },
    comment: function (val) {
      this.newComment = val;
    },
  },
  methods: {
    async sendForm() {
      console.log("send");
      try {
        await axios.post(
          `/api/runs/${this.$route.params.session_id}/${this.$route.params.student_id}`,
          {
            comment: this.newComment,
            rating: this.newRating,
          }
        );
        this.$emit("success");
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>