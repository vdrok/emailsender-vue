<template>
  <b-container class="mt-5">
    <!-- Header row -->
    <b-row class="row-12">
      <b-col class="col-6">
          <h1>Lists</h1>
      </b-col>
      <b-col class="col-6 text-right">
          <b-button class="my-2" variant="outline-info"
                    :to="{ name: 'Edit Email List', params: { listsPageNumber: this.$route.params.listsPageNumber }}">
            Create list
          </b-button>
      </b-col>
    </b-row>

    <!-- Search & Sorting -->
    <b-row class="row-12">
      <b-col class="col-6">
        <b-input-group class="left-addon ml-2">
            <font-awesome-icon icon="search" />
            <b-form-input placeholder="Find list by name" v-model="findString"></b-form-input>
        </b-input-group>         
      </b-col>
      <b-col class="col-6 text-right">
        Sort mode
        <b-dropdown :text="sortModeText[sortMode]" class="ml-2 mb-2 addBorder" variant="outline">
            <!--<b-dropdown-item @click="sortMode = 0">Name</b-dropdown-item>-->
            <b-dropdown-item @click="sortMode = 0">Newest first</b-dropdown-item>
            <b-dropdown-item @click="sortMode = 1">Oldest first</b-dropdown-item>
        </b-dropdown>
      </b-col>
    </b-row>    

    <b-modal id="prepare-emailList" ref="prepareEmailList" size="lg" centered hide-header hide-footer
            v-model='modalShow'>
        <router-view name="modal" :parentRefs="$refs"></router-view>
    </b-modal>

    <div v-if="sortedFilteredList.length > 0">
    <b-table :items="sortedFilteredList" :fields="fields" small tbody-tr-class="servers-tr-class" sort-by="name">
      <template slot="placeholder" slot-scope="data"> 
        <div class="noPreview"></div>
      </template>

      <template slot="name_desc" slot-scope="data">
        <div class="templateName"><router-link :to="openRoute(data.item.id)">{{ data.item.list_name }}</router-link></div>
        <small>{{ data.item.description }}</small>
        <div>Created {{(new Date(data.item.created_at)).toUTCString()}} by {{ userName(data.item.owner_id) }}</div>           
      </template>

      <template slot="actions" slot-scope="data">
        <div class="text-right">
          <b-dropdown id="edit" split @click="openHandler(data.item.id)" text="Open" class="m-2">
              <b-dropdown-item @click="editHandler(data.item.id)">Edit</b-dropdown-item>                  
              <b-dropdown-item @click="deleteHandler(data.item.id)">Delete</b-dropdown-item>
              <b-dropdown-divider></b-dropdown-divider>                    
              <b-dropdown-item @click="importList(data.item.id)">Import list</b-dropdown-item>                  
              <b-dropdown-item @click="exportList(data.item.id)">Export list</b-dropdown-item>
          </b-dropdown>
        </div>
      </template>
    </b-table>
  </div>
    <div v-else-if="sortedFilteredList.length <= 0">
      <div class="card">
      <div class="card-body">
        <h2 class="noDataTitle">You haven't created a list yet</h2>
        <p class="noDataMessage">Lists are where your contacts (aka subscribers!) live. You'll need one of these to send campaigns to the outside world.</p>
      </div>
    </div>
  </div>

    <b-pagination v-if="showPagination" align="center" :total-rows="total" v-model="currentPage" :per-page="perPage">
    </b-pagination>

    <ImportFile :visible="fileModalVisible"
                header="Import email list"
                @save="doImportList"
                @cancel="fileModalVisible = false">
    </ImportFile>
  </b-container>
</template>

<script>
import ImportFile from './admin/ImportFile.vue'
import ListService from '../services/listService.js'
import UsernameMixin from './UsernameMixin.js'
import tst from './toast/Toasts.js'

