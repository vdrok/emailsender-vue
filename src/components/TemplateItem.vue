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
                        <div class="templateName">{{template_name}}</div>
                        <div>Edited {{(new Date(updated_at)).toUTCString()}} by {{ userName(owner_id) }}</div>
                    </b-col>
                </b-row>
            </b-col>
            <b-col class="col-4 text-right">
                <b-dropdown id="edit" split @click="editHandler" text="Edit" class="m-2">
                    <b-dropdown-item @click="deleteHandler">Delete</b-dropdown-item>
                </b-dropdown>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import UsernameMixin from './UsernameMixin.js'

export default {
    name: "TemplateItem",
    mixins: [
      UsernameMixin
    ],
    props: {
        body_html: String,
        body_text: String,
        created_at: String,
        from_email: String,
        from_name: Array,
        id: String,
        owner_id: String,
        reply_email: String,
        subject: Array,
        template_name: String,
        updated_at: String
    },
    created() {
        if(!this.$store.state.user.getByIdHashMap[this.owner_id]) {
            this.$store.dispatch('user/getById', {userID: this.owner_id}, {root: true});
        }
    },
    methods: {
        editHandler: function(){
            this.$router.push({name: 'Edit Properties', params: {templatesPageNumber: this.$route.params.templatesPageNumber, id: this.id?this.id:''}});
        },
        deleteHandler: function(){
            this.$store.dispatch('templates/deleteT', {template_id: this.id}, {root: true});
        }
    }
}
</script>

<style scoped>
.templateName{
    font-size: 20px;
    line-height: inherit;
    color: #007c89;
    text-decoration: none;
}
</style>
