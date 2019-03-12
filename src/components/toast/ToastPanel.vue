<template>
  <div class="main">  
    <Toast v-for="t in $store.state.toasts.toasts"
           :key="t.id"
           :data="t">
    </Toast>
  </div>
</template>

<script>
import Toast from './/Toast'

export default {
  name: 'Toasts',
  components: {
    Toast
  }
}
</script>

<style>
div.main {
  position: absolute; 
  top: 65px; 
  right: 10px; 
  z-index: 10000; 
  width: 300px;   
  opacity: 1;
}
</style>

