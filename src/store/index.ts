import { createStore } from 'vuex'
import { IContactEntry } from '@/globals'

export default createStore({
  state: {
    contacts: [] as IContactEntry[],
    showForm: false,
    showList: false,
    isContactDetails: false
  },
  mutations: {
    toggleShowForm (state) {
      state.showForm = !state.showForm
    },
    toggleIsContactDetails (state) {
      state.isContactDetails = !state.isContactDetails
    },
    toggleShowList (state) {
      state.showList = !state.showList
    },
    addNewEntry (state, payload: IContactEntry) {
      state.contacts = [...state.contacts, payload]
    },
    deleteEntry (state, payload) {
      state.contacts = state.contacts.filter(contact => contact.id !== payload)
    },
    populateContacts (state, payload: IContactEntry[]) {
      state.contacts = [...payload]
    }
  },
})
