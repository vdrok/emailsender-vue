import { store } from  '../../vuex'

export default {
  info (text) {
    store.commit('toasts/add', { type: 'info', text: text })              
  },
  error (text) {
    store.commit('toasts/add', { type: 'error', text: text })              
  },
  custom (header, text) {
    store.commit('toasts/add', { type: 'custom', text: text, customHeader: header })          
  }
}