<template>
    <div>
        <header slot="modal-header" class="modal-header">
            <h5 class="modal-title">Create Email List</h5>
            <button type="button" aria-label="Close" class="close" @click="closeModal">×</button>
        </header>
        <b-form class="text-left">
            <b-row class="justify-content-md-center">
                <b-col class="col-8">
                    <b-row>
                        <b-col class="col-12">
                            <b-form-group
                                    id="email_list_name"
                                    label="Email List Name"
                                    label-for="emailListNameInput"
                                    :invalid-feedback="invalidEmailListName"
                                    v-model="emailListName"
                            >
                                <b-form-input id="emailListNameInput"
                                              @blur="$v.emailListName.$touch()"
                                              @input='$v.emailListName.$touch()'
                                              :state="stateEmailListName"
                                              v-model="emailListName"
                                              type="text"></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col class="col-12">
                            <b-form-group
                                    id="email_list_description"
                                    label="Email List Description"
                                    label-for="emailListDescriptionInput"
                            >
                                <b-form-input id="emailListDescriptionInput"
                                              v-model="emailListDescription" type="text"></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-form>

        <footer slot="modal-footer" class="modal-footer d-block">
            <b-row class="justify-content-md-center">
                <b-col cols="12" md="auto">
                    <b-btn :disabled="$v.$invalid" variant="primary" @click="saveHandler">
                        {{this.btn_text}}
                    </b-btn>
                    <b-btn @click="closeModal" variant="primary">
                        Close
                    </b-btn>
                </b-col>
            </b-row>
        </footer>
    </div>
</template>

<script>
    import {required, minLength} from 'vuelidate/lib/validators';

    export default {
        props: ['parentRefs'],
        name: 'EditEmailList',
        data() {
            return {
                btn_text: '',
            };
        },
        created() {
            if(this.$route.params.id) {
                if (this.emailListInfo.id !== this.$route.params.id) {
                    this.$store.dispatch('emailsList/getById', {emailId: this.$route.params.id}, {root: true});
                    this.btn_text = 'Save';
                }
            }
            else{
                this.$store.dispatch('emailsList/reset');
                this.$v.$reset;
                this.btn_text = 'Create';
            }

        },
        validations: {
            emailListName: {
                required,
                minLength: minLength(2),
            },
        },
        computed: {
            emailListInfo() {
                return this.$store.state.emailsList.emailListInfo;
            },
            stateEmailListName() {
                if (this.$v.emailListName.$dirty) {
                    return !this.$v.emailListName.$error;
                }
            },
            invalidEmailListName() {
                return 'Enter valid email list name';
            },
            emailListName: {
                get: function() {
                    return this.emailListInfo.list_name;
                },
                set(value) {
                    this.$store.dispatch('emailsList/setEmailListName', value);
                },
            },
            emailListDescription: {
                get() {
                    return this.emailListInfo.description;
                },
                set(value) {
                    this.$store.dispatch('emailsList/setEmailListDescription', value);
                },
            },
        },
        methods: {
            nextHandler() {
                this.$router.push({
                    name: 'Choose List',
                    params: {campaignPageNumber: this.$route.params.campaignPageNumber, id: this.$route.params.id},
                });
            },
            closeModal() {
                this.$store.dispatch('emailsList/reset');
                this.$v.$reset;
                this.parentRefs.prepareEmailList.hide();
            },
            async saveHandler() {
                if (this.emailListInfo.id) {
                    this.$store.dispatch('emailsList/updateE').then(this.closeModal());
                } else {
                    this.$store.dispatch('emailsList/createE').then(() => {
                        //console.log(this.$store.state.emailsList.currentPage);
                        this.$router.push(
                            {name: 'Lists', params: {listsPageNumber: this.$store.state.emailsList.currentPage}});
                        this.closeModal();
                    });
                }
            },

        },

    };
</script>
<style>
</style>
