<template>
  <router-link :to="{name: 'ContactDetails', params:{id: contact?.id}}" class="contact-card-container">
    <div class="contact-info">
      <span class="contact-name">{{contact?.firstName}} {{contact?.lastName}}</span>
      <span class="contact-email">{{ contact?.email }}</span>
    </div>
    <div class="contact-country">
      <span>
        {{ contact?.country }}
      </span>
    </div>
    <div class="actions">
      <font-awesome-icon class="icon edit" icon="fa-pen-to-square"/>
      <font-awesome-icon @click.prevent="(showModal = true)" class="icon delete" icon="fa-trash"/>
    </div>
    <font-awesome-icon class="bg-user" icon="fa-user"/>
    <Teleport to="#app">
      <div class="modal-overlay" v-if="showModal" @click="showModal = false"></div>
    </Teleport>
    <Teleport to="#app">
      <div class="modal" v-if="showModal">
        <h3>Do you want to delete <br/><span class="contact">{{ contact.firstName }} {{ contact.lastName }}</span>?</h3>
        <p class="rights">This action cannot be undone.</p>
        <div class="actions">
          <button class="primary-button" @click="deleteContact">Yes</button>
          <button class="tertiary-button" @click="showModal = false">Cancel</button>
        </div>
      </div>
    </Teleport>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'

import { IContactEntry } from '../globals'
import store from '@/store'

import Localbase from 'localbase'
const db = new Localbase('db')

export default defineComponent({
  name: 'ContactCard',
  props: {
    contact: {
      type: Object as PropType<IContactEntry>,
      required: true
    }
  },
  setup(props) {
    const showModal = ref(false)
    
    // contact deletion logic
    const deleteContact = ():void => {
      db.collection('contacts').doc({ id: +props.contact.id }).delete()
      showModal.value = false
      store.commit('deleteEntry', props.contact.id)
    }

    return {
      showModal,

      deleteContact
    }
  },
})
</script>
