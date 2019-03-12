import config from 'config';
import { authHeader } from '../helpers/authHeader';
import {helpService} from "./helpService";

export const emailsService = {
    createE,
    deleteE,
    getList,
    getById,
    updateE
};

function createE(listId, full_name, email) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({full_name: full_name, email: email})
    };

    return fetch(`${config.apiUrl}email-lists/${listId}/emails`, requestOptions)
        .then(helpService.handleResponse)
        .then(list => {
            return list;
        });
}

function deleteE(listId, emailId) {
    const requestOptions = {
        method: 'DEL',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}email-lists/${listId}/emails/${emailId}`, requestOptions)
        .then(helpService.handleResponse)
        .then(template => {
            return template;
        });
}

function getList(listId, limit, offset) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${config.apiUrl}email-lists/${listId}/emails?limit=${limit}&offset=${offset}`, requestOptions)
        .then(helpService.handleResponse)
        .then(emails => {
            return emails;
        });
}

function getById(listId, emailId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${config.apiUrl}email-lists/${listId}emails/${emailId}`, requestOptions)
        .then(helpService.handleResponse)
        .then(template => {
            return template;
        });
}

function updateE(listId, emailId, name) {
    const requestOptions = {
        method: 'PATCH',
        headers: authHeader(),
        body: JSON.stringify({name: name})
    };

    return fetch(`${config.apiUrl}email-lists/${listId}/emails/:emailId`, requestOptions)
        .then(helpService.handleResponse)
        .then(template => {
            return template;
        });
}
