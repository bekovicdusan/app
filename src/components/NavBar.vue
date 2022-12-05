<template>
  <div class="nav-wrapper">
    <nav class="navbar">
      <router-link to="/" class="nav-item home">
        <img class="vue-logo" alt="Vue logo" src="../assets/logo.png" />
        <span class="logo-text">MyAddressBook</span>
      </router-link>
      <button class="primary-button" @click="handleClick" v-if="!isContactDetails"><font-awesome-icon class="icon" icon="fa-address-book"/>Add Contact</button>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

import store from '@/store'

export default defineComponent({
  name: 'NavBar',
  setup () {
    // used for dynamically displaying the `add contact` button
    const isContactDetails = computed(() => store.state.isContactDetails)

    const handleClick = ():void => {
      store.commit('toggleShowForm')
    }

    return {
      isContactDetails,

      handleClick
    }
  }
})
</script>
