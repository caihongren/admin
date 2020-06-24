<template>
  <div id="app" :data-color="dataColor">
    <router-view />
  </div>
</template>

<script>
import { themeStyle } from "./api/user.js";
import store from "./store/index.js";
export default {
  name: "App",
  data() {
    return {
      dataColor: "DEFAULT"
    };
  },
  computed: {
    getcolor() {

      return this.$store.state.color;
    }
  },
  watch: {
    getcolor() {
      console.log("主题变了",this.$store.state.color);
      this.dataColor = this.$store.state.color;
    }
  },
  methods: {
    setcolor() {
      themeStyle().then(res => {
        if (res.code == 0) {
          this.$store.state.color = res.data;
        }
      });
    }
  },
  created() {
    this.setcolor();
  }
};
</script>
