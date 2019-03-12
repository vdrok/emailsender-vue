import { emailsService } from '../services';

const initialState = {
    status: {
        inRequest: false,
        got: false
    },
    emailInfo: {
    },
    emailsData: {
        Offset: 0,
        Limit: 0,
        Total: 0,
        emails: []
    },
    errorText: ''
};

export const emails = {
    namespaced: true,
    state: initialState,
    actions: {
        createE({ dispatch, commit}, {listId, full_name, email} ) {
            commit('createERequest');

            emailsService.createE(listId, full_name, email)
                .then(
                    emailInfo => {
                        commit('createESuccess', emailInfo);
                        dispatch('getList', {limit: 10, offset: 0});
                        //TODO: show current page
                    },
                    error => {
                        commit('createEFailure', error);
                    }
                );
        },
        deleteE({ dispatch, commit}, {listId, emailId} ) {
            commit('deleteERequest');

            emailsService.deleteE(listId, emailId)
                .then(
                    () => {
                        commit('deleteESuccess');
                        dispatch('getList', {limit: 10, offset: 0});
                        //TODO: show current page
                    },
                    error => {
                        commit('deleteEFailure', error);
                    }
                );
        },
        getById({ dispatch, commit}, {emailId} ) {
            commit('getByIdRequest', emailId);

            emailsService.getById(emailId)
                .then(
                    template => {
                        commit('getByIdSuccess', template);
                    },
                    error => {
                        commit('getByIdFailure', error);
                    }
                );
        },
        getList({ dispatch, commit}, {listId, limit, offset} ) {
            commit('getListRequest');

            emailsService.getList(listId, limit, offset)
                .then(
                    (data) => {
                        commit('getListSuccess', data);
                        //commit('clear');
                    },
                    error => {
                        commit('getListFailure', error);
                    }
                );
        },
        updateE({ dispatch, commit}, {listId, emailId, name} ) {
            commit('updateERequest', listId);

            emailsService.updateE(listId, emailId, name)
                .then(
                    (data) => {
                        commit('updateESuccess', data);
                        dispatch('getList', {limit: 10, offset: 0});
                        //TODO: show current page
                    },
                    error => {
                        commit('updateEFailure', error);
                    }
                );
        }
    },
    mutations: {
        createERequest(state) {
            state.status = { inRequest: true};
            state.errorText = '';
        },
        createESuccess(state) {
            state.status = { got: true};
            state.errorText = '';
        },
        createEFailure(state, error) {
            state.status = {};
            state.errorText = error;
        },
        deleteERequest(state) {
            state.status = { inRequest: true};
            state.errorText = '';
        },
        deleteESuccess(state) {
            state.status = { got: true};
            state.errorText = '';
        },
        deleteEFailure(state, error) {
            state.status = {};
            state.errorText = error;
        },
        getListRequest(state) {
            state.status = {inRequest: true};
            state.errorText = '';
            state.emailsData = {emails: []};
        },
        getListSuccess(state, data) {
            state.status = { got: true};
            state.errorText = '';
            state.emailsData = data;
        },
        getListFailure(state, error) {
            state.status = {};
            state.errorText = error;
            state.emailsData = {emails: []}
        },
        getByIdRequest(state) {
            state.status = { inRequest: true};
            state.errorText = '';
            state.emailInfo = {};
        },
        getByIdSuccess(state, emailInfo) {
            state.status = { got: true};
            state.emailInfo = emailInfo;
            state.errorText = '';
        },
        getByIdFailure(state, error) {
            state.status = {};
            state.errorText = error;
            state.emaiInfo = {};
        },
        updateERequest(state) {
            state.status = { inRequest: true};
            state.errorText = '';
            state.emailInfo = {};
        },
        updateESuccess(state, emailInfo) {
            state.status = { got: true};
            state.emailListInfo = emailInfo;
            state.errorText = '';
        },
        updateEFailure(state, error) {
            state.status = {};
            state.errorText = error;
        },
        clear(state){
            state.emailListInfo = {};
        }
    }
};
