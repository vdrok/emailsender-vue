<template>
  <b-container class="mt-5">
    <!-- Header row -->
    <b-row class="row-12">
      <b-col class="col-6">
          <h1>{{ itemName }} servers lists</h1>
      </b-col>
      <b-col class="col-6 text-right">
          <!--<b-button class="my-2" :to="ownPath + '/new'" variant="outline-info">-->
          <b-button class="my-2" @click="addList()" variant="outline-info">
            Create {{ itemName }} servers list
          </b-button>
      </b-col>
    </b-row>

    <b-row class="row-12">
      <b-col class="col-6">
        <b-input-group class="left-addon ml-2">
            <font-awesome-icon icon="search" />
            <b-form-input placeholder="Find list by name" v-model="findString"></b-form-input>
        </b-input-group>         
      </b-col>
      <b-col class="col-6 text-right">
        Sort mode
        <b-dropdown :text="sortModeText[sortMode]" class="ml-2 my-2 addBorder" variant="outline">
            <b-dropdown-item @click="sortMode = 0">Name</b-dropdown-item>
            <b-dropdown-item @click="sortMode = 1">Newest first</b-dropdown-item>
            <b-dropdown-item @click="sortMode = 2">Oldest first</b-dropdown-item>
        </b-dropdown>
      </b-col>
    </b-row>    

    <div v-if="sortedFilteredList.length > 0">
      <b-table :items="sortedFilteredList" :fields="fields" small tbody-tr-class="servers-tr-class" sort-by="name">
        <template slot="placeholder" slot-scope="data">
          <div class="noPreview"></div>
        </template>

        <template slot="name_date" slot-scope="data">
          <div class="templateName"><router-link :to="ownPath + '/' + data.item.id">{{ data.item.name }}</router-link></div>
          <div>Edited {{(new Date(data.item.updated_at)).toUTCString()}} by {{ userName(data.item.owner_id) }}</div>
        </template>

        <template slot="actions" slot-scope="data">
          <div class="text-right">
            <b-dropdown split @click="viewList(data.item.id)" text="View" class="my-2">
              <b-dropdown-item @click="editList(data)">Edit</b-dropdown-item>
              <b-dropdown-item @click="deleteList(data.item.id)">Delete</b-dropdown-item>
              <b-dropdown-divider></b-dropdown-divider>                    
              <b-dropdown-item @click="importServers(data.item.id)">Import list</b-dropdown-item>                  
              <b-dropdown-item @click="exportServers(data.item.id)">Export list</b-dropdown-item>
            </b-dropdown>                
          </div>
        </template>
      </b-table>
    </div>

    <div v-else class="py-5 text-center">
      <h5 v-if="lists.length === 0">No lists created</h5>
      <h5 v-else>No lists matching search criteria</h5>
    </div>

    <b-pagination v-if="loaded && (total > limit)" class="mt-3" align="center" :total-rows="total" v-model="currentPage" :per-page="limit">
    </b-pagination>

    <EditCreateServerList :data="modalData" 
                          :visible="modalVisible"
                          :opName="modalOp"
                          :itemName="itemName"
                          :addFields="addFields"
                          @save="saveList"
                          @cancel="modalVisible = false">
    </EditCreateServerList>

    <ImportFile :visible="fileModalVisible"
                header="Import servers list"
                @save="doImportServers"
                @cancel="fileModalVisible = false">
    </ImportFile>

  </b-container>
</template>

<script>
import * as util from '../../helpers/util.js'
import UsernameMixin from '../UsernameMixin.js'
import EditCreateServerList from './EditCreateServerList'
import ImportFile from './ImportFile.vue'
import tst from './../toast/Toasts.js'

