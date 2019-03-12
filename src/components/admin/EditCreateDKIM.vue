<template>
  <b-modal v-model="dVisible" 
           :title="`${opName} domain`"
           ok-title="Save"           
           header-bg-variant="info"
           centered
           @ok="onSave" 
           @cancel="onCancel"
           :ok-disabled="buttonDisabled"
           >
    <div class="d-block">
      <label for="domain">Domain</label>
      <b-form-input id="domain" v-model.trim="data.domain" required></b-form-input>

      <label for="selector">Selector</label>
      <b-form-input id="selector" v-model.trim="data.selector" required></b-form-input>

      <div class="my-2 keyHeader">
        <div>
          Private key
        </div>

        <div>
          <b-button @click="privateKeyVisible = !privateKeyVisible" 
                    :pressed="privateKeyVisible" class="mt-2" variant="outline-success" size="sm">Set</b-button>
        </div>
      </div>

      <b-form-textarea id="private_key"
                       v-if="privateKeyVisible" 
                       v-model="data.private_key"
                       placeholder="Enter private key"
                       :rows="5"
                       :max-rows="5">
      </b-form-textarea>      

      <div class="my-2 keyHeader">
        <div>
          Public key
        </div>

        <div>
          <b-button @click="publicKeyVisible = !publicKeyVisible" 
                    :pressed="privateKeyVisible" class="mt-2" variant="outline-success" size="sm">Set</b-button>
        </div>
      </div>

      <b-form-textarea id="public_key"
                       v-if="publicKeyVisible" 
                       v-model="data.public_key"
                       placeholder="Enter public key"
                       :rows="5"
                       :max-rows="5">
      </b-form-textarea>      

      <b-form-checkbox id="cbBlacklisted" 
                       v-model="data.is_blacklist"
                       >Blacklist</b-form-checkbox>

    </div>
  </b-modal>  
</template>

<script>
import ModalComponentMixin from './ModalComponentMixin.js'

export default {
name: "EditCreateDKIM",
  mixins: [ModalComponentMixin],
  props: {
    data: Object,
    opName: String // Add or Edit
  },  
  data () {
    return {
      privateKeyVisible: false,
      publicKeyVisible: false
    }
  },
  computed: {    
    buttonDisabled: function () {
      return !(this.data.domain)
    }
  },
  methods: {
    onShow () {   
      // reset key display flags   
      this.privateKeyVisible = false
      this.publicKeyVisible = false      
    }    
  }
}
</script>

<style>
.keyHeader {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.keyHeader div {
  margin-right: 10px;
}
</style>