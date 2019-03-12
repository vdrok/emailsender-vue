<template>
  <b-modal v-model="dVisible" 
           :title="`${opName} ${itemName} server`"
           ok-title="Save"           
           header-bg-variant="info"
           centered
           @ok="onSave" 
           @cancel="onCancel"
           :ok-disabled="buttonDisabled"
           >
    <div class="d-block">
      <b-form-checkbox id="cbActive" 
                       v-model="data.active"
                       >Active</b-form-checkbox>

      <br/>

      <b-form-checkbox id="cbBlacklisted" 
                       v-model="data.blacklist"
                       >Blacklist</b-form-checkbox>

      <br/>                       

      <label for="serverIP">Server IP address</label>
      <b-form-input id="serverIP" v-model.trim="data.server_ip" required></b-form-input>

      <label for="serverUser">Username</label>
      <b-form-input id="serverUser" v-model.trim="data.server_user" required></b-form-input>

      <label for="serverPass">Password</label>
      <b-form-input id="serverPass" v-model.trim="data.server_pass" type="password" required></b-form-input>

    </div>
  </b-modal>  
</template>

<script>
import ModalComponentMixin from './ModalComponentMixin.js'

export default {
name: "EditCreateServer",
  mixins: [ModalComponentMixin],
  props: {
    data: Object,
    opName: String, // Add or Edit
    itemName: String // SMTP or SOCKS
  },  
  computed: {    
    buttonDisabled: function () {
      return !(this.data.server_ip && this.data.server_user && this.data.server_pass)
    }
  }
}
</script>
