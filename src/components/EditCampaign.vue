<template>
    <div>
        <header slot="modal-header" class="modal-header">
            <button type="button" aria-label="Close" class="close" @click="closeModal">×</button>
        </header>
        <b-form class="text-left">
            <b-row class="justify-content-md-center">
                <b-col class="col-8">
                    <b-row>
                        <b-col class="col-1">
                            <div class="c-channelIcon c-channelIcon--email"></div>
                        </b-col>
                        <b-col class="col-9">
                            <h3>Create an Email</h3>
                        </b-col>
                        <b-col class="col-2">
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col class="col-12">
                            <p>
                                Keep things simple and personal with a text-only email-no images, fancy styling, or embedded hyperlinks.</p>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col class="col-12">
                            <b-form-group
                                    id="campaign_name"
                                    label="Campaign Name"
                                    label-for="campaignNameInput"
                                    v-model="campaignName"
                                    @blur="$v.campaignName.$touch()"
                                    :invalid-feedback="invalidCampaignName"
                            >
                                <b-form-input id="campaignNameInput" :state="stateCampaignName"
                                              v-model="campaignInfo.campaign_name" type="text"></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col class="col-12">
                            <b-form-group
                                    id="campaign_template"
                                    label="Campaign Template"
                                    label-for="campaignTemplateSelect"
                                    v-model="campaignTemplate"
                                    @blur="$v.campaignTemplate.$touch()"
                                    :invalid-feedback="invalidCampaignTemplate"
                            >
                                <model-select id="campaignTemplateSelect" :state="stateCampaignTemplate"
                                              v-model="campaignInfo.campaign_template" :options="templatesList"/>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-form>

        <footer slot="modal-footer" class="modal-footer d-block">
            <b-row class="justify-content-md-center">
                <b-col cols="12" md="auto">
                    <b-btn :disabled="$v.$invalid" variant="primary" @click="nextHandler">
                        Begin
                    </b-btn>
                    <router-link tag="a"
                                 :to="{ name: 'Campaigns', params: {campaignPageNumber: 0}}"
                    >
                        <a>Cancel</a>
                    </router-link>
                </b-col>
            </b-row>
        </footer>
    </div>
</template>

<script>
    import {required} from 'vuelidate/lib/validators';

    export default {
        props: ['parentRefs'],
        name: 'EditCampaign',
        created() {
//            if(this.$route.params.id) {
//                if (this.templateInfo.id !== this.$route.params.id) {
//                    this.$store.dispatch('templates/getById', {template_id: this.$route.params.id}, {root: true});
//                }
//            }
//            else{
//                this.$store.commit('templates/clear');
//            }
            this.$store.dispatch('campaigns/getTemplateList', {limit: 0, offset: 0}, {root: true});
        },
        validations: {
            campaignName: {
                required,
            },
            campaignTemplate: {
                required,
            },
        },

        computed: {
            campaignInfo() {
                return this.$store.state.campaigns.campaignInfo;
            },
            invalidCampaignName() {
                return 'Enter valid name';
            },
            invalidCampaignTemplate() {
                return 'Please choose template';
            },
            stateCampaignName() {
                return this.campaignInfo.campaign_name && this.campaignInfo.campaign_name.length >= 2;
            },
            campaignName() {
                return this.campaignInfo.campaign_name;
            },
            campaignTemplate() {
                return this.campaignInfo.campaign_template;
            },
            stateCampaignTemplate() {
                return typeof this.campaignInfo.campaign_template !== 'undefined';
            },
            templatesList() {
                return this.$store.state.campaigns.templatesList;
            },
        },
        methods: {
            nextHandler() {
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
    .c-channelIcon--email {
        background-position: 0 -32px;
    }

    .c-channelIcon {
        width: 24px;
        height: 25px;
        background: url(../assets/channel-icons-v3.svg) no-repeat;
        background-position: 0 -32px;
        background-size: 24px 247px;
        margin-top: 8px;
    }
</style>
