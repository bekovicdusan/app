<template>
  <div class="contact-details-view">
    <loading-spinner v-if="!dataFetched" />
    <contact-form v-else :contact="contact" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'

import { IContactEntry } from '@/globals'
import store from '@/store'
import ContactForm from '../components/ContactForm.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

import Localbase from 'localbase'
const db = new Localbase('db')

export default defineComponent({
  name: 'ContactDetails',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: {
    ContactForm,
    LoadingSpinner
  },
  setup (props) {
    const contact = ref<IContactEntry>()
    const dataFetched = ref(false)

    const fetchContact = ():Promise<IContactEntry> => (db.collection('contacts').doc({ id: +props.id }).get())
    
    onMounted(() => {
      store.commit('toggleIsContactDetails')

      fetchContact()
        .then(result => {
          dataFetched.value = true
          contact.value = result
        })
        .catch(err => {
          throw err
        })
    })

    onUnmounted(() => {
      store.commit('toggleIsContactDetails')
    })

    return {
      dataFetched,
      contact
    }
  }
})
</script>
