import config from 'config';
import {authHeader} from '../helpers/authHeader';
import {helpService} from './helpService';

export const campaignsService = {
    createCampaign,
    deleteE,
    getList,
    getById,
    updateE,
    exportE,
    importE,
    findById,
};

function createCampaign(data) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            campaign_name: data.campaign_name,
            from_name: data.from_name,
            from_email: data.from_email,
            reply_email: data.reply_email,
            subject: data.subject,
            body_text: data.body_text,
            body_html: data.body_html,
            content_type: 'text/html',
            smtp_list_id: data.smtp_list_id,
            email_list_id: data.email_list_id,
            status: 'new',
        }),
    };

    return fetch(`${config.apiUrl}campaigns`, requestOptions).
        then(helpService.handleResponse).
        then(campaign => {
            return campaign;
        });
}

function deleteE(listId) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(),
    };

    return fetch(`${config.apiUrl}email-lists/${listId}`, requestOptions).
        then(helpService.handleResponse).
        then(emailList => {
            return emailList;
        });
}

function getList(limit, offset) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${config.apiUrl}campaigns?limit=${limit}&offset=${offset}`,
        requestOptions).then(helpService.handleResponse).then(campaignsLists => {
        return campaignsLists;
    });
}

function getById(listId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${config.apiUrl}email-lists/${listId}`, requestOptions).
        then(helpService.handleResponse).
        then(emailList => {
            return emailList;
        });
}

function updateE(listId, name, description) {
    const requestOptions = {
        method: 'PATCH',
        headers: authHeader(),
        body: JSON.stringify({id: listId, name: name, description: description}),
    };

    return fetch(`${config.apiUrl}email-lists/${listId}`, requestOptions).
        then(helpService.handleResponse).
        then(emailList => {
            return emailList;
        });
}

function exportE(listId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${config.apiUrl}email-lists/${listId}/csv`, requestOptions).
        then(helpService.handleResponse).
        then(template => {
            return template;
        });
}

function importE(listId, name) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({name: name}),
    };

    return fetch(`${config.apiUrl}email-lists/${listId}`, requestOptions).
        then(helpService.handleResponse).
        then(template => {
            return template;
        });
}

function findById(array, value) {

    for (var i = 0; i < array.length; i++) {
        if (array[i].id === value) return i;
    }

    return -1;
}
