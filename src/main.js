import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

import App from './App'
import {store} from './vuex'
import {router} from './router'
import Header from './components/Header'
import CampaignItem from './components/CampaignItem'
import TemplateItem from './components/TemplateItem'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { ModelSelect } from 'vue-search-select'
import Vuelidate from 'vuelidate'

import './common.css'

Vue.use(BootstrapVue);
library.add(faSearch);
library.add(faCheckCircle);
Vue.component('header-super', Header);
Vue.component('campaign-item', CampaignItem);
Vue.component('template-item', TemplateItem);
//Vue.component('email-list-item', ListsEmailsItem);
//Vue.component('view-list-item', ViewListItem);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('model-select', ModelSelect);
Vue.use(Vuelidate);

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
});
