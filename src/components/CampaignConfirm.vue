<template>
    <div>
        <header slot="modal-header" class="modal-header">
            <div class="header">
                <h5 class="modal-title">You’re all set to send!</h5>
                <p>Review the feedback below before sending your campaign.</p>
            </div>
            <button type="button" aria-label="Close" class="close" @click="closeModal">×</button>
        </header>
        <b-form class="text-left">
            <b-row class="justify-content-md-center">
                <b-col class="col-12">
                    <b-row class="mt-2 bb-solid-gray">
                        <b-col class="col-1">
                            <font-awesome-icon size="3x" :style="{color:'#72c0b0'}" icon="check-circle" />
                        </b-col>
                        <b-col class="col-9">
                            <h6>List {{campaignInfo.email_list.list_name}}</h6>
                            <p>Mailchimp will deliver this to the email list {{campaignInfo.email_list.list_name}}. ({{campaignInfo.email_list.total}} recipients)</p>
                        </b-col>
                        <b-col class="col-2">
                            <b-btn  variant="default" @click="editEmailListHandler">
                                Edit
                            </b-btn>
                        </b-col>
                    </b-row>
                    <b-row class="mt-2 bb-solid-gray">
                        <b-col class="col-1">
                            <font-awesome-icon size="3x" :style="{color:'#72c0b0'}" icon="check-circle" />
                        </b-col>
                        <b-col class="col-9">
                            <h6>FROM</h6>
                            <p>{{campaignInfo.from_name}} {{campaignInfo.from_email}}</p>
                        </b-col>
                        <b-col class="col-2">
                            <b-btn  variant="default" @click="editCampaignInfoHandler">
                                Edit
                            </b-btn>
                        </b-col>
                    </b-row>
                    <b-row class="mt-2 bb-solid-gray">
                        <b-col class="col-1">
                            <font-awesome-icon size="3x" :style="{color:'#72c0b0'}" icon="check-circle" />
                        </b-col>
                        <b-col class="col-9">
                            <h6>Subject line</h6>
                            <p>{{campaignInfo.email_subject}}</p>
                        </b-col>
                        <b-col class="col-2">
                            <b-btn  variant="default" @click="editCampaignInfoHandler">
                                Edit
                            </b-btn>
                        </b-col>
                    </b-row>
                    <b-row class="mt-2 ">
                        <b-col class="col-1">
                            <font-awesome-icon size="3x" :style="{color:'#72c0b0'}" icon="check-circle" />
                        </b-col>
                        <b-col class="col-9">
                            <h6>Template {{campaignInfo.templateInfo.template_name}}</h6>
                        </b-col>
                        <b-col class="col-2">
                            <b-btn  variant="default" @click="editCampaignTemplate">
                                Edit
                            </b-btn>
                        </b-col>
                    </b-row>

                </b-col>
            </b-row>
        </b-form>

        <footer slot="modal-footer" class="modal-footer d-block">
            <b-row class="justify-content-md-center">
                <b-col cols="12" md="auto">
                    <b-btn :disabled="$v.$invalid" variant="default" @click="backHandler">
                        Back
                    </b-btn>
                    <b-btn :disabled="$v.$invalid" variant="primary" @click="sendHandler">
                        Send
                    </b-btn>
                </b-col>
            </b-row>
        </footer>
    </div>
</template>

<script>
    import {required, email} from 'vuelidate/lib/validators';

    export default {
        props: ['parentRefs'],
        name: 'CampaignConfirm',
        created() {
//            if(this.$route.params.id) {
//                if (this.templateInfo.id !== this.$route.params.id) {
//                    this.$store.dispatch('templates/getById', {template_id: this.$route.params.id}, {root: true});
//                }
//            }
//            else{
//                this.$store.commit('templates/clear');
//            }
            //this.$store.dispatch('campaigns/getTemplateList', {limit: 0, offset: 0}, {root: true});
        },
        validations: {
            campaignEmailSubject: {
                required,
            },
            campaignFromName: {
                required,
            },
            campaignFromEmail: {
                required,
                email
            }
        },
        computed: {
            campaignInfo() {
                return this.$store.state.campaigns.campaignInfo;
            },
            invalidEmailSubject() {
                return 'Enter valid subject';
            },
            invalidFromName() {
                return 'Enter valid name';
            },
            invalidFromEmail() {
                return 'Enter valid email';
            },
            stateEmailSubject() {
                return this.campaignInfo.email_subject && this.campaignInfo.email_subject.length >= 2;
            },
            stateFromName() {
                return this.campaignInfo.from_name && this.campaignInfo.from_name.length >= 2;
            },
            stateFromEmail() {
                return this.campaignInfo.from_email && this.campaignInfo.from_email.length >= 2;
            },
            campaignEmailSubject() {
                return this.campaignInfo.email_subject;
            },
            campaignFromName() {
                return this.campaignInfo.from_name;
            },
            campaignFromEmail() {
                return this.campaignInfo.from_email;
            },
        },
        methods: {
            async sendHandler() {
                if (this.campaignInfo.id) {
                    this.$store.dispatch('campaigns/updateCampaign').then(this.closeModal());
                } else {
                    this.$store.dispatch('campaigns/createCampaign').then(() => {
                        this.closeModal();
                    });
                }
            },
            backHandler () {
                this.$router.push({
                    name: 'Campaign Edit Template',
                    params: {campaignPageNumber: this.$route.params.campaignPageNumber, id: this.$route.params.id},
                });
            },
            closeModal () {
                this.parentRefs.prepareCampaign.hide()
            },
            editEmailListHandler () {
                this.$router.push({
                    name: 'Choose List',
                    params: {campaignPageNumber: this.$route.params.campaignPageNumber, id: this.$route.params.id},
                });
            },
            editCampaignInfoHandler () {
                this.$router.push({
                    name: 'Campaign Info',
                    params: {campaignPageNumber: this.$route.params.campaignPageNumber, id: this.$route.params.id},
                });
            },
            editCampaignTemplate () {
                this.$router.push({
                    name: 'Campaign Edit Template',
                    params: {campaignPageNumber: this.$route.params.campaignPageNumber, id: this.$route.params.id},
                });
            }

        },

    };
</script>
<style>
    .bb-solid-gray {
        border-bottom: 1px solid #e9ecef;
    }

    .btn.btn-default {
        background-color: #fff;
        border-color: #ccc;
    }

    div.header {
        text-align: center;
        width: 100%;
    }
</style>
