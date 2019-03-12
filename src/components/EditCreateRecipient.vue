<template>
  <b-modal v-model="dVisible" 
           :title="`${opName} recipient`"
           ok-title="Save"           
           header-bg-variant="info"
           centered
           @ok="onSave" 
           @cancel="onCancel"
           :ok-disabled="buttonDisabled"
           >
    <div class="d-block">
      <label for="first_name">First name</label>
      <b-form-input id="first_name" v-model.trim="data.first_name" required></b-form-input>
      <label for="last_name">Last name</label>
      <b-form-input id="last_name" v-model.trim="data.last_name" required></b-form-input>
      <label for="email">Email address</label>
      <b-form-input id="email" v-model.trim="data.email" required></b-form-input>
      <b-form-checkbox id="cbBlacklisted" 
                       v-model="status"
                       >Blacklist</b-form-checkbox>
    </div>
  </b-modal>  
</template>

<script>
import ModalComponentMixin from './admin/ModalComponentMixin.js'

export default {
name: "EditCreateRecipient",
  mixins: [ModalComponentMixin],
  props: {
    data: Object,
    opName: String // Add or Edit
  },  
  computed: {    
    buttonDisabled: function () {
      return !(this.data.first_name && this.data.last_name && this.data.email)
    },
    status: {
      get: function () {
        return this.data.contact_status === 'Subscribed'
      },
      set: function (val) {
        this.data.contact_status = val ? 'Subscribed' : 'Unsubscribed'
      }
    }
  }
}
</script>
