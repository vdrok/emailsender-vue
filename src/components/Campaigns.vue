<template>
  <b-container class="mt-5">
    <!-- Header -->
    <b-row class="row-12 flex-container">
      <b-col class="col-8 flex-wide">
          <h1>Campaigns</h1>
      </b-col>
      <b-col class="flex-short col-4 text-right pb-1">
        <b-button variant="secondary"
                  :to="{ name: 'Edit Campaign', params: {campaignPageNumber: this.$route.params.campaignPageNumber}}">
          Create Campaign
        </b-button>         
      </b-col>
    </b-row>

    <!-- Search & sort -->
    <b-row class="row-12">
      <b-col class="col-6">
        <b-input-group class="left-addon ml-2">
            <font-awesome-icon icon="search" />
            <b-form-input placeholder="Find a campaign by name" v-model="findString"></b-form-input>
        </b-input-group>         
      </b-col>
      <b-col class="col-6 text-right">
        Sort by
        <b-dropdown :text="sortDropDown" class="addBorder ml-2 my-2" variant="outline">
            <b-dropdown-item @click="lastUpdated">Last updated</b-dropdown-item>
            <b-dropdown-item @click="firstUpdated">Creation date</b-dropdown-item>
        </b-dropdown>      
      </b-col>
    </b-row>    

    <!--
    <b-row class="row-12">
        <b-col class="col-6">
            <h1 class="ml-5 mt-5">Campaigns</h1>
            <b-input-group class="left-addon">
                <font-awesome-icon icon="search"/>
                <b-form-input placeholder="Find a campaign by name" v-model="findString"></b-form-input>
            </b-input-group>
        </b-col>
        <b-col class="col-6 text-right">
            <b-button variant="secondary" class="my-2 mr-5 mt-5"
                      :to="{ name: 'Edit Campaign', params: {campaignPageNumber: this.$route.params.campaignPageNumber}}">
                Create Campaign
            </b-button>
            <div>
                Sort by
                <b-dropdown :text="sortDropDown" class="m-md-2 addBorder" variant="outline">
                    <b-dropdown-item @click="lastUpdated">Last updated</b-dropdown-item>
                    <b-dropdown-item @click="firstUpdated">Creation date</b-dropdown-item>
                </b-dropdown>
            </div>
        </b-col>
    </b-row>
    -->

    <b-modal id="prepare-campaign" ref="prepareCampaign" size="lg" centered hide-header hide-footer
              v-model='modalShow'>
        <router-view name="modal" :parentRefs="$refs"></router-view>
    </b-modal>

<div v-if="sortedFilteredList.length > 0">

    <b-row class="row-12 mt-2">
      <b-col class="col-9">
      </b-col>
      <b-col v-for="h in headers" class="col-1 text-center">
        <b>{{ h }}</b>
      </b-col>
    </b-row>

    <campaign-item v-for="campaign in sortedFilteredList" 
                   :key="campaign.id" 
                   :item="campaign">
    </campaign-item>
</div>
    <div v-if="showDataMessage">
      <div class="card">
      <div class="card-body">
        <h2 class="noDataTitle">No campaigns yet</h2>
        <p class="noDataMessage">When you create an email or ad, it'll show up here.</p>
      </div>
    </div>
  </div>

  </b-container>
</template>

<script>
    import CampaignItem from './CampaignItem';

    export default {

        name: 'Campaigns',
        components: {CampaignItem},
        data() {
            return {
              headers: ['Status', 'Opens', 'Clicks'],
                sortDropDown: 'Last updated',
//                campaigns: [
//                    {
//                        id: 1,
//                        campaignName: 'A',
//                        emailSubject: 'emailSubject',
//                        dateOfEditing: new Date('2019-01-02T03:24:00'),
//                    },
//                    {
//                        id: 2,
//                        campaignName: 'B',
//                        emailSubject: 'emailSubject',
//                        dateOfEditing: new Date('2019-01-04T03:24:00'),
//                    },
//                    {
//                        id: 3,
//                        campaignName: 'C',
//                        emailSubject: 'emailSubject',
//                        dateOfEditing: new Date('2019-01-03T03:24:00'),
//                    },
//                ],
                findString: '',
            };
        },
        created() {
            // fetch the data when the view is created and the data is
            // already being observed
            let campaignPageNumber = this.$route.params.campaignPageNumber ? this.$route.params.campaignPageNumber -
                1 : 0;

            this.$store.dispatch('campaigns/getCampaignsList',
                {limit: this.perPage, offset: campaignPageNumber * this.perPage}, {root: true});
        },
        methods: {
            lastUpdated() {
                this.sortDropDown = 'Last updated';
            },
            firstUpdated() {
                this.sortDropDown = 'Creation date';
            },
        },
        computed: {
            sortedFilteredList: function() {
                if (!this.campaigns){
                    return true;
                }
                if (this.sortDropDown === 'Last updated') {
                    this.campaigns.sort(function(a, b) {
                        // Turn your strings into dates, and then subtract them
                        // to get a value that is either negative, positive, or zero.
                        return b.date_updated - a.date_updated;
                    });
                }
                else {
                    this.campaigns.sort(function(a, b) {
                        // Turn your strings into dates, and then subtract them
                        // to get a value that is either negative, positive, or zero.
                        return a.date_created - b.date_created;
                    });
                }
                return this.campaigns.filter((str) => {
                    return str.campaign_name.toLowerCase().indexOf(this.findString.toLowerCase()) > -1;
                });
            },
            showDataMessage: function() {
                return this.campaigns == null;
            },
            modalShow: {
                get: function() {
                    return this.$route.meta.showModal;
                },
                // setter
                set: function(newValue) {
                    if (!newValue) {
                        this.$router.push(
                            {name: 'Campaigns', params: {campaignPageNumber: this.$route.params.campaignPageNumber}});
                    }
                },
            },
            campaigns: function() {
                return this.$store.state.campaigns.campaignData.campaigns;
            },
            currentPage: {
                get: function() {
                    return +this.$route.params.campaignPageNumber;
                },
                // setter
                set: function(newValue) {
                    this.$router.push({name: 'Campaigns', params: {campaignPageNumber: newValue}});
                    this.$store.dispatch('campaigns/getCampaignsList',
                        {limit: this.perPage, offset: (newValue - 1) * this.perPage}, {root: true});
                },
            },
            total: function() {
                return this.$store.state.campaigns.campaignData.Total;
            },
            perPage: function() {
                return this.$store.state.campaigns.PerPage;
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
      font-color: #241c15;
    }

    p.noDataMessage {
      text-align: center;
    }
</style>
