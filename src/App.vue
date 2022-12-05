<template>
  <nav-bar />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavBar from './components/NavBar.vue'

export default defineComponent({
  components: {
    NavBar
  }
})
</script>


<style lang="scss">
@import './styles/main.scss';
</style>
