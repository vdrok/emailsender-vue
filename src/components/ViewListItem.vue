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
                        <div class="templateName">{{full_name}}</div>
                        <div>Created {{(new Date(created_at)).toUTCString()}}</div>
                    </b-col>
                </b-row>
            </b-col>
            <b-col class="col-4 text-right">
                <b-dropdown id="edit" split @click="openHandler" text="Open" class="m-2">
                    <b-dropdown-item @click="deleteHandler">Delete</b-dropdown-item>
                </b-dropdown>
            </b-col>
        </b-row>
    </div>
</template>

<script>
export default {
    name: "ViewListItem",
    props: {
        created_at: String,
        email: String,
        full_name: String,
        id: String,
        ip_address: String,
        last_activity: String,
        list_id: String,
        updated_at: String
    },
    methods: {
        openHandler: function(){
            this.$router.push({name: 'View List', params: {listsPageNumber: this.$route.params.listsPageNumber, viewListsPageNumber: this.$route.params.viewListsPageNumber, viewListItem: this.id}});
        },
        deleteHandler: function(){
            this.$store.dispatch('emailsList/deleteE', {emailId: this.id}, {root: true});
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
