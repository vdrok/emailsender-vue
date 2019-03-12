import Vuex from "vuex";
import Vue from "vue";

import { authentication } from './authenticationModule';
import { registration } from './registrationModule';
import { user } from './userModule';
import { templates } from './tepmplatesModule';
import { campaigns } from './campaignsModule';
import { emailsList } from './emailsListModule';
import { emails } from './emailsModule';
import { toasts } from './../components/toast/ToastStoreModule.js';

Vue.use(Vuex);

export const store =  new Vuex.Store({
    modules: {
        authentication,
        registration,
        user,
        templates,
        campaigns,
        emailsList,
        emails,
        toasts
    }
});
