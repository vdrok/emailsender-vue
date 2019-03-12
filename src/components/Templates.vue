<template>
    <b-container>
        <b-row class="row-12">
            <b-col class="col-6">
                <h1 class="mt-5">Templates</h1>
                <b-input-group class="left-addon ml-2">
                    <font-awesome-icon icon="search"/>
                    <b-form-input placeholder="Find a template by name" v-model="findString"></b-form-input>
                </b-input-group>
            </b-col>
            <b-col class="col-6 text-right">
                <b-button variant="secondary" class="my-2 mt-5"
                          :to="{ name: 'Edit Properties', params: {templatesPageNumber: this.$route.params.templatesPageNumber}}">
                    Create Template
                </b-button>
                <div>
                    Sort by
                    <b-dropdown :text="sortDropDown" class="ml-2 my-2 addBorder" variant="outline">
                        <b-dropdown-item @click="lastUpdated">Newest first</b-dropdown-item>
                        <b-dropdown-item @click="firstUpdated">Oldest first</b-dropdown-item>
                    </b-dropdown>
                </div>
            </b-col>
            <b-modal id="prepare-template" ref="prepareTemplate" size="lg" centered title="Create Template" hide-footer
                     v-model='modalShow'>
                <router-view name="body"></router-view>
                <router-view name="footer"></router-view>
            </b-modal>
        </b-row>

        <div v-if="showDataMessage">
            <div class="card">
              <div class="card-body">
                <h2 class="noDataTitle">You don't have any saved templates</h2>
                <p class="noDataMessage">A template is a saved design that can be reused when creating email campaigns.</p>
              </div>
            </div>
        </div>

        <template-item v-for="item in sortedFilteredList" :key="item.id" :id='item.id'
                       :template_name="item.template_name" :updated_at="item.updated_at"
                       :owner_id="item.owner_id"></template-item>
        <b-pagination v-if="showPagination" align="center" :total-rows="total" v-model="currentPage"
                      :per-page="perPage">
        </b-pagination>
        </b-container>




</template>

<script>
    export default {
        name: 'Templates',
        data() {
            return {
                sortDropDown: 'Newest first',
                findString: '',
                Offset: this.$store.state.templates.templatesData.Offset,
            };
        },
        created() {
            // fetch the data when the view is created and the data is
            // already being observed
            let templatesPageNumber = this.$route.params.templatesPageNumber ? this.$route.params.templatesPageNumber -
                1 : 0;

            this.$store.dispatch('templates/getList', {limit: this.perPage, offset: templatesPageNumber * this.perPage}, {root: true});
        },
        methods: {
            lastUpdated() {
                this.sortDropDown = 'Newest first';
            },
            firstUpdated() {
                this.sortDropDown = 'Oldest first';
            },
        },
        computed: {
            sortedFilteredList: function() {
                if (this.templates && this.templates.length) {
                    if (this.sortDropDown === 'Newest first') {
                        this.templates.sort(function(a, b) {
                            return new Date(b.updated_at) - new Date(a.updated_at);
                        });
                    }
                    else {
                        this.templates.sort(function(a, b) {
                            // Turn your strings into dates, and then subtract them
                            // to get a value that is either negative, positive, or zero.
                            return new Date(a.updated_at) - new Date(b.updated_at);
                        });
                    }
                    return this.templates.filter((str) => {
                        return str.template_name.toLowerCase().indexOf(this.findString.toLowerCase()) > -1;
                    });
                }
                return [];
            },
            templates: function() {
                return this.$store.state.templates.templatesData.letter_templates;
            },
            showPagination: function() {
                return this.total > this.perPage;
            },

            showDataMessage: function() {
                return this.total == 0;
            },
            modalShow: {
                get: function() {
                    return this.$route.meta.showModal;
                },
                // setter
                set: function(newValue) {
                    if (!newValue) {
                        this.$router.push(
                            {name: 'Templates', params: {templatesPageNumber: this.$route.params.templatesPageNumber}});
                    }
                },
            },
            currentPage: {
                get: function() {
                    return +this.$route.params.templatesPageNumber;
                },
                // setter
                set: function(newValue) {
                    this.$router.push({name: 'Templates', params: {templatesPageNumber: newValue}});
                    this.$store.dispatch('templates/getList', {limit: this.perPage, offset: (newValue - 1) * this.perPage}, {root: true});
                },
            },
            total: function() {
                return this.$store.state.templates.templatesData.Total;
            },
            perPage: function() {
                return this.$store.state.templates.PerPage;
            },
        },
    };
</script>

<style scoped>
    .left-addon svg {
        margin-right: -26px;
        z-index: 1;
        margin-top: 11px;
    }

    .left-addon input {
        padding-left: 30px;
    }

    .addBorder {
        border: 1px solid rgba(0, 0, 0, .15);
    }

    h2.noDataTitle {
      text-align: center;
    }

    p.noDataMessage {
      text-align: center;
    }
</style>
