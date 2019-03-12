<template>
  <div>
    <hr>
    <b-row class="row-12">
        <b-col class="col-9">
            <b-row>
                <b-col class="col-1">
                    <div class="c-channelIcon c-channelIcon--email"></div>
                </b-col>
                <b-col class="col-9">
                    <div class="campaignName">{{ item.campaign_name }}</div>
                    <div>{{subjectJoin}}</div>
                    <div>Edited {{dateUTCString}} by you</div>
                </b-col>
                <b-col class="col-2">
                </b-col>
            </b-row>
        </b-col>
        <b-col v-for="s in statusFields" class="col-1 text-center">
          <div class="text-center pt-3">
            {{ item[s] }}
          </div>
        </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
    name: "CampaignItem",
    props: {
      item: Object
    },
    data () {
      return {
        statusFields: ['status', 'opens', 'clicks']
      }
    },
    computed: {
        subjectJoin: function() {
            if (typeof this.item.subject !== 'undefined' && this.item.subject.length)  {
                return this.item.subject.join(', ');
            }
            return '';
        },
        dateUTCString: function() {
            if (typeof this.item.date_updated !== 'undefined' && this.item.date_updated.length)  {
                return new Date(this.item.date_updated).toUTCString();
            }
            return '';
        }
    }
}
</script>

<style scoped>
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
    .campaignName{
        font-size: 20px;
        line-height: inherit;
        color: #007c89;
        text-decoration: none;
    }
</style>
