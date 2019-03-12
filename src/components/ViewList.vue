<template>
  <b-container class="mt-5">
    <!-- Header row -->
    <b-row class="row-12 flex-container">
      <b-col class="col-8 flex-wide">
          <h1>{{ listName }}</h1>
      </b-col>
      <!--
      <b-col class="col-4 text-right">
        <b-button @click="addItem()"
                  class="mt-2" variant="outline-info">
          Add recipient
        </b-button>
      </b-col>
      -->
    </b-row>

    <!-- Search & Sorting -->
    <b-row class="row-12">
      <b-col class="col-6">
        <b-input-group class="left-addon ml-2">
            <font-awesome-icon icon="search" />
            <b-form-input placeholder="Find recipient" v-model="findString"></b-form-input>
        </b-input-group>         
      </b-col>

      <b-col class="col-3 text-left">
        <b-button @click="getData(currentPage)" variant="outline-info">
          Search
        </b-button>

        <b-button @click="resetSearch()" variant="outline-info">
          Reset
        </b-button>

      </b-col>

      <b-col class="col-3 text-right">
        <b-button @click="addItem()" variant="outline-info">
          Add recipient
        </b-button>
      </b-col>
    </b-row>    

    <!-- Recipients  -->
    <b-row class="row-12 mt-4" >
      <b-col v-if="data.length === 0" class="py-3 text-center">
        <h5>There are no recipients added</h5>
      </b-col>

      <b-col v-else>
        <div class="overlay-wrapper">
          <OverlayProgress :active="loading"></OverlayProgress>

          <b-table :items="data" :fields="fields" small tbody-tr-class="servers-tr-class" sort-by="name">
            <template slot="actions" slot-scope="data">
              <div class="text-right">
                <b-dropdown split @click="editItem(data)" text="Edit" class="my-2">
                  <b-dropdown-item @click="deleteItem(data)">Delete</b-dropdown-item>
                </b-dropdown>                
              </div>
            </template>
          </b-table>

          <b-pagination v-if="total > limit" align="center" :total-rows="total" v-model="currentPage" :per-page="limit">
          </b-pagination>
        </div>
      </b-col>
    </b-row>

    <EditCreateRecipient :data="modalData" 
                         :visible="modalVisible"
                         :opName="modalOp"
                         @save="saveItem"
                         @cancel="modalVisible = false">
    </EditCreateRecipient>
  </b-container>
</template>

<script>
import * as util from '../helpers/util.js'
import ListService from '../services/listService.js'
import EditCreateRecipient from './EditCreateRecipient'
import OverlayProgress from './misc/OverlayProgress'
import tst from './toast/Toasts.js'

export default {
  name: "ViewList",
  components: {
    EditCreateRecipient,
    OverlayProgress
  },
  data () {
    return {
      limit: 3,
      offset: 0,
      total: 0,
      data: [],
      svc: null,
      listName: '',
      fields: [
        { key: 'first_name', label: 'First name', sortable: true },
        { key: 'last_name', label: 'Last name', sortable: true },        
        { key: 'email', label: 'Email', sortable: true },
        { key: 'contact_status', label: 'Status', sortable: true },        
        { key: 'actions', label: ' ', sortable: false }
      ],     
      modalVisible: false,
      modalData: {},
      modalOp: '',
      modalIdx: -1,
      prevFindString: '',
      findString: '',
      loading: false
    }
  },
  created () {
    this.svc = new ListService('email-lists', 'emails')

    // request list name
    this.svc.getListById(this.id)
      .then((data) => {
        this.listName = data.list_name
      },
      error => {
        tst.error(error)
      })

    // Watcher not called first time
    this.routeChanged(this.$route)
  },
  watch: {
    // Parameters change
    $route (to ,from) {
      this.routeChanged(to)
    }
  },
  methods:{
    routeChanged (newRoute) {
      // extract params from query
      this.prevFindString = this.findString
      this.findString = this.$route.query.filter ? this.$route.query.filter : ''

      this.getData(this.currentPage)      
    },
    // Most methods could be unified with /admin/WebMailDKIMMixin.js
    // the difference is in listID param
    getData (page = 1) {
      if (!util.strEqual(this.prevFindString, this.findString, true, false)) {
        // if find string has been changed we run a request to page = 1 since we have no idea how many pages will be in filtered dataset
        this.prevFindString = this.findString
        this.currentPage = (page > 1) ? 1 : this.currentPage
      } else {
        this.loading = true

        this.svc.enumItems(this.id, (page-1) * this.limit, this.limit, this.findString) // enum() -> enumItems(listID)
          .then(data => {
            this.limit = data.Limit
            this.offset = data.Offset
            this.total = data.Total

            this.data = data.emails

            if (!this.data)
              this.data = []

            this.loading = false
          },
          error => {
            this.loading = false
            tst.error(error)
          })
      }
    },
    addItem () {
      this.modalData = this.getNewItem()
      this.modalIdx = -1
      this.modalOp = 'Create'
      this.modalVisible = true
    },
    editItem (item) {
      let idx = this.data.indexOf(item.item)

      // to avoid inline edit we clone object
      this.modalData = util.cloneObject(this.data[idx])
      this.modalOp = 'Edit'
      this.modalIdx = idx
      this.modalVisible = true      
    },
    deleteItem (item) {
      let idx = this.data.indexOf(item.item)

      this.svc.deleteItem(this.id, this.data[idx].id) // delete(id) -> deleteItem(listID, id)
        .then(data => {
          // new page calculation after item deletion
          // one item in list means this is last page (and may be the only one)
          this.currentPage = (this.data.length === 1) 
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
    saveItem (item) {
      this.modalVisible = false
      
      if (this.modalIdx >= 0) {
        // existing edit        
        this.svc.updateItem(this.id, item)  // update(id, item) -> updateItem(listID, item)
          .then(reply => {
            this.$set(this.data, this.modalIdx, item)            
          },
          error => {
            tst.error(error)
          })
      } else {
        // add new
        this.svc.createItem(this.id, item) // create(id, item) -> createItem(listID, item)
          .then(reply => {
            this.getData(this.currentPage)
          },
          error => {
            tst.error(error)
          })
      }
    },
    resetSearch() {
      this.prevFindString = this.findString
      this.findString = ''
      this.currentPage = 1
    },
    getNewItem () {
      return {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@doe.com',
        contact_status: 'Subscribed'
      }
    }
  },
  computed:{
    id: function () {
      return this.$route.params.viewListItem
    },
    currentPage: {
      get: function () {
        return Number(this.$route.params.viewListsPageNumber)
      },
      set: function (newValue) {
        let filterParam = this.findString ? `?filter=${this.findString}` : ''
        this.$router.push(`/lists/${this.$route.params.listsPageNumber}/view-list/${this.$route.params.viewListItem}/${newValue}${filterParam}`)
      }
    }
  }
}
</script>
