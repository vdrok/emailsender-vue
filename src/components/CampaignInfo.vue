<template>
    <div>
        <header slot="modal-header" class="modal-header">
            <h5 class="modal-title"> Campaign info</h5>
            <button type="button" aria-label="Close" class="close" @click="closeModal">×</button>
        </header>
        <b-form class="text-left">
            <b-row class="justify-content-md-center">
                <b-col class="col-8">
                    <b-row>
                        <b-col class="col-12">
                            <b-form-group
                                    id="campaign-email-subject"
                                    label="Email subject"
                                    label-for="campaign-email-subject-input"
                                    v-model="campaignEmailSubject"
                                    @blur="$v.campaignEmailSubject.$touch()"
                                    :invalid-feedback="invalidEmailSubject"
                            >
                                <b-form-input id="campaign-email-subject-input" :state="stateEmailSubject"
                                              v-model="campaignInfo.email_subject" type="text"></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col class="col-12">
                            <b-form-group
                                    id="campaign-from-name"
                                    label="From Name"
                                    label-for="campaign-from-name-input"
                                    v-model="campaignFromName"
                                    @blur="$v.campaignFromName.$touch()"
                                    :invalid-feedback="invalidFromName"
                            >
                                <b-form-input id="campaign-from-name-input" :state="stateFromName"
                                              v-model="campaignInfo.from_name" type="text"></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col class="col-12">
                            <b-form-group
                                    id="campaign-from-email"
                                    label="From Email"
                                    label-for="campaign-from-email-input"
                                    v-model="campaignFromEmail"
                                    @blur="$v.campaignFromEmail.$touch()"
                                    :invalid-feedback="invalidFromEmail"
                            >
                                <b-form-input id="campaign-from-email-input" :state="invalidFromEmail"
                                              v-model="campaignInfo.from_email" type="text"></b-form-input>
                            </b-form-group>
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
                    <b-btn :disabled="$v.$invalid" variant="primary" @click="nextHandler">
                        Next
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
        name: 'CampaignInfo',
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
            nextHandler() {
                this.$router.push({
                    name: 'Campaign Edit Template',
                    params: {campaignPageNumber: this.$route.params.campaignPageNumber, id: this.$route.params.id},
                });
            },
            backHandler () {
                this.$router.push({
                    name: 'Choose List',
                    params: {campaignPageNumber: this.$route.params.campaignPageNumber, id: this.$route.params.id},
                });
            },
            closeModal () {
                this.parentRefs.prepareCampaign.hide()
            }
        },

    };
</script>
<style>
    .btn.btn-default {
        background-color: #fff;
        border-color: #ccc;
    }
</style>
