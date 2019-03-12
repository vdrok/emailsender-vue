<template>
  <div v-if="active" class="overlay">
    <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<style>
div.overlay-wrapper {
  position: relative;
}
div.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  background:rgb(200, 200, 200);  
  opacity:0.5;  
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<script>
export default {
  name: 'OverlayProgress',
  props: {
    active: {
      type: Boolean,
      default: true
    }
  }
}
</script>
