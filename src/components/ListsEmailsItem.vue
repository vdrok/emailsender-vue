<template>
    <div>
        <hr>
        <b-row class="row-12">
            <b-col class="col-8">
                <b-row>
                    <b-col class="col-1">
                        <div class="noPreview"></div>
                    </b-col>
                    <b-col class="col-9">
                        <div class="templateName"><router-link :to="openRoute()">{{list_name}}</router-link></div>
                        <small>{{ description }}</small>
                        <div>Created {{(new Date(created_at)).toUTCString()}} by {{userName}}</div>
                    </b-col>
                </b-row>
            </b-col>
            <b-col class="col-4 text-right">
                <b-dropdown id="edit" split @click="openHandler" text="Open" class="m-2">
                    <b-dropdown-item @click="editHandler">Edit</b-dropdown-item>                  
                    <b-dropdown-item @click="deleteHandler">Delete</b-dropdown-item>
                    <b-dropdown-divider></b-dropdown-divider>                    
                    <b-dropdown-item @click="fileModalVisible = true">Import list</b-dropdown-item>                  
                    <b-dropdown-item @click="exportList()">Export list</b-dropdown-item>
                </b-dropdown>
            </b-col>
        </b-row>

      <ImportFile :visible="fileModalVisible"
                  header="Import email list"
                  @save="importList"
                  @cancel="fileModalVisible = false">
      </ImportFile>

    </div>
</template>

<script>
import ImportFile from './admin/ImportFile.vue'
import ListService from '../services/listService.js'

export default {
    name: "ListsEmailsItem",
    components: {
      ImportFile
    },
    props: {
        subscribers: Number,
        created_at: String,
        id: String,
        description: String,
        owner_id: String,
        list_name: String,
        updated_at: String
    },
    data () {
      return {
        svc: null,
        fileModalVisible: false
      }
    },
    created() {
      this.svc = new ListService('email-lists', 'emails')

      if(!this.$store.state.user.getByIdHashMap[this.owner_id]) {
          this.$store.dispatch('user/getById', {userID: this.owner_id}, {root: true});
      }
    },
    computed: {
        userName () {
            let owner = this.$store.state.user.getByIdHashMap[this.owner_id] && this.$store.state.user.getByIdHashMap[this.owner_id].email;
            return (owner===this.$store.state.user.userInfo.email)?'you':owner;
        }
    },
    methods: {
      openRoute () {
        return { name: 'View List', params: {listsPageNumber: this.$route.params.listsPageNumber, viewListItem: this.id }}
      },
      openHandler: function() {
          this.$router.push(this.openRoute());
      },
      async deleteHandler(){
          this.$store.dispatch('emailsList/deleteE', {emailId: this.id}, {root: true}).then(() => {
              this.$router.push({name: 'Lists', params: {listsPageNumber: this.$store.state.emailsList.currentPage}});
          });
      },
      editHandler () {
          this.$router.push({name: 'Edit Email List', params: {listsPageNumber: this.$route.params.listsPageNumber, id: this.id?this.id:''}});
      },
      importList (file) {
        this.svc.importList(this.id, file)
          .then((data) => {
            // !!!
            // Show message?
            console.log(data)
          },
          error => {
            // !!!
            console.log(error)
          })              
      },
      exportList () {
        this.svc.exportList(this.id)
          .then((data) => {
            let link = document.createElement('a')
            // filename
            link.setAttribute('download', this.listName + '.csv')
            // url
            link.setAttribute('href', window.URL.createObjectURL(new Blob([data], { type: 'text/csv' })))
            link.click()
          },
          error => {
            // !!!
            console.log(error)
          })              
      }
    }
}
</script>

<style scoped>
    .noPreview {
        background-image: url('../assets/no_preview.png');
        width: 24px;
        height: 30px;
        background-position: center top;
        background-repeat: no-repeat;
        background-size: cover;
        margin-top: 8px;
    }
    .templateName{
        font-size: 20px;
        line-height: inherit;
        color: #007c89;
        text-decoration: none;
    }
</style>
