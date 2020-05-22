<template>
  <div id="app" :data-color='dataColor'> 
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      dataColor:'black',
    }
  },
}
</script>
