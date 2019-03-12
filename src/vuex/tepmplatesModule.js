import {templatesService} from '../services';

const initialState = {
    status: {
        inRequest: false,
        got: false,
    },
    templateInfo: {

    },
    templatesData: {
        Offset: 0,
        Limit: 0,
        Total: 0,
        letter_templates: [],
    },
    PerPage: 3,
    errorText: '',
};

export const templates = {
    namespaced: true,
    state: initialState,
    actions: {
        createT(
            {state, dispatch, commit},
            {template_name, from_name, reply_email, body_text, body_html, from_email, subject}) {
            commit('createTRequest');

            templatesService.createT(template_name, from_name, reply_email,
                body_text, body_html, from_email, subject).then(
                templateInfo => {
                    commit('createTSuccess', templateInfo);
                    dispatch('getList',
                        {limit: state.PerPage, offset: 0});
                    //TODO: show current page
                },
                error => {
                    commit('createTFailure', error);
                },
            );
        },
        deleteT({state, dispatch, commit}, {template_id}) {
            commit('deleteTRequest');

            templatesService.deleteT(template_id).then(
                () => {
                    commit('deleteTSuccess');
                    dispatch('getList',
                        {limit: state.PerPage, offset: 0});
                    //TODO: show current page
                },
                error => {
                    commit('deleteTFailure', error);
                },
            );
        },
        getById({dispatch, commit}, {template_id}) {
            commit('getByIdRequest', template_id);

            templatesService.getById(template_id).then(
                template => {
                    commit('getByIdSuccess', template);
                },
                error => {
                    commit('getByIdFailure', error);
                },
            );
        },
        getList({dispatch, commit}, {limit, offset}) {
            commit('getListRequest');

            templatesService.getList(limit, offset).then(
                (data) => {
                    commit('getListSuccess', data);
                    //commit('clear');
                },
                error => {
                    commit('getListFailure', error);
                },
            );
        },
        updateT(
            {state, dispatch, commit}, {template_name, body_html, templateId}) {
            commit('updateTRequest', templateId);

            templatesService.updateT(template_name, body_html, templateId).then(
                (data) => {
                    commit('updateTSuccess', data);
                    dispatch('getList',
                        {limit: state.PerPage, offset: 0});
                    //TODO: show current page
                },
                error => {
                    commit('updateTFailure', error);
                },
            );
        },
    },
    mutations: {
        createTRequest(state) {
            state.status = {inRequest: true};
            state.errorText = '';
        },
        createTSuccess(state) {
            state.status = {got: true};
            state.errorText = '';
        },
        createTFailure(state, error) {
            state.status = {};
            state.errorText = error;
        },
        deleteTRequest(state) {
            state.status = {inRequest: true};
            state.errorText = '';
        },
        deleteTSuccess(state) {
            state.status = {got: true};
            state.errorText = '';
        },
        deleteTFailure(state, error) {
            state.status = {};
            state.errorText = error;
        },
        getListRequest(state) {
            state.status = {inRequest: true};
            state.errorText = '';
            state.templatesData = {letter_templates: []};
        },
        getListSuccess(state, data) {
            state.status = {got: true};
            state.errorText = '';
            state.templatesData = data;
        },
        getListFailure(state, error) {
            state.status = {};
            state.errorText = error;
            state.templatesData = {letter_templates: []};
        },
        getByIdRequest(state) {
            state.status = {inRequest: true};
            state.errorText = '';
            state.templateInfo = {};
        },
        getByIdSuccess(state, templateInfo) {
            state.status = {got: true};
            state.templateInfo = templateInfo;
            state.errorText = '';
        },
        getByIdFailure(state, error) {
            state.status = {};
            state.errorText = error;
            state.templateInfo = {};
        },
        updateTRequest(state) {
            state.status = {inRequest: true};
            state.errorText = '';
            state.templateInfo = {};
        },
        updateTSuccess(state, templateInfo) {
            state.status = {got: true};
            state.templateInfo = templateInfo;
            state.errorText = '';
        },
        updateTFailure(state, error) {
            state.status = {};
            state.errorText = error;
        },
        clear(state) {
            state.templateInfo = {};
        },
    },
};
