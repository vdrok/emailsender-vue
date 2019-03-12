<template>
  <b-container class="mt-5">
    <!-- Header row -->
    <b-row class="row-12 flex-container">
      <b-col class="col-8 flex-wide">
          <h1>Webmails</h1>
      </b-col>
      <b-col class="col-4 text-right">
        <b-button @click="addItem"
                  class="mt-2">
          Add Webmail
        </b-button>
      </b-col>
    </b-row>

    <!-- Webmails -->
    <b-row class="row-12 mt-4" >
      <b-col v-if="data.length === 0" class="py-3 text-center">
        <h5>There are no webmails added</h5>
      </b-col>

      <b-col v-else>
        <b-table :items="data" small :fields="fields" tbody-tr-class="servers-tr-class" sort-by="server_ip">
          <template slot="valid" slot-scope="data">
            {{ getB(data.item.valid) }}
          </template>

          <template slot="actions" slot-scope="data">
            <div class="text-right">
              <b-dropdown split @click="editItem(data)" text="Edit" class="my-2">
                <b-dropdown-item @click="deleteItem(data)">Delete</b-dropdown-item>
              </b-dropdown>                
            </div>
          </template>
        </b-table>
      </b-col>
    </b-row>

    <EditCreateWebmail :data="modalData" 
                       :visible="modalVisible"
                       :opName="modalOp"
                       @save="saveItem"
                       @cancel="modalVisible = false">
    </EditCreateWebmail>

  </b-container>
</template>

<script>
import GetBMixin from './GetBMixin.js'
import WebMailService from '../../services/webmailDKIMService.js'
import EditCreateWebmail from './EditCreateWebmail'
import WebmailDKIMMixin from './WebMailDKIMMixin.js'

export default {
  name: 'Webmails',
  components: { EditCreateWebmail },
  mixins: [GetBMixin, WebmailDKIMMixin],    
  data () {
    return {
      fields: [
        { key: 'server_ip', label: 'Server IP', sortable: true },
        { key: 'server_port', label: 'Server port', sortable: true },
        { key: 'server_user', label: 'Username', sortable: true },
        { key: 'server_type', label: 'Type', sortable: true },
        { key: 'valid', label: 'Valid', sortable: true },        
        { key: 'actions', label: ' ', sortable: false }
      ]
    }
  },
  created () {
    this.svc = new WebMailService('webmails')
  },
  methods: {
    getNewItem () {
      return {
        valid: true,
        server_ip: '',
        server_port: 25,        
        server_user: '',
        server_pass: '',
        server_type: 'imap'
      }
    },
    extractData (data) {
      return data.webmails
    }    
  }
}
</script>

