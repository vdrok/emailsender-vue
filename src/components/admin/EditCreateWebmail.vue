<template>
  <b-modal v-model="dVisible" 
           :title="`${opName} webmail`"
           ok-title="Save"           
           header-bg-variant="info"
           centered
           @ok="onSave" 
           @cancel="onCancel"
           :ok-disabled="buttonDisabled"
           >
    <div class="d-block">
      <b-form-checkbox id="cbValid" 
                       v-model="data.valid"
                       >Valid</b-form-checkbox>

      <br/>
      
      <label for="serverType">Server type</label>
      <b-form-radio-group id="serverType" v-model="data.server_type" variant="primary" :options="serverTypeRadio">
      </b-form-radio-group>

      <label for="serverIP">Server IP address</label>
      <b-form-input id="serverIP" v-model.trim="data.server_ip" required></b-form-input>

      <label for="serverPort">Server port</label>
      <b-form-input id="serverPort" v-model.trim="data.server_port" required type="number"></b-form-input>

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
name: "EditCreateWebmail",
  mixins: [ModalComponentMixin],
  props: {
    data: Object,
    opName: String // Add or Edit
  },  
  data () {
    return {
      serverTypeRadio: [
        { text: 'IMAP', value: 'imap' },
        { text: 'POP3', value: 'pop3' },
      ]
    }
  },
  computed: {    
    buttonDisabled: function () {
      return !(this.data.server_ip && this.data.server_user && this.data.server_pass)
    }
  }
}
</script>
