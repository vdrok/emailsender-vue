<template>
  <b-modal v-model="dVisible" 
           :title="'Check blacklist for ' + ip"
           @ok="onOK" 
           header-bg-variant="info"
           centered
           ok-only
           size="xl"
           :ok-disabled="inRequest">
    <div v-if="inRequest" class="spinner-container">
      <div class="spinner-border text-primary spinner" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-else class="table-container">
      <b-table :items="data.blacklists" :fields="fields" small tbody-tr-class="servers-tr-class" sort-by="provider">
        <template slot="blacklist" slot-scope="data">
          <div style="text-align: center">{{ getB(data.item.blacklist) }}</div>
        </template>
      </b-table>
    </div>
  </b-modal> 
</template>

<script>
import GetBMixin from './GetBMixin.js'
import tst from './../toast/Toasts.js'

export default {
  name: 'BlackListCheck',
  mixins: [GetBMixin],  
  props: {
    ip: String,
    listID: String,
    serverID: String,
    backend: Object,    
    visible: Boolean
  },
  data () {
    return {
      blSvc: null,      
      inRequest: false,
      data: {
        blacklists: []
      },
      fields: [
        { key: 'provider', label: 'Provider', sortable: true },
        { key: 'response', label: 'Response', sortable: false },
        { key: 'bl_detail', label: 'Details', sortable: false },
        { key: 'blacklist', label: 'Blacklisted', sortable: false }
      ]
    }
  },  
  computed: {
    dVisible: {
      get: function () {
        return this.visible
      },
      set: function (val) {
        if (val) {
          this.inRequest = true

          this.backend.checkBlackList(this.listID, this.serverID)
            .then((data) => {
              this.inRequest = false
              this.data = data
            },
            error => {
              console.log(error)
              this.inRequest = false
              tst.error(error)
            })
        } else {
          this.onOK()
        }
      }
    }
  },
  methods: {
    onOK () {
      this.$emit('cancel')      
    }
  }
}
</script>

<style>
.spinner-container {
  height: 200px;
  position: relative;
}
.spinner {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -24px; 
  margin-top: -24px;  
}
.table-container {
  height: 500px; 
  overflow-y: scroll;
}
</style>

