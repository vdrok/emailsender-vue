<template>
    <b-form class="text-left">
        <b-form-group
                id="template_name"
                label="Template name"
                label-for="templateNameInput"
                :invalid-feedback="invalidTemplateName"
                :valid-feedback="validFeedback"
                :state="stateTemplateName"
        >
            <b-form-input id="templateNameInput" :state="stateTemplateName" v-model="templateInfo.template_name" type="text"></b-form-input>
        </b-form-group>
        <b-form-group
                id="from_name"
                label="From name"
                label-for="fromNameInput"
                :invalid-feedback="invalidFromName"
                :valid-feedback="validFeedback"
                :state="stateFromName"
        >
            <b-form-input id="fromNameInput" :state="stateFromName" v-model="templateInfo.from_name" type="text"></b-form-input>
        </b-form-group>
        <b-form-group
                id="reply_email"
                label="Reply email"
                label-for="replyEmailInput"
                :invalid-feedback="invalidReplyEmail"
                :valid-feedback="validFeedback"
                :state="stateReplyEmail"
        >
            <b-form-input id="replyEmailInput" :state="stateReplyEmail" v-model="templateInfo.reply_email" type="text"></b-form-input>
        </b-form-group>
        <b-form-group
                id="from_email"
                label="From email"
                label-for="fromEmailInput"
                :invalid-feedback="invalidFromEmail"
                :valid-feedback="validFeedback"
                :state="stateFromEmail"
        >
            <b-form-input id="fromEmailInput" :state="stateFromEmail" v-model="templateInfo.from_email" type="text"></b-form-input>
        </b-form-group>
        <b-form-group
                id="subject"
                label="Subject"
                label-for="subjectInput"
                :invalid-feedback="invalidSubject"
                :valid-feedback="validFeedback"
        >
            <b-form-input id="subjectInput" :state="stateSubject" v-model="templateInfo.subject" type="text"></b-form-input>
        </b-form-group>
    </b-form>
</template>

<script>
    export default {
        name: 'EditPropertiesTemplate',
        created(){
            if(this.$route.params.id) {
                if (this.templateInfo.id !== this.$route.params.id) {
                    this.$store.dispatch('templates/getById', {template_id: this.$route.params.id}, {root: true});
                }
            }
            else{
                this.$store.commit('templates/clear');
            }
        },
        computed:{
            templateInfo(){
                return this.$store.state.templates.templateInfo
            },
            stateTemplateName () {
                return this.templateInfo.template_name && this.templateInfo.template_name.length >= 2
            },
            stateFromName () {
                return this.templateInfo.from_name && this.templateInfo.from_name.length >= 2
            },
            stateReplyEmail () {
                return this.templateInfo.reply_email && this.templateInfo.reply_email.length >= 2
            },
            stateFromEmail () {
                return this.templateInfo.from_email && this.templateInfo.from_email.length >= 2
            },
            stateSubject () {
                return this.templateInfo.subject && this.templateInfo.subject.length >= 2
            },
            invalidTemplateName () {
                if (this.templateInfo.template_name && this.templateInfo.template_name.length > 0) {
                    return 'Enter valid name'
                } else {
                    return 'Please enter something'
                }
            },
            invalidFromName () {
                if (this.templateInfo.from_name && this.templateInfo.from_name.length > 0) {
                    return 'Enter valid name'
                } else {
                    return 'Please enter something'
                }
            },
            invalidReplyEmail () {
                if (this.templateInfo.reply_email && this.templateInfo.reply_email.length > 0) {
                    return 'Enter valid email'
                } else {
                    return 'Please enter something'
                }
            },
            invalidFromEmail () {
                if (this.templateInfo.from_email && this.templateInfo.from_email.length > 0) {
                    return 'Enter valid email'
                } else {
                    return 'Please enter something'
                }
            },
            invalidSubject () {
                if (this.templateInfo.subject && this.templateInfo.subject.length > 0) {
                    return 'Enter valid subject'
                } else {
                    return 'Please enter something'
                }
            },
            validFeedback () {
                return this.state === true ? 'Thank you' : ''
            }
        }
    }
</script>
<style>
</style>
