<template>
  <b-navbar toggleable="md" type="dark" variant="info">
    <b-container>

    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-collapse is-nav id="nav_collapse">

      <b-navbar-nav>
        <b-nav-item to="/campaigns">Campaigns</b-nav-item>
        <b-nav-item :to="{ name: 'Templates', params: {templatesPageNumber: 1}}">Templates</b-nav-item>
        <b-nav-item to="/lists">Lists</b-nav-item>
        <b-nav-item to="/reports">Reports</b-nav-item>
        <b-nav-item to="/content">Content</b-nav-item>
        
        <b-nav-item v-if="isAdmin" to="/admin/smtp">SMTP</b-nav-item>
        <b-nav-item v-if="isAdmin" to="/admin/socks">Socks</b-nav-item>
        <b-nav-item v-if="isAdmin" to="/admin/webmails">Webmails</b-nav-item>
        <b-nav-item v-if="isAdmin" to="/admin/dkim">Domains</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-button variant="outline-secondary" class="my-2 my-sm-0 mr-3 myClass">{{userBalance}}$</b-button>
        <b-nav-item-dropdown right>
          <!-- Using button-content slot -->
          <template slot="button-content">
            <em>{{userName}}</em>          
          </template>
          <b-dropdown-item to="/profile" href="#">Profile</b-dropdown-item>
          <b-dropdown-item @click="logoutHandler" href="#">Signout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
export default {
  name: "Header",
  methods: {
    logoutHandler(){
      this.$store.dispatch('authentication/logout');
    }
  },
  created() {
    this.$store.dispatch('user/getInformation', null, {root: true});
  },
  computed: {
    userName () {
      return this.$store.state.user.userInfo && this.$store.state.user.userInfo.username;
    },
    userBalance () {
      return this.$store.state.user.userInfo && this.$store.state.user.userInfo.balance;
    },
    isAdmin () {
      return this.$store.state.user.userInfo.is_admin
      //return true
    }
  }
}
</script>

<style scoped>
  .myClass{
    width: 100px;
  }
</style>
