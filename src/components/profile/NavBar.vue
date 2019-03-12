<template>
  <b-container class="mt-5">
    <b-row class="row-12 flex-container">
      <b-col class="col-8 flex-wide">
          <h1>Account</h1>
      </b-col>
    </b-row>

    <b-row class="row-12 mt-2">
      <b-col class="col-2 pl-0">
        <b-nav vertical class="w-25">
          <b-nav-item v-for="i in items" :to="i.path"                                            
                      active-class="nav-active" exact>{{ i.label }}</b-nav-item>
        </b-nav> 
      </b-col> 

      <b-col class="col-10 pt-2">
        <slot></slot>        
      </b-col>    
    </b-row>
  </b-container>
</template>

<script>
import * as util from '../../helpers/util.js'

export default {
  name: 'NavBar',
  data () {
    return {
      items: [
        { label: 'Profile', path: '/profile' },
        { label: 'Billing', path: '/profile/billing' },
        { label: 'Security', path: '/profile/security' }
      ]
    }
  }
}
</script>

<style>
.nav-active {
  font-weight: bold;
}
</style>
