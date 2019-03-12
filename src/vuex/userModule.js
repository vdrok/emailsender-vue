import { userService } from '../services';
import Vue from 'vue'

const initialState = { status: {}, userInfo: {email: ''}, getByIdHashMap: {}, errorText: '' };

export const user = {
    namespaced: true,
    state: initialState,
    actions: {
        getInformation({ dispatch, commit }) {
            commit('getInformationRequest');

            userService.getInformation()
                .then(
                    userInfo => {
                        commit('getInformationSuccess', userInfo);
                    },
                    error => {
                        commit('getInformationFailure', error);
                    }
                );
        },
        getById({ dispatch, commit }, {userID}){
            if(!user.state.getByIdHashMap[userID]||!this.state.getByIdHashMap[userID].inRequest) {
                commit('getByIdRequest', userID);

                userService.getById(userID)
                    .then(
                        userInfo => {
                            commit('getByIdSuccess', {userInfo, userID});
                        },
                        error => {
                            commit('getByIdFailure', {userInfo, error});
                        }
                    );
            }
        },
        getAll({ dispatch, commit }){
            commit('getAllRequest');

            userService.getAll()
                .then(
                    usersList => {
                        commit('getAllSuccess', usersList);
                    },
                    error => {
                        commit('getAllFailure', error);
                    }
                );
        }
    },
    mutations: {
        getInformationRequest(state) {
            state.status = { inRequest: true};
            state.errorText = '';
            state.userInfo = {email: ''};
        },
        getInformationSuccess(state, userInfo) {
            state.status = { got: true};
            state.userInfo = userInfo;
            state.errorText = '';
        },
        getInformationFailure(state, error) {
            state.status = {};
            state.errorText = error;
            state.userInfo = {email: ''};
        },
        getByIdRequest(state, userID) {
            state.status = { inRequest: true};
            Vue.set(state.getByIdHashMap, userID, {inRequest: true});
            state.errorText = '';
        },
        getByIdSuccess(state, {userInfo, userID}) {
            state.status = { got: true};
            Vue.set(state.getByIdHashMap, userID, userInfo);
            state.errorText = '';
        },
        getByIdFailure(state, {userID, error}) {
            state.status = {};
            Vue.set(state.getByIdHashMap, userID, null);
            state.errorText = error;
        },
    }
};