export default {
  name: "SMTPs",
  mixins: [ UsernameMixin ],
  components: {
    EditCreateServerList,
    ImportFile
  },
  props: {
    backend: Object,
    listsProp: String,
    ownPath: String,
    itemName: String,
    addFields: Boolean    
  },
  data () {
    return {
      limit: 5,
      offset: 0,
      total: 0,
      lists: [],
      loaded: false,
      findString: '',
      sortMode: 0,
      sortModeText: ['Name', 'Newest first', 'Oldest first'],
      fields: [
        { key: 'placeholder', label: ' ', sortable: false },        
        { key: 'name_date', label: 'Name', sortable: false },
        { key: 'totals', label: 'Total', sortable: false, tdClass: 'h-centered', thClass: 'h-centered' },        
        { key: 'goods', label: 'Good', sortable: false, tdClass: 'h-centered', thClass: 'h-centered'  },
        { key: 'problems', label: 'Problem', sortable: false, tdClass: 'h-centered', thClass: 'h-centered'  },        
        { key: 'actions', label: ' ', sortable: false }
      ],
      modalVisible: false,
      modalIdx: -1,
      modalOp: '',
      modalData: {},
      fileModalVisible: false,
      importID: -1
    }
  },
  mounted () {
    this.refresh()
  },
  computed:{
    sortedFilteredList: function () {
      // Sorting
      switch (this.sortMode) {
        // name
        case 0: {
          this.lists.sort(function (a, b) {
              return util.strComparer(a.name, b.name)
          })

          break
        }
        // newest first
        case 1: {
          this.lists.sort(function (a, b) {
              return new Date(b.updated_at) - new Date(a.updated_at);
          })

          break
        }
        // oldest first
        case 2: {
          this.lists.sort(function (a, b) {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(a.updated_at) - new Date(b.updated_at);
          })

          break
        }
      }

      return this.findString 
        ? this.lists.filter((str) => {
            return str.name.toLowerCase().indexOf(this.findString.toLowerCase()) > -1;
        })
        : this.lists
    },
    currentPage: {
      get: function () {
        return this.$route.query.page ? Number(this.$route.query.page) : 1
      },
      set: function (newValue) {
        this.$router.push(this.ownPath + '?page=' + newValue)
      }
    }
  },
  watch: {
    currentPage: function (newVal) {
      this.getData(newVal)
    },
    // backend change means switching between smtp and socks
    backend: function (newVal) {
      this.getData(1)
    }
  },
  methods:{
    refresh () {
      this.getData(this.currentPage)  
    },
    getData (page) {
      this.loaded = false

      this.backend.enumLists(this.limit, (page-1) * this.limit)
        .then((data) => {         
          this.limit = data.Limit
          this.offset = data.Offset
          this.total = data.Total
          this.lists = data[this.listsProp] === null ? [] : data[this.listsProp]
          this.loaded = true
        },
        error => {
          tst.error(error)
        })
    },
    addList () {
      this.modalOp = 'Add'
      this.modalIdx = -1

      this.modalData = {
        name: '',
        description: ''        
      }

      if (this.addFields) {
        this.modalData.cost_send = '0' // to avoid converting to false
        this.share = false
      }

      this.modalVisible = true
    },
    viewList (id) {
      this.$router.push(this.ownPath + '/' + id)
    },
    editList (item) {
      let idx = this.lists.indexOf(item.item)

      // to avoid inline edit we clone object
      this.modalData = util.cloneObject(this.lists[idx])
      this.modalOp = 'Edit'
      this.modalIdx = idx
      this.modalVisible = true            
    },
    deleteList (id) {
      this.backend.deleteList(id)
        .then((data) => {
          // new page calculation after item deletion
          // one item in list means this is last page (and may be the only one)
          this.currentPage = (this.lists.length === 1) 
            ? this.currentPage > 1
              ? this.currentPage - 1
              : 1
            : this.currentPage

          this.getData(this.currentPage)
        },
        error => {
          tst.error(error)
        })
    },
    saveList (item) {
      // bootstrap edit with type="number" provide numbers as string
      item.cost_send = Number(item.cost_send)

      this.modalVisible = false
      
      if (this.modalIdx >= 0) {
        // existing edit
        this.backend.updateList(item.id, item) 
          .then(data => {
            // set item only if it was accepted by backend
            this.$set(this.lists, this.modalIdx, item)
          },
          error => {
            tst.error(error)
          })
      } else {
        // add new
        this.backend.createList(item)
          .then(reply => {            
            // set id for server
            this.backend.getListById(reply.id)
              .then(reply => {
                // need to update in order to get all fields, updated_at and so on
                this.lists.push(reply)            
              },
              error => {
                tst.error(error)
              })
          },
          error => {
            tst.error(error)
          })
      }
    },
    importServers (id) {
      this.importID = id
      this.fileModalVisible = true
    },
    doImportServers (file) {
      this.backend.importList(this.importID, file)
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
    }
  }
}
</script>

