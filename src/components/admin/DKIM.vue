<template>
  <b-container class="mt-5">
    <!-- Header row -->
    <b-row class="row-12 flex-container">
      <b-col class="col-8 flex-wide">
          <h1>Domains</h1>
      </b-col>
      <b-col class="col-4 text-right">
        <b-button @click="addItem"
                  class="mt-2">
          Add domain
        </b-button>
      </b-col>
    </b-row>

    <!-- Domains -->
    <b-row class="row-12 mt-4" >
      <b-col v-if="data.length === 0" class="py-3 text-center">
        <h5>There are no domains added</h5>
      </b-col>

      <b-col v-else>
        <b-table :items="data" small :fields="fields" tbody-tr-class="servers-tr-class" sort-by="server_ip">
          <template slot="is_blacklist" slot-scope="data">          
            {{ getB(data.item.is_blacklist) }}
          </template>

          <template slot="updated_at" slot-scope="data">          
            {{ (new Date(data.item.updated_at)).toUTCString() }}
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

    <EditCreateDKIM :data="modalData" 
                    :visible="modalVisible"
                    :opName="modalOp"
                    @save="saveItem"
                    @cancel="modalVisible = false">
    </EditCreateDKIM>

  </b-container>
</template>

<script>
import DKIMService from '../../services/webmailDKIMService.js'
import EditCreateDKIM from './EditCreateDKIM'
import WebmailDKIMMixin from './WebMailDKIMMixin.js'
import GetBMixin from './GetBMixin.js'

export default {
  name: 'DKIM',
  components: { EditCreateDKIM },
  mixins: [GetBMixin, WebmailDKIMMixin],      
  data () {
    return {
      fields: [
        { key: 'domain', label: 'Domain', sortable: true },
        { key: 'is_blacklist', label: 'Blacklist', sortable: true },
        { key: 'updated_at', label: 'Updated', sortable: true },                
        { key: 'actions', label: ' ', sortable: false }
      ]
    }
  },
  created () {
    this.svc = new DKIMService('dkim-key')
  },
  methods: {
    getNewItem () {
      return {
        domain: '',
        private_key: '',
        public_key: '',
        selector: '',
        is_blacklist: false
      }
    },
    extractData (data) {
      return data.dkim_keys
    }
  }
}
</script>

