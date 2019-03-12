import { emailsListService } from '../services';

const initialState = {
    status: {
        inRequest: false,
        got: false
    },
    emailListInfo: {
    },
    emailsData: {
        Offset: 0,
        Limit: 0,
        Total: 0,
        email_lists: []
    },
    errorText: '',
    PerPage: 3,
    currentPage: 1

};

export const emailsList = {
    namespaced: true,
    state: initialState,
    actions: {
        async createE({ dispatch, commit, state} ) {
            return new Promise((resolve, reject) => {
                commit('createERequest');
                emailsListService.createE(state.emailListInfo.list_name,
                    state.emailListInfo.description).then(
                    emailInfo => {
                        commit('createESuccess', emailInfo);
                        if (state.emailsData.Total < (state.PerPage * state.currentPage)) {
                            dispatch('getList', {limit: state.PerPage, offset: ((state.currentPage - 1) * state.PerPage)});
                            dispatch('setCurrentPage', state.currentPage);
                        } else {
                            dispatch('getList', {limit: state.PerPage, offset: (state.currentPage * state.PerPage)});
                            dispatch('setCurrentPage', state.currentPage + 1);

                        }
                        resolve(true);
                    },
                    error => {
                        commit('createEFailure', error);
                        reject(error);
                    }
                );
            });

        },
        async deleteE({ dispatch, commit, state}, {emailId} ) {
          return new Promise((resolve, reject) => {
          commit('deleteERequest');
          emailsListService.deleteE(emailId)
            .then(
              () => {
                commit('deleteESuccess');
                if (((state.emailsData.Total - 1) % state.PerPage) == 0) {
                  let newPage = (state.currentPage === 1) ? 1 : (state.currentPage - 1)

                  dispatch('getList', {
                    limit: state.PerPage, 
                    offset: (newPage - 1) * state.PerPage
                  })

                  dispatch('setCurrentPage', newPage);
                } else {
                    let key = emailsListService.findById(state.emailsData.email_lists, emailId);
                    commit('setTotal', state.emailsData.Total - 1);
                    commit('deleteEmailList', key);
                }
                resolve(true);
              },
              error => {
                  commit('deleteEFailure', error);
                  reject(error);
              }
            );
          });
        },
        getById({ dispatch, commit}, {emailId} ) {
            commit('getByIdRequest', emailId);

            emailsListService.getById(emailId)
                .then(
                    template => {
                        commit('getByIdSuccess', template);
                    },
                    error => {
                        commit('getByIdFailure', error);
                    }
                );
        },
        getList({commit}, {limit, offset} ) {
            commit('getListRequest');

            emailsListService.getList(limit, offset)
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
        async  updateE({ dispatch, commit, state} ) {
            return new Promise((resolve, reject) => {
                commit('updateERequest');

                emailsListService.updateE(state.emailListInfo.id,
                    state.emailListInfo.name, state.emailListInfo.description).
                    then(
                        (data) => {
                            commit('updateESuccess', data);
                            dispatch('getList',
                                {limit: state.PerPage, offset: (state.currentPage - 1) * state.PerPage});
                            dispatch('setCurrentPage', state.currentPage);
                            resolve(true);
                        },
                        error => {
                            commit('updateEFailure', error);
                            reject(error);
                        }
                    );
            });
        },
        reset ({commit}) {
            commit('reset');
        },
        setEmailListName ({commit}, payload) {
            commit('setEmailListName', payload);
        },
        setEmailListDescription ({commit}, payload) {
            commit('setEmailListDescription', payload);
        },
        setCurrentPage ({commit}, payload) {
            commit('setCurrentPage', payload);
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
            state.emailsData = {email_lists: []};
        },
        getListSuccess(state, data) {
            state.status = { got: true};
            state.errorText = '';
            state.emailsData = data;
        },
        getListFailure(state, error) {
            state.status = {};
            state.errorText = error;
            state.emailsData = {email_lists: []}
        },
        getByIdRequest(state) {
            state.status = { inRequest: true};
            state.errorText = '';
            state.emailListInfo = {};
        },
        getByIdSuccess(state, emailListInfo) {
            state.status = { got: true};
            state.emailListInfo = emailListInfo;
            state.errorText = '';
        },
        getByIdFailure(state, error) {
            state.status = {};
            state.errorText = error;
            state.emailListInfo = {};
        },
        updateERequest(state) {
            state.status = { inRequest: true};
            state.errorText = '';
            //state.emailListInfo = {};
        },
        updateESuccess(state, emailListInfo) {
            state.status = { got: true};
            state.emailListInfo = emailListInfo;
            state.errorText = '';
        },
        updateEFailure(state, error) {
            state.status = {};
            state.errorText = error;
        },
        reset(state){
            state.emailListInfo = {
                list_name: '',
                description: ''
            };
        },
        setEmailListName(state, payload) {
            state.emailListInfo.list_name = payload;
        },
        setEmailListDescription(state, payload) {
            state.emailListInfo.description = payload;
        },
        setCurrentPage(state, payload) {
            state.currentPage = payload;
        },
        deleteEmailList(state, key) {
            state.emailsData.email_lists.splice(key, 1);
        },
        setTotal (state, payload) {
            state.emailsData.Total = payload;
        }
    }
};
