<template>
    <footer slot="modal-footer" class="modal-footer">
        <b-btn variant="primary" @click="nextHandler">
            Next
        </b-btn>
    </footer>
</template>

<script>
    export default {
        name: 'EditPropertiesFooterTemplate',
        methods:{
            nextHandler(){
                this.$router.push({name: 'Edit Code', params: {templatesPageNumber: this.$route.params.templatesPageNumber, id: this.$route.params.id}});
            }
        }
    }
</script>
<style>
</style>
