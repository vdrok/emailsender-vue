<template>
    <div>
        <header slot="modal-header" class="modal-header">
            <h5 class="modal-title">Who are you sending to?</h5>
            <button type="button" aria-label="Close" class="close" @click="closeModal">×</button>
        </header>
        <b-form class="text-left" slot="modal-body">
            <b-row class="justify-content-md-center">
                <b-col class="col-10">
                    <b-row class="mb-2 mt-2">
                        <b-col class="col-12">
                            <b-form-input v-model="searchEmailList"
                                          type="text"
                                          placeholder="Search list"></b-form-input>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col class="col-10">
                            Email List
                        </b-col>
                        <b-col class="col-2 ta-center">
                            Totals
                        </b-col>
                    </b-row>
                    <b-row v-for="(emailList, key) in filteredEmailLists(emailLists, searchEmailList)" :key="key">
                        <b-col class="col-10">
                            <div class="custom-control custom-radio">
                                <input type="radio" v-model="campaignEmailList" class="custom-control-input"
                                       name="email-list"
                                       :id="emailList.id" :value="emailList.id">
                                <label class="custom-control-label" :for="emailList.id">
                                    {{emailList.list_name}}
                                </label>
                            </div>
                        </b-col>
                        <b-col class="col-2 ta-center">
                            {{ emailList.total }}
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-form>

        <footer slot="modal-footer" class="modal-footer d-block">
            <b-row class="justify-content-md-center">
                <b-col cols="12" md="auto">
                    <b-btn variant="default" @click="backHandler">
                        Back
                    </b-btn>
                    <b-btn variant="primary" :disabled="$v.$invalid" @click="nextHandler">
                        Next
                    </b-btn>
                </b-col>
            </b-row>
        </footer>
    </div>
</template>

<script>
    import {required} from 'vuelidate/lib/validators';

    export default {
        props: ['parentRefs'],
        name: 'CampaignChooseEmailList',
        cache: false,
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
            this.$store.dispatch('campaigns/getEmailLists', {limit: 0, offset: 0}, {root: true});
        },
        data() {
            return {
                emailListSelected: '',
                searchEmailList: ''
            };
        },
        validations: {},
        computed: {
            campaignInfo() {
                return this.$store.state.campaigns.campaignInfo;
            },
            campaignEmailList: {
                get() {
                    return this.campaignInfo.email_list;
                },
                set(value) {
                    this.$store.dispatch('campaigns/setEmailList', value);
                },
            },
            emailLists() {
                return this.$store.state.campaigns.emailLists;
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
                    name: 'Campaign Info',
                    params: {campaignPageNumber: this.$route.params.campaignPageNumber, id: this.$route.params.id},
                });
            },

            backHandler() {
                this.$router.push({
                    name: 'Edit Campaign',
                    params: {campaignPageNumber: this.$route.params.campaignPageNumber, id: this.$route.params.id},
                });
            },
            closeModal() {
                this.parentRefs.prepareCampaign.hide();
            },
            filteredEmailLists: function (emailLists, searchStr) {
                return emailLists.filter(function (str) {
                    if (searchStr.length > 0){
                        return str.text.indexOf(searchStr) !== -1
                    }
                    return true;
                })
            }
        },

    };
</script>
<style>
    .btn.btn-default {
        background-color: #fff;
        border-color: #ccc;
    }
    .ta-center {
        text-align: center;
    }
</style>
