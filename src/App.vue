<template>
  <div id="app">
    <header-super v-if="isLggedIn"></header-super>
    <router-view></router-view>
    <ToastPanel></ToastPanel>  
  </div>
</template>

<script>
import ToastPanel from './components/toast/ToastPanel'

export default {
  name: 'App',
  components: {
    ToastPanel
  },
  computed:{
    isLggedIn(){
        return this.$store.state.authentication.status.loggedIn
    }
  }
}
</script>
