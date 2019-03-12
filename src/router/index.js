import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Register from '../components/Register'
import Campaigns from '../components/Campaigns'
import Content from '../components/Content'
import Lists from '../components/Lists'
import EditEmailList from '../components/EditEmailList'
import Reports from '../components/Reports'
import EditPropertiesTemplate from '../components/EditPropertiesTemplate'
import EditCodeTemplate from '../components/EditCodeTemplate'
import EditCodeFooterTemplate from '../components/EditCodeFooterTemplate'
import EditPropertiesFooterTemplate from '../components/EditPropertiesFooterTemplate'
import EditCampaign from '../components/EditCampaign'
import CampaignChooseEmailList from '../components/CampaignChooseEmailList'
import CampaignInfo from '../components/CampaignInfo'
import CampaignEditTemplate from '../components/CampaignEditTemplate'
import CampaignConfirm from '../components/CampaignConfirm'
import CampaignSmtpList from '../components/CampaignSmtpList'
import Templates from '../components/Templates'
import ViewList from '../components/ViewList'
import AdminLists from '../components/admin/Lists'
import EditListItems from '../components/admin/EditListItems'
import ListService from '../services/listService.js'
import WebMails from '../components/admin/Webmails'
import DKIM from '../components/admin/DKIM'
import ProfileMain from '../components/profile/Profile'
import ProfileBilling from '../components/profile/Billing'
import ProfileSecurity from '../components/profile/Security'
import {store} from '../vuex'
Vue.use(Router);

const backendSMTP = new ListService('smtp-lists', 'smtps')
const backendSOCKS = new ListService('socks-lists', 'socks')

export const router =  new Router({
    mode: 'history',
    linkActiveClass: 'active',
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/register',
            name: 'Register',
            component: Register
        },
        {
            path: '/campaigns',
            name: 'Campaigns',
            component: Campaigns,
            alias: '/',
            beforeEnter: (to, from, next) => {
                if(!to.params.campaignPageNumber){
                    to.params.campaignPageNumber=1;
                    next({ name: 'Campaigns', params: {campaignPageNumber: 1}});
                }
                else {
                    next();
                }
            },
            children: [
                {
                    path: 'edit-campaign/:id?',
                    name: 'Edit Campaign',
                    components: {
                        modal: EditCampaign,
                    },
                    meta: {
                        showModal: true
                    }
                },
                {
                    path: 'choose-list/:id?',
                    name: 'Choose List',
                    components: {
                        modal: CampaignChooseEmailList,
                    },
                    meta: {
                        showModal: true
                    }
                },
                {
                    path: 'campaign-info/:id?',
                    name: 'Campaign Info',
                    components: {
                        modal: CampaignInfo,
                    },
                    meta: {
                        showModal: true
                    }
                },
                {
                    path: 'campaign-edit-template/:id?',
                    name: 'Campaign Edit Template',
                    components: {
                        modal: CampaignEditTemplate,
                    },
                    meta: {
                        showModal: true
                    }
                },
                {
                    path: 'campaign-smtp-list/:id?',
                    name: 'Choose SMTP list',
                    components: {
                        modal: CampaignSmtpList,
                    },
                    meta: {
                        showModal: true
                    }
                },
                {
                    path: 'campaign-confirm/:id?',
                    name: 'Campaign Confirm',
                    components: {
                        modal: CampaignConfirm,
                    },
                    meta: {
                        showModal: true
                    }
                }
            ]
        },
        {
            path: '/content',
            name: 'Content',
            component: Content,
        },
        {
            path: '/lists/:listsPageNumber?',
            name: 'Lists',
            component: Lists,
            beforeEnter: (to, from, next) => {
                if (!to.params.listsPageNumber) {
                    to.params.listsPageNumber = 1;
                    next({name: 'Lists', params: {listsPageNumber: 1}});
                }
                else {
                    next();
                }
            },
            children: [
                {
                    path: 'edit-email-list/:id?',
                    name: 'Edit Email List',
                    components: {
                        modal: EditEmailList,
                    },
                    meta: {
                        showModal: true
                    }
                }
            ]
        },
        {
            path: '/lists/:listsPageNumber?/view-list/:viewListItem/:viewListsPageNumber?',
            name: 'View List',
            component: ViewList,
            beforeEnter: (to, from, next) => {
                if(!to.params.viewListsPageNumber){
                    to.params.viewListsPageNumber=1;
                    next({ name: 'View List', params: {...to.params, viewListsPageNumber: 1}});
                }
                else {
                    next();
                }
            }
        },
        {
            path: '/reports',
            name: 'Reports',
            component: Reports,
        },
        {
            path: '/templates/:templatesPageNumber?',
            name: 'Templates',
            component: Templates,
            beforeEnter: (to, from, next) => {
                if(!to.params.templatesPageNumber){
                    to.params.templatesPageNumber=1;
                    next({ name: 'Templates', params: {templatesPageNumber: 1}});
                }
                else {
                    next();
                }
            },
            children: [
                {
                    path: 'edit-properties/:id?',
                    name: 'Edit Properties',
                    components: {
                            body: EditPropertiesTemplate,
                            footer: EditPropertiesFooterTemplate
                    },
                    meta: {
                        showModal: true
                    }
                },
                {
                    path: 'edit-code/:id?',
                    name: 'Edit Code',
                    components: {
                        body: EditCodeTemplate,
                        footer: EditCodeFooterTemplate
                    },
                    meta: {
                        showModal: true
                    }
                }
            ]
        },
        // SMTP Lists
        {
          path: '/admin/smtp',
          name: 'SMTPLists',
          component: AdminLists,
          props: {
            ownPath: '/admin/smtp',
            backend: backendSMTP,
            listsProp: 'smtp_lists',
            itemName: 'SMTP',
            addFields: true
          }
        },
        {          
          path: '/admin/smtp/:listID',
          name: 'SMTPList',
          component: EditListItems,
          props: (route) => ({
            id: route.params.listID,
            backend: backendSMTP,
            headerItem: 'SMTP',
            serversProp: 'smtps',
            baseURL: '/admin/smtp/'
          })
        },
        // SOCKS Lists
        {
          path: '/admin/socks',
          name: 'SOCKSLists',
          component: AdminLists,
          props: {
            ownPath: '/admin/socks',
            backend: backendSOCKS,
            listsProp: 'socks_lists',
            itemName: 'SOCKS',
            addFields: false
          }
        },
        {          
          path: '/admin/socks/:listID',
          name: 'SOCKSList',
          component: EditListItems,
          props: (route) => ({
            id: route.params.listID,
            backend: backendSOCKS,
            headerItem: 'SOCKS',
            serversProp: 'socks',
            baseURL: '/admin/socks/'            
          })
        },
        // Webmails
        {
          path: '/admin/webmails',
          name: 'Webmails',
          component: WebMails
        },
        // DKIM
        {
          path: '/admin/dkim',
          name: 'Domains',
          component: DKIM
        },
        // Profile
        {
          path: '/profile',
          name: 'ProfileMain',
          component: ProfileMain
        },
        {
          path: '/profile/billing',
          name: 'ProfileBilling',
          component: ProfileBilling
        },
        {
          path: '/profile/security',
          name: 'ProfileSecurity',
          component: ProfileSecurity
        },
        { path: '*', redirect: '/' }
    ]
});

router.beforeEach((to, from, next) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login', '/register'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = store.state.authentication.status.loggedIn;
    if (authRequired && !loggedIn) {
        return next('/login');
    }
    else if(to.path==='/'){
        return next('/campaigns');
    }
    next();
});
