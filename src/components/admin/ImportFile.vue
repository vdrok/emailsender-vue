<template>
  <b-modal v-model="dVisible" 
           :title="header"
           ok-title="Import"           
           header-bg-variant="info"
           centered
           @ok="onSave" 
           @cancel="onCancel"
           :ok-disabled="buttonDisabled">
    <div class="d-block">
      <b-form-file v-model="data" :state="Boolean(data)" placeholder="Choose a file..."></b-form-file>           
    </div>
  </b-modal>
</template>

<script>
import ModalComponentMixin from './ModalComponentMixin.js'

export default {
  name: 'ImportFile',
  mixins: [ModalComponentMixin],
  props: {
    header: String 
  },
  data () {
    return {
      data: false
    }
  },
  computed: {
    buttonDisabled: function () {
      return !Boolean(this.data)
    }
  }
}
</script>

