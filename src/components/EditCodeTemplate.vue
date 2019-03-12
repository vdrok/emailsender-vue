<template>
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
</template>

<script>
    // require component
    import Vue from 'vue'
    import { codemirror } from 'vue-codemirror'
    // require styles
    import 'codemirror/lib/codemirror.css'
    import 'codemirror/theme/monokai.css'
    import 'codemirror/mode/htmlmixed/htmlmixed.js'
    export default {
        name: 'EditCodeTemplate',
        components: {
            codemirror
        },
        data () {
            return {
                cmOptions: {
                    tabSize: 4,
                    styleActiveLine: true,
                    lineNumbers: true,
                    viewportMargin: Infinity,
                    mode: {
                        name: "htmlmixed",
                        tags: {
                            style: [["type", /^text\/(x-)?scss$/, "text/x-scss"],
                                [null, null, "css"]],
                            custom: [[null, null, "customMode"]]
                        }
                    },
                    theme: "monokai",
                }
            }
        },
        created(){
            if(this.$route.params.id) {
                if (this.templateInfo.id !== this.$route.params.id) {
                    this.$store.dispatch('templates/getById', {template_id: this.$route.params.id}, {root: true});
                }
            }
        },
        computed:{
            templateInfo(){
                return this.$store.state.templates.templateInfo
            }
        },
        methods:{
            inputTabs(ev){
                if(ev===1){
                    Vue.set(this.$store.state.templates.templateInfo, 'body_html', this.$store.state.templates.templateInfo.body_html);
                }
            }
        }
    }
</script>

<style scoped>
    iframe{
        width: 100%;
        height: 100%;
    }
    .previewContainer, .codeContainer{
        height: 300px;
    }
</style>

<style>
</style>
