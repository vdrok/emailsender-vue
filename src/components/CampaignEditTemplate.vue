<template>
    <div>
        <header slot="modal-header" class="modal-header">
            <h5 class="modal-title">Campaign Edit Template</h5>
            <button type="button" aria-label="Close" class="close" @click="closeModal">×</button>
        </header>


        <b-card no-body>
            <b-tabs card @input="inputTabs">
                <b-tab title="Edit code">
                    <div class="codeContainer text-left">
                        <codemirror ref="myCm" v-model="templateInfo.body_html" :options="cmOptions"></codemirror>
                    </div>
                </b-tab>
                <b-tab title="Preview">
                    <div class="previewContainer">
                        <iframe :srcdoc="templateInfo.body_html"></iframe>
                    </div>
                </b-tab>
            </b-tabs>
        </b-card>
        <footer slot="modal-footer" class="modal-footer">
            <b-row class="justify-content-md-center">
                <b-col cols="12" md="auto">
                    <b-btn variant="default" @click="backHandler">
                        Back
                    </b-btn>
                    <b-btn variant="primary"  @click="nextHandler">
                        Next
                    </b-btn>
                </b-col>
            </b-row>
        </footer>
    </div>
</template>

<script>
    // require component
    import Vue from 'vue';
    import {codemirror} from 'vue-codemirror';
    // require styles
    import 'codemirror/lib/codemirror.css';
    import 'codemirror/theme/monokai.css';
    import 'codemirror/mode/htmlmixed/htmlmixed.js';

    export default {
        props: ['parentRefs'],
        name: 'CampaignEditTemplate',
        components: {
            codemirror,
        },
        data() {
            return {
                cmOptions: {
                    tabSize: 4,
                    styleActiveLine: true,
                    lineNumbers: true,
                    viewportMargin: Infinity,
                    mode: {
                        name: 'htmlmixed',
                        tags: {
                            style: [
                                ['type', /^text\/(x-)?scss$/, 'text/x-scss'],
                                [null, null, 'css']],
                            custom: [[null, null, 'customMode']],
                        },
                    },
                    theme: 'monokai',
                },
            };
        },
        created() {
            if (this.campaignInfo.campaign_template) {
                this.$store.dispatch('campaigns/getTemplateById');
            }
        },
        computed: {
            templateInfo() {
                return this.campaignInfo.templateInfo;
            },
            campaignInfo() {
                return this.$store.state.campaigns.campaignInfo;
            },
        },
        methods: {
            inputTabs(ev) {
                if (ev === 1) {
                    Vue.set(this.campaignInfo.templateInfo, 'body_html',
                        this.campaignInfo.templateInfo.body_html);
                }
            },
            closeModal () {
                this.parentRefs.prepareCampaign.hide()
            },
            nextHandler() {
                this.$router.push({
                    name: 'Choose SMTP list',
                    params: {campaignPageNumber: this.$route.params.campaignPageNumber, id: this.$route.params.id},
                });
            },
            backHandler() {
                this.$router.push({
                    name: 'Campaign Info',
                    params: {campaignPageNumber: this.$route.params.campaignPageNumber, id: this.$route.params.id},
                });
            },
        },
    };
</script>

<style scoped>
    iframe {
        width: 100%;
        height: 100%;
    }

    .previewContainer, .codeContainer {
        height: 300px;
    }

    .btn.btn-default {
        background-color: #fff;
        border-color: #ccc;
    }
</style>

<style>
</style>
