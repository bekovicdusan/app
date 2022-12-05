<template>
  <div class="home-view">
    <contact-form v-if="showForm" />
    <div class="contacts">
      <div class="headline-wrapper">
        <h2 class="headline">Contacts</h2>
      </div>
      <div class="switch" v-if="(contacts.length > 0)">
        <font-awesome-icon class="icon toggle" icon="fa-address-card"/>
        <input class="input" type="checkbox" id="switch" @change="showListHandler" ref="checkboxRef" /><label for="switch" class="label">Toggle</label>
        <font-awesome-icon class="icon toggle" icon="fa-bars"/>
      </div>
      <loading-spinner v-if="!dataFetched" />
      <div class="data-wrapper" :class="{list: showList}" v-else>
        <div v-if="(contacts.length < 1)" class="no-contacts">
          No contacts found. Press the "Add Contact" button to save a new contact.
        </div>
        <contact-card v-else v-for="contact in contacts" :key="contact.id" :contact="contact" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, onUnmounted, ref } from 'vue'

import { IContactEntry } from '@/globals'
import store from '@/store'
import ContactForm from '../components/ContactForm.vue'
import ContactCard from '../components/ContactCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

import Localbase from 'localbase'

const db = new Localbase('db')

export default defineComponent({
  name: 'HomeView',
  components: {
    ContactForm,
    ContactCard,
    LoadingSpinner
  },
  setup () {
    // state values
    const showForm = computed(() => store.state.showForm)
    const contacts = computed(() => store.state.contacts)
    const showList = computed(() => store.state.showList)

    // other variables
    const checkboxRef = ref<HTMLInputElement>()
    const dataFetched = ref(false)

    const showListHandler = ():void => {
      store.commit('toggleShowList')
    }
    
    const getContacts = ():Promise<IContactEntry[]> => (db.collection('contacts').get())

    onMounted(() => {
      if (checkboxRef.value !== undefined) {
        checkboxRef.value.checked = showList.value
      }
      getContacts()
        .then(result => {
          store.commit('populateContacts', result)
          dataFetched.value = true
        }).catch(err => {
          throw err
        })
      
    })

    onUnmounted(() => {
      console.log(store.state.contacts)
      if (store.state.showForm === true) store.commit('toggleShowForm')
    })

    return {
      showForm,
      contacts,
      dataFetched,
      showList,
      checkboxRef,

      showListHandler,
      getContacts
    }
  }
});
</script>
