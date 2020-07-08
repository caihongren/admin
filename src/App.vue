<template>
  <div id="app" :data-color="dataColor">
    <router-view />
  </div>
</template>

<script>
import { themeStyle } from './api/user.js'
// import store from './store/index.js'
export default {
  name: 'App',
  data() {
    return {
      dataColor: 'DEFAULT'
    }
  },
  computed: {
    getcolor() {
      console.log(this.$store.state.color, '1111')
      return this.$store.state.color
    }
  },
  watch: {
    getcolor() {
      this.dataColor = this.$store.state.color
    }
  },
  created() {
    this.setcolor()
  },
  methods: {
    setcolor() {
      themeStyle().then(res => {
        if (res.code == 0) {
          this.$store.state.color = res.data
        }
      })
    }
  }
}
</script>
