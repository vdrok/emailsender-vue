<template>
    <footer slot="modal-footer" class="modal-footer">
        <b-btn variant="primary" @click="handleSave">
            Save
        </b-btn>
    </footer>
</template>

<script>
    export default {
        name: 'EditCodeFooterTemplate',
        methods: {
            handleSave(){
                this.$router.push({name: 'Templates', params: {templatesPageNumber: this.$route.params.templatesPageNumber}});
                const templateInfo = this.$store.state.templates.templateInfo;
                console.log(JSON.stringify(templateInfo));
                if(this.$route.params.id){
                    this.$store.dispatch('templates/updateT', {template_name: templateInfo.template_name, body_html: templateInfo.body_html, templateId: this.$route.params.id}, {root: true});
                }
                else {

                    this.$store.dispatch('templates/createT', {
                        template_name: templateInfo.template_name,
                        from_name: templateInfo.from_name,
                        reply_email: templateInfo.reply_email,
                        body_html: templateInfo.body_html,
                        from_email: templateInfo.from_email,
                        subject: templateInfo.subject
                    });
                }
            },
        }
    }
</script>

<style scoped>
</style>

<style>
</style>
