import {templatesService} from '../services';
import {emailsListService} from '../services';
import {emailsService} from '../services';
import {campaignsService} from '../services/campaignsService.js';
import ListService from '../services/listService.js'

const backendSMTP = new ListService('smtp-lists', 'smtps');

const initialState = {
    status: {
        inRequest: false,
        got: false,
    },
    campaignInfo: {
        campaign_name: '',
        campaign_template: '',
        email_list: '',
        smtp_list: '',
        email_subject: '',
        from_name: '',
        from_email: '',
        templateInfo: {},

    },
    campaignData: {
        Offset: 0,
        Limit: 0,
        Total: 0,
        campaigns: []
    },
    templatesList: [],
    emailLists: [],
    smtpLists: [],
    errorText: '',
    PerPage: 3,
};

export const campaigns = {
    namespaced: true,
    state: initialState,
    actions: {
        async  createCampaign({state, dispatch, commit}) {
            return new Promise((resolve, reject) => {
                commit('createCampaignRequest');

                campaignsService.createCampaign(
                    {
                        campaign_name: state.campaignInfo.campaign_name,
                        from_name: state.campaignInfo.from_name.replace(/\s/g,
                            '').split(','),
                        reply_email: state.campaignInfo.from_email,
                        from_email: state.campaignInfo.from_email,
                        subject: state.campaignInfo.email_subject.replace(/\s/g,
                            '').split(','),
                        body_text: state.campaignInfo.templateInfo.body_text,
                        body_html: state.campaignInfo.templateInfo.body_html,
                        smtp_list_id: state.campaignInfo.smtp_list.id,
                        email_list_id: state.campaignInfo.email_list.id
                    }
                ).then(
                    templateInfo => {
                        commit('createCampaignSuccess', templateInfo);
                        dispatch('getCampaignsList',
                            {limit: state.PerPage, offset: 0});
                        //TODO: show current page
                        resolve(true);
                    },
                    error => {
                        commit('createCampaignFailure', error);
                        reject(error);
                    },
                );
            });
        },
        deleteT({state, dispatch, commit}, {template_id}) {
            commit('deleteTRequest');

            templatesService.deleteT(template_id).then(
                () => {
                    commit('deleteTSuccess');
                    dispatch('getList',
                        {limit: state.templateInfo.PerPage, offset: 0});
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
        getCampaignsList({state, dispatch, commit}, {limit, offset}){
            commit('getCampaignsListRequest');

            campaignsService.getList(limit, offset).then(
                (data) => {
                    commit('getCampaignsListSuccess', data);
                    //commit('clear');
                },
                error => {
                    commit('getCampaignsListFailure', error);
                },
            );
        },
        getTemplateList({dispatch, commit}, {limit, offset}) {
            commit('getTemplateListRequest');

            templatesService.getList(limit, offset).then(
                (data) => {
                    commit('getTemplateListSuccess', data);
                    //commit('clear');
                },
                error => {
                    commit('getTemplateListFailure', error);
                },
            );
        },
        getTemplateById({state, commit}) {
            commit('getTemplateByIdRequest');

            templatesService.getById(state.campaignInfo.campaign_template).then(
                template => {
                    commit('getTemplateByIdSuccess', template);
                },
                error => {
                    commit('getTemplateByIdFailure', error);
                },
            );
        },
        getEmailLists({state, dispatch, commit}, {limit, offset}) {
            commit('getEmailListRequest');

            emailsListService.getList(limit, offset).then(
                (data) => {
                    commit('getEmailListsSuccess', data);
                    for (let i = 0; i < state.emailLists.length; i++) {
                        dispatch('getEmailsByEmailListId',
                            {id: state.emailLists[i].id, index: i});
                    }
                },
                error => {
                    commit('getEmailListsFailure', error);
                },
            );
        },
        getSMTPlists({state, dispatch, commit}, {limit, offset}) {
            commit('getSMTPListRequest');

            backendSMTP.enumLists(limit, offset).then(
                (data) => {
                    commit('getSMTPListSuccess', data);
                    // for (let i = 0; i < state.emailLists.length; i++) {
                    //     dispatch('getEmailsByEmailListId',
                    //         {id: state.emailLists[i].id, index: i});
                    // }
                },
                error => {
                    commit('getSMTPListFailure', error);
                },
            );
        },
        getEmailsByEmailListId({state, commit}, {id, index}) {
            emailsService.getList(id, 0, 0).then(
                (data) => {
                    commit('getEmailsByEmailListIdSuccess',
                        {emails_data: data, index: index});
                },
                error => {
                    commit('getEmailsByEmailListIdFailure', error);
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
                        {limit: state.templateInfo.PerPage, offset: 0});
                    //TODO: show current page
                },
                error => {
                    commit('updateTFailure', error);
                },
            );
        },
        setEmailList({state, commit}, payload) {
            for (let i = 0; i < state.emailLists.length; i++) {
                if (state.emailLists[i].id == payload) {
                    commit('setEmailList', state.emailLists[i]);
                }
            }

        },
        setSMTPList({state, commit}, payload) {
            for (let i = 0; i < state.smtpLists.length; i++) {
                if (state.smtpLists[i].id == payload) {
                    commit('setSMTPList', state.smtpLists[i]);
                }
            }

        },
    },
    mutations: {
        createCampaignRequest(state) {
            state.status = {inRequest: true};
            state.errorText = '';
        },
        createCampaignSuccess(state) {
            state.status = {got: true};
            state.errorText = '';
        },
        createCampaignFailure(state, error) {
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
        getTemplateListRequest(state) {
            state.status = {inRequest: true};
            state.errorText = '';
            state.templatesList = [];
        },
        getCampaignsListRequest(state){
            state.status = {inRequest: true};
            state.errorText = '';
            state.campaignData = initialState.campaignData;
        },
        getCampaignsListSuccess(state, data){
            state.status = {got: true};
            state.errorText = '';
            state.campaignData = data;
        },
        getCampaignsListFailure(state, error){
            state.status = {};
            state.errorText = error;
            state.campaignData = initialState.campaignData;
        },
        getTemplateByIdRequest(state) {
            state.status = {inRequest: true};
            state.errorText = '';
            state.campaignInfo.templateInfo = {};
        },
        getTemplateByIdSuccess(state, templateInfo) {
            state.status = {inRequest: true};
            state.errorText = '';
            state.campaignInfo.templateInfo = templateInfo;
        },
        getTemplateByIdFailure(state, error) {
            state.status = {};
            state.errorText = error;
            state.campaignInfo.templateInfo = {};
        },
        getTemplateListSuccess(state, data) {
            state.status = {got: true};
            state.errorText = '';
            for (let i = 0; i < data.letter_templates.length; i++) {
                state.templatesList.push({
                    value: data.letter_templates[i].id,
                    text: data.letter_templates[i].template_name,
                });
            }
        },
        getEmailListsSuccess(state, data) {
            state.status = {got: true};
            state.errorText = '';
            state.emailLists = data.email_lists;
        },
        getEmailListRequest(state) {
            state.status = {inRequest: true};
            state.errorText = '';
            state.emailLists = [];
        },
        getSMTPListRequest(state) {
            state.status = {inRequest: true};
            state.errorText = '';
            state.smtpLists = [];
        },
        getSMTPListSuccess(state, data) {
            state.status = {got: true};
            state.errorText = '';
            state.smtpLists = data.smtp_lists;
        },
        getSMTPListFailure(state, error) {
            state.status = {};
            state.errorText = error;
            state.smtpLists = [];
        },
        getTemplateListFailure(state, error) {
            state.status = {};
            state.errorText = error;
            state.templatesList = [];
        },
        getEmailListsFailure(state, error) {
            state.status = {};
            state.errorText = error;
            state.emailLists = [];
        },
        getByIdRequest(state) {
            state.status = {inRequest: true};
            state.errorText = '';
            state.campaignInfo = {};
        },
        getByIdSuccess(state, campaignInfo) {
            state.status = {got: true};
            state.campaignInfo = campaignInfo;
            state.errorText = '';
        },
        getByIdFailure(state, error) {
            state.status = {};
            state.errorText = error;
            state.campaignInfo = {};
        },
        getEmailsByEmailListIdFailure(state, error) {
            state.status = {};
            state.errorText = error;
            state.emailLists = [];
        },
        getEmailsByEmailListIdSuccess(state, payload) {
            state.emailLists[payload.index].total = payload.emails_data.Total;
        },
        updateTRequest(state) {
            state.status = {inRequest: true};
            state.errorText = '';
            state.campaignInfo = {};
        },
        updateTSuccess(state, campaignInfo) {
            state.status = {got: true};
            state.campaignInfo = campaignInfo;
            state.errorText = '';
        },
        updateTFailure(state, error) {
            state.status = {};
            state.errorText = error;
        },
        clear(state) {
            state.campaignInfo = initialState.campaignInfo;
        },
        setEmailList(state, payload) {
            state.campaignInfo.email_list = payload;
        },
        setSMTPList(state, payload) {
            state.campaignInfo.smtp_list = payload;
        },
    },
};
