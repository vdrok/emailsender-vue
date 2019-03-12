<template>
  <b-modal v-model="dVisible" 
           :title="`${opName} ${itemName} servers list`"
           ok-title="Save"           
           header-bg-variant="info"
           centered
           @ok="onSave" 
           @cancel="onCancel"
           :ok-disabled="buttonDisabled"
           >
    <div class="d-block">
      <label for="name">Name</label>
      <b-form-input id="name" v-model.trim="data.name" required></b-form-input>

      <label for="description">Description</label>
      <b-form-input id="description" v-model.trim="data.description" required></b-form-input>

      <div v-if="addFields">
        <br/>

        <b-form-checkbox id="cbShare" 
                        v-model="data.share"
                        >Share</b-form-checkbox>

        <br/>

        <label for="description">Cost to send</label>
        <b-form-input id="description" v-model="data.cost_send" required type="number"></b-form-input>
      </div>
    </div>
  </b-modal>  
</template>

<script>
import ModalComponentMixin from './ModalComponentMixin.js'

export default {
name: "EditCreateServerList",
  mixins: [ModalComponentMixin],
  props: {
    data: Object,
    opName: String, // Add or Edit
    itemName: String, // SMTP or SOCKS
    addFields: Boolean
  },  
  computed: {    
    buttonDisabled: function () {      
      return (this.addFields) 
        ? !(this.data.name && this.data.cost_send && (Number(this.data.cost_send) >= 0))
        : !this.data.name
    }
  }
}
</script>
