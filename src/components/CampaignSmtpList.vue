<template>
    <div>
        <header slot="modal-header" class="modal-header">
            <h5 class="modal-title">SMTP List</h5>
            <button type="button" aria-label="Close" class="close" @click="closeModal">×</button>
        </header>
        <b-form class="text-left" slot="modal-body">
            <b-row class="justify-content-md-center">
                <b-col class="col-10">
                    <b-row class="mb-2 mt-2">
                        <b-col class="col-12">
                            <b-form-input v-model="searchSMTPList"
                                          type="text"
                                          placeholder="Search SMTP list"></b-form-input>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col class="col-12">
                            SMTP list
                        </b-col>
                    </b-row>
                    <b-row v-for="(smtpList, key) in filteredSMTPLists(smtpLists, searchSMTPList)" :key="key">
                        <b-col class="col-12">
                            <div class="custom-control custom-radio">
                                <input type="radio" v-model="campaignSMTPList" class="custom-control-input"
                                       name="email-list"
                                       :id="smtpList.id" :value="smtpList.id">
                                <label class="custom-control-label" :for="smtpList.id">
                                    {{smtpList.name}}
                                </label>
                            </div>
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
        name: 'CampaignSmtpList',
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
            this.$store.dispatch('campaigns/getSMTPlists', {limit: 0, offset: 0}, {root: true});
        },
        data() {
            return {
                smtpListSelected: '',
                searchSMTPList: ''
            };
        },
        validations: {},
        computed: {
            campaignInfo() {
                return this.$store.state.campaigns.campaignInfo;
            },
            campaignSMTPList: {
                get() {
                    return this.campaignInfo.smtp_list;
                },
                set(value) {
                    this.$store.dispatch('campaigns/setSMTPList', value);
                },
            },
            smtpLists() {
                return this.$store.state.campaigns.smtpLists;
            },

        },
        methods: {
            nextHandler() {
                this.$router.push({
                    name: 'Campaign Confirm',
                    params: {campaignPageNumber: this.$route.params.campaignPageNumber, id: this.$route.params.id},
                });
            },

            backHandler() {
                this.$router.push({
                    name: 'Campaign Edit Template',
                    params: {campaignPageNumber: this.$route.params.campaignPageNumber, id: this.$route.params.id},
                });
            },
            closeModal() {
                this.parentRefs.prepareCampaign.hide();
            },
            filteredSMTPLists: function (smtpLists, searchStr) {
                return smtpLists.filter(function (str) {
                    if (searchStr.length > 0){
                        return str.name.indexOf(searchStr) !== -1
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
