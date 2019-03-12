<template>
  <div class="toast toast-main" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header text-white" :class="headerClass">
      
      <strong class="mr-auto">{{ header }}</strong>
      
      <button type="button" class="ml-2 mb-1 close text-white" @click="close()" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="toast-body" >
      {{ data.text }}
    </div> 
  </div>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    data: Object
  },
  computed: {
    header: function () {
      return (this.data.type === 'error') 
        ? 'Error'
        : (this.data.type === 'info')
          ? 'Info'
          : this.data.customHeader
    },
    headerClass: function () {
      return {
        'error': this.data.type === 'error',
        'info': this.data.type === 'info',
        'custom': (this.data.type !== 'error') && (this.data.type !== 'info')
      }
    }
  },
  methods: {
    close () {
      this.$store.commit('toasts/close', this.data.id)
    }
  }
}
</script>

<style>
div.toast-main {
  background-color: #f5f5f5; 
  opacity: 0.95;
}
div.error {
  background-color: #dc3545;
}
div.info {
  background-color: #28a745;
}
div.custom {
  background-color: #6c757d;
}
</style>

