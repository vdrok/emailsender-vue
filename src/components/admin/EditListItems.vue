<template>
  <b-container class="mt-5">
    <!-- Header row -->
    <b-row class="row-12 flex-container">
      <b-col class="col-8 flex-wide">
          <h1>{{ header }}</h1>
      </b-col>
      <b-col class="flex-short col-4 text-right pb-1">
        <b-button @click="fileModalVisible = true">Import</b-button>    
        <b-button @click="exportServers(id)" :disabled="servers.length === 0">Export</b-button>              
      </b-col>
    </b-row>

    <!-- Servers list header-->
    <b-row class="row-12 mt-4">
      <b-col class="col-6">
        <!--<h3>{{ this.listName }}</h3>-->
          <b-input-group class="left-addon ml-2">
            <font-awesome-icon icon="search" />
            <b-form-input placeholder="Find server by ip" v-model="findString"></b-form-input>
        </b-input-group>                 
      </b-col>
      <b-col class="col-6 text-right">
        <b-button @click="addServer"
                  class="mt-2">
          Add {{ headerItem }} server
        </b-button>
      </b-col>
    </b-row>

    <!-- Servers list -->
    <b-row class="row-12 mt-4" >
      <b-col v-if="servers.length === 0" class="py-3 text-center">
        <h5>There are no servers added</h5>
      </b-col>

      <b-col v-else>

        <b-table :items="filteredList" :fields="serverFields" small tbody-tr-class="servers-tr-class" sort-by="server_ip">
          <template slot="active" slot-scope="data">
            {{ getB(data.item.active) }}
          </template>

          <template slot="blacklist" slot-scope="data">
            {{ getB(data.item.blacklist) }}
          </template>

          <template slot="updated_at" slot-scope="data">
            {{(new Date(data.item.updated_at)).toUTCString()}}            
          </template>

          <template slot="actions" slot-scope="data">
            <div class="text-right">
              <b-dropdown split @click="editServer(data)" text="Edit" class="my-2">
                <!--
                <b-dropdown-item v-if="data.item.blacklist && data.item.id" @click="blackListInfo(data.item)">Blacklist</b-dropdown-item>
                <b-dropdown-divider v-if="data.item.blacklist && data.item.id"></b-dropdown-divider>
                -->
                <b-dropdown-item @click="blackListInfo(data.item)">Blacklist</b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item @click="deleteServer(data)">Delete</b-dropdown-item>                
              </b-dropdown>                
            </div>
          </template>
        </b-table>
      </b-col>
    </b-row>

    <EditCreateServer :data="modalData" 
                      :visible="modalVisible"
                      :opName="modalOp"
                      :itemName="headerItem"
                      @save="saveServer"
                      @cancel="modalVisible = false">
    </EditCreateServer>

    <ImportFile :visible="fileModalVisible"
                header="Import servers list"
                @save="importServers"
                @cancel="fileModalVisible = false">
    </ImportFile>

    <BlackListCheck :visible="blCheckVisible"
                    :backend="backend"
                    :ip="blServerIP"
                    :listID="id"
                    :serverID="blServerID"
                    @cancel="blCheckVisible = false">
    </BlackListCheck>
  </b-container>
</template>

<script>
import * as util from '../../helpers/util.js'
import EditCreateServer from './EditCreateServer.vue'
import ImportFile from './ImportFile.vue'
import BlackListCheck from './BlackListCheck'
import GetBMixin from './GetBMixin.js'
import tst from './../toast/Toasts.js'

export default {
  name: "EditCreateList",
  mixins: [ GetBMixin ],
  components: {
    EditCreateServer,
    ImportFile,
    BlackListCheck
  },
  props: {
    id: String,
    backend: Object,
    headerItem: String,
    serversProp: String,
    baseURL: String
  },
  data () {
    return {
      listName: '',
      servers: [],
      modalVisible: false,
      modalIdx: -1,
      modalOp: '',
      modalData: {},
      serverFields: [
        { key: 'server_ip', label: 'Server IP', sortable: true },
        { key: 'server_user', label: 'Username', sortable: true },
        { key: 'active', label: 'Active', sortable: true },
        { key: 'blacklist', label: 'Blacklist', sortable: true },
        { key: 'updated_at', label: 'Last update', sortable: true },        
        { key: 'actions', label: ' ', sortable: false }
      ],
      fileModalVisible: false,
      blCheckVisible: false,
      blServerIP: '',
      blServerID: '',
      findString: ''
    }
  },
  mounted () {
    this.refresh()
  },
  computed: {
    header: function () {
      //return 'Edit "' + this.headerItem + ' server list'
      return 'Edit "' + this.listName + '"'
    },
    filteredList: function(){      
      return this.findString 
        ? this.servers.filter((str) => {
            return str.server_ip.toLowerCase().indexOf(this.findString.toLowerCase()) > -1;
        })
        : this.servers
    }
  },
  methods: {
    addServer () {
      this.modalOp = 'Add'
      this.modalIdx = -1

      this.modalData = {
        active: true,
        blacklist: false,
        server_ip: '',
        server_user: '',
        server_pass: ''
      }

      this.modalVisible = true
    },
    editServer (item) {
      let idx = this.servers.indexOf(item.item)

      // to avoid inline edit we clone object
      this.modalData = util.cloneObject(this.servers[idx])
      this.modalOp = 'Edit'
      this.modalIdx = idx
      this.modalVisible = true      
    },
    deleteServer (item) {
      let idx = this.servers.indexOf(item.item)

      this.backend.deleteItem(this.id, this.servers[idx].id)        
        .then(data => {
          // and on success remove from servers list
          this.servers.splice(idx, 1)            
        },
        error => {
          tst.error(error)
        })
    },
    saveServer (data) {
      this.modalVisible = false
      
      if (this.modalIdx >= 0) {
        this.backend.updateItem(this.id, data) 
          .then(reply => {
            this.$set(this.servers, this.modalIdx, reply)
          },
          error => {
            tst.error(error)
          })
      } else {
        // add new       
        this.backend.createItem(this.id, data)
          .then(reply => {
            this.servers.push(reply)              
          },
          error => {
            tst.error(error)
          })
      }
    },   
    importServers (file) {
      this.backend.importList(this.id, file)
        .then((data) => {
          tst.info(`${data.total} item(s) were successfully imported`)

          // refresh
          this.refresh()
        },
        error => {
          tst.error(error)
        })              
    },
    exportServers (id) {
      this.backend.exportList(id)
        .then((data) => {
          let link = document.createElement('a')
          // filename
          link.setAttribute('download', this.listName + '.csv')
          // url
          link.setAttribute('href', window.URL.createObjectURL(new Blob([data], { type: 'text/csv' })))
          link.click()
        },
        error => {
          tst.error(error)
        })              
    },
    refresh () {
      // Get data from backend
      this.backend.getListById(this.id)
        .then((data) => {
          this.listName = data.name

          // now we need to enum all servers
          this.backend.enumItems(this.id)
            .then(data => {
              this.servers = data[this.serversProp]

              if (!this.servers)
                this.servers = []
            },
            error => {
              tst.error(error)
            })
        },
        error => {
          tst.error(error)
        })
    },
    blackListInfo (server) {
      this.blServerIP = server.server_ip
      this.blServerID = server.id
      this.blCheckVisible = true
    }
  }
}
</script>