export default {
  name: "Lists",
  mixins: [ UsernameMixin ],
  components: { ImportFile },   
  data () {
    return {
      svc: null,
      fileModalVisible: false,
      importID: -1,
      findString: '',
      fields: [
        { key: 'placeholder', label: ' ', sortable: false },        
        { key: 'name_desc', label: 'Name', sortable: false },
        { key: 'subscribers', label: 'Subscribers', sortable: false, tdClass: 'h-centered', thClass: 'h-centered' },        
        { key: 'opens', label: 'Opens', sortable: false, tdClass: 'h-centered', thClass: 'h-centered'  },
        { key: 'clicks', label: 'Clicks', sortable: false, tdClass: 'h-centered', thClass: 'h-centered'  },        
        { key: 'actions', label: ' ', sortable: false }
      ],
      sortMode: 0,
      sortModeText: ['Newest first', 'Oldest first'],

      /*sortDropDown: "Newest first",
      findString: '',*/
      Offset: this.$store.state.emailsList.emailsData.Offset
    }
  },
  created () {
    this.svc = new ListService('email-lists', 'emails')    

    // fetch the data when the view is created and the data is
    // already being observed
    let listsPageNumber = this.$route.params.listsPageNumber ? this.$route.params.listsPageNumber - 1 : 0
    this.$store.dispatch('emailsList/setCurrentPage', listsPageNumber + 1);
    this.$store.dispatch('emailsList/getList', {limit: this.perPage, offset: listsPageNumber*this.perPage}, {root: true});
  },
  methods:{
    lastUpdated(){
        this.sortDropDown = "Newest first";
    },
    firstUpdated(){
        this.sortDropDown = "Oldest first";
    },
    openRoute (id) {
      return { 
        name: 'View List', 
        params: {
          listsPageNumber: this.$route.params.listsPageNumber, 
          viewListItem: id 
        }
      }
    },
    openHandler: function(id) {
        this.$router.push(this.openRoute(id));
    },
    editHandler (id) {
      this.$router.push({
        name: 'Edit Email List', 
        params: {
          listsPageNumber: this.$route.params.listsPageNumber, 
          id: id
        }
      });
    },
    deleteHandler(id) {
      this.$store.dispatch('emailsList/deleteE', { emailId: id }, { root: true }).then(() => {
          this.$router.push({
            name: 'Lists', 
            params: {
              listsPageNumber: this.$store.state.emailsList.currentPage
            }
          });
      });
    },
    importList (id) {
      this.importID = id
      this.fileModalVisible = true
    },
    doImportList (file) {
      this.svc.importList(this.importID, file)
        .then((data) => {
          tst.info(`${data.total} items were successfully imported`)

          // Trigger same page reload
          this.currentPage = this.currentPage
        },
        error => {
          tst.error(error)
        })              
    },
    exportList (id) {
      this.svc.exportList(id)
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
  },
  computed:{
    sortedFilteredList: function(){      
      // Sorting
      switch (this.sortMode) {
        // newest first
        case 0: {
          this.lists.sort(function (a, b) {
              return new Date(b.updated_at) - new Date(a.updated_at);
          })

          break
        }
        // oldest first
        case 1: {
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
            return str.list_name.toLowerCase().indexOf(this.findString.toLowerCase()) > -1;
        })
        : this.lists
    },
    lists: function () {
        return this.$store.state.emailsList.emailsData.email_lists;
    },
    modalShow: {
        get: function () {
            return this.$route.meta.showModal
        },
        // setter
        set: function (newValue) {
            if(!newValue){
                this.$router.push({name: 'Lists', params: {listsPageNumber: this.$route.params.listsPageNumber}});
            }
        }
    },
    currentPage: {
      get: function () {
          return this.$store.state.emailsList.currentPage;
      },
      set: function (newValue) {
          this.$store.dispatch('emailsList/setCurrentPage', newValue);
          this.$store.dispatch('emailsList/getList', {limit: this.perPage, offset: (newValue-1)*this.perPage}, {root: true});
          this.$router.push({name: 'Lists', params: {listsPageNumber: this.$store.state.emailsList.currentPage}});
      }
    },
    total: function(){
        return this.$store.state.emailsList.emailsData.Total;
    },
    perPage: function() {
        return this.$store.state.emailsList.PerPage;
    },
    showPagination: function() {
        return this.total > this.perPage;
    },
  }
}
</script>

<style scoped>
.left-addon svg {
    margin-right: -26px;
    z-index: 1;
    margin-top: 11px;
}
.left-addon input {padding-left: 30px;}
.addBorder{
    border: 1px solid rgba(0,0,0,.15);
}
.templateName{
    font-size: 20px;
    line-height: inherit;
    color: #007c89;
    text-decoration: none;
}

h2.noDataTitle {
  text-align: center;
}

p.noDataMessage {
  text-align: center;
}

</style>
