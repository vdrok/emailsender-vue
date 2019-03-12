import {helpService, userService} from '../services';
import { router } from '../router';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
    ? { status: { loggedIn: (new Date(user.token_expired_at)>new Date()) }, user, errorText: '' }
    : { status: {loggedIn: false}, user: null, errorText: '' };

export const authentication = {
    namespaced: true,
    state: initialState,
    actions: {
        login({ dispatch, commit }, { email, password, keepMeLoggedIn }) {
            commit('loginRequest', { email });

            userService.login(email, password, keepMeLoggedIn)
                .then(
                    user => {
                        commit('loginSuccess', user);
                        router.push('/');
                    },
                    error => {
                        commit('loginFailure', error);
                    }
                );
        },
        logout({ commit }) {
            helpService.logout();
            commit('logout');
        },
        refresh({ commit }){
            commit('refreshRequest');
            userService.refresh().then(
                user => {
                    commit('refreshSuccess', user);
                },
                error => {
                    commit('refreshFailure', error);
                }
            );
        }
    },
    mutations: {
        loginRequest(state, user) {
            state.status = { loggingIn: true};
            state.user = user;
            state.errorText = '';
        },
        loginSuccess(state, user) {
            state.status = { loggedIn: (new Date(user.token_expired_at)>new Date())};
            state.user = user;
            state.errorText = '';
        },
        refreshFailure(state, error) {
            state.status = {};
            state.user = null;
            state.errorText = error;
        },
        refreshSuccess(state, user) {
            state.status = { loggedIn: (new Date(user.token_expired_at)>new Date())};
            state.user = user;
            state.errorText = '';
        },
        loginFailure(state, error) {
            state.status = {};
            state.user = null;
            state.errorText = error;
        },
        logout(state) {
            state.status = {};
            state.user = null;
            state.errorText = '';
        }
    }
}
