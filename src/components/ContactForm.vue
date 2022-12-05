<template>
  <div class="form-wrapper">
    <h3 class="form-headline">Contact Information</h3>
    <form @submit.prevent="addContact" class="form" :class="{invalid: !formValidity}">
      <div class="form-group">
        <div class="form-control" :class="{invalid: firstName.validity === 'invalid'}">
          <label class="form-label" for="first-name">
            First Name<sup class="required">*</sup>
          </label>
          <input
            class="form-input"
            type="text"
            name="first-name"
            @blur="validateInput(firstName, false)"
            v-model.trim="firstName.val"
            ref="firstNameRef"
          >
          <p class="error-msg" v-if="firstName.validity === 'invalid'">This field is required.</p>
        </div>
        <div class="form-control" :class="{invalid: lastName.validity === 'invalid'}">
          <label class="form-label" for="last-name">
            Last Name<sup class="required">*</sup>
          </label>
          <input
            class="form-input"
            type="text"
            name="last-name"
            @blur="validateInput(lastName, false)"
            v-model.trim="lastName.val"
          >
          <p class="error-msg" v-if="lastName.validity === 'invalid'">This field is required.</p>
        </div>
      </div>
      <div class="form-group">
        <div class="form-control" :class="{invalid: email.validity === 'invalid' || email.validity === 'invalid-email'}">
          <label class="form-label" for="email">
            E-mail<sup class="required">*</sup>
          </label>
          <input
            class="form-input"
            type="text"
            name="email"
            @blur="validateInput(email, true)"
            v-model.trim="email.val"
          >
          <p class="error-msg" v-if="email.validity === 'invalid'">This field is required.</p>
          <p class="error-msg" v-if="email.validity === 'invalid-email'">Please enter a valid e-mail address.</p>
        </div>
      </div>
      <div class="form-group">
        <div class="form-control" :class="{invalid: selectedCountry.validity === 'invalid'}">
          <label class="form-label" for="email">
            Country<sup class="required">*</sup>
          </label>
          <select
            class="form-input"
            v-model.trim="selectedCountry.val"
            @blur="validateInput(selectedCountry, false)"
          >
            <option v-for="(country, index) in countries" :key="index" :value="country">{{ country }}</option>
          </select>
          <p class="error-msg" v-if="selectedCountry.validity === 'invalid'">This field is required.</p>
        </div>
      </div>
      <button class="primary-button submit" type="submit" v-if="!isContactDetails" :disabled="(formValidity === false ? true : false)">Submit</button>
      <div class="actions" v-else>
        <button class="primary-button update" @click.prevent="updateContact" :disabled="(formValidity === false ? true : false)">Update</button>
        <router-link to="/" class="cancel">
          <button class="tertiary-button">Cancel</button>
        </router-link>
      </div>
    </form>
    <Teleport to="#app">
      <div class="modal-overlay" v-if="showModal" @click="(showModal = false)"></div>
    </Teleport>
    <Teleport to="#app">
      <div class="modal" v-if="showModal">
        <h4>You haven't made any changes</h4>
        <div class="actions">
          <button class="primary-button" @click="(showModal = false)">Ok</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, PropType, computed, onMounted } from 'vue'

import { IContactEntry, IInputFields } from '../globals'
import store from '@/store'
import router from '@/router'

import { getNames } from 'country-list'
import Localbase from 'localbase'

const db = new Localbase('db')

export default defineComponent({
  name: 'ContactForm',
  props: {
    contact: {
      type: Object as PropType<IContactEntry>,
      required: false
    }
  },
  setup(props) {
    //contact information data
    const firstName = reactive({
      val: props.contact ? props.contact.firstName : '',
      validity: props.contact ? 'valid' : 'pending'
    })
    const lastName = reactive({
      val: props.contact ? props.contact.lastName : '',
      validity: props.contact ? 'valid' : 'pending'
    })
    const selectedCountry = reactive({
      val: props.contact ? props.contact.country : '',
      validity: props.contact ? 'valid' : 'pending'
    })
    const email = reactive({
      val: props.contact ? props.contact.email : '',
      validity: props.contact ? 'valid' : 'pending'
    })

    //validation variables
    const formValidity = ref(false)
    
    //other variables
    const countries = ref<string[]>(getNames())
    const isContactDetails = computed(() => store.state.isContactDetails)
    const firstNameRef = ref<HTMLInputElement>()
    const showModal = ref(false)

    const addContact = ():void => {
      const entry: IContactEntry = {
        id: Date.now(),
        firstName: firstName.val,
        lastName: lastName.val,
        email: email.val,
        country: selectedCountry.val
      }

      db.collection('contacts').add(entry)
      store.commit('toggleShowForm')
      store.commit('addNewEntry', entry)
    }

    const updateContact = ():void => {
      // check to prevent unnecessary calls to db
      if (firstName.val !== props.contact?.firstName ||
          lastName.val !== props.contact?.lastName ||
          email.val !== props.contact?.email ||
          selectedCountry.val !== props.contact?.country) {
        if (props.contact) {
          db.collection('contacts').doc({ id: +props.contact.id }).update({
            firstName: firstName.val,
            lastName: lastName.val,
            email: email.val,
            country: selectedCountry.val
          }).then((res:object) => {
            console.log(res)
            router.push('/')
          }).catch((err:object) => {
            throw err
          })
        }
      } else {
        showModal.value = true
      }
    }

    // validation logic
    const validateInput = (input: IInputFields, email: boolean):void => {
      if (input.val === '') {
        input.validity = 'invalid'
      } else {
        input.validity = 'valid'
      }
      // email validation logic
      if (email) {
        if (input.val === '') {
          input.validity = 'invalid'
        } else {
          if (input.val?.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            input.validity = 'valid'
          } else {
            input.validity = 'invalid-email'
          }
        }
      }
      validateForm()
    }

    // validate entire form
    const validateForm = ():void => {
      if (
        firstName.validity === 'valid' &&
        lastName.validity === 'valid' &&
        email.validity === 'valid' &&
        selectedCountry.validity === 'valid'
      ) {
        formValidity.value = true
      } else formValidity.value = false
    }

    onMounted(() => {
      validateForm()
      if (firstNameRef.value !== undefined && !props.contact) {
        firstNameRef.value.focus()
      }
    })

    return {
      countries,
      firstName,
      lastName,
      email,
      selectedCountry,
      isContactDetails,
      firstNameRef,
      formValidity,
      showModal,

      addContact,
      updateContact,
      validateInput
    }
  },
})
</script>
