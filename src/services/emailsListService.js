import config from 'config';
import { authHeader } from '../helpers/authHeader';
import {helpService} from "./helpService";

export const emailsListService = {
    createE,
    deleteE,
    getList,
    getById,
    updateE,
    exportE,
    importE,
    findById
};

function createE(name, description) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({list_name: name, description: description})
    };

    return fetch(`${config.apiUrl}email-lists`, requestOptions)
        .then(helpService.handleResponse)
        .then(emailList => {
            return emailList;
        });
}

function deleteE(listId) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}email-lists/${listId}`, requestOptions)
        .then(helpService.handleResponse)
        .then(emailList => {
            return emailList;
        });
}

function getList(limit, offset) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${config.apiUrl}email-lists?limit=${limit}&offset=${offset}`, requestOptions)
        .then(helpService.handleResponse)
        .then(emailLists => {
            return emailLists;
        });
}

function getById(listId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${config.apiUrl}email-lists/${listId}`, requestOptions)
        .then(helpService.handleResponse)
        .then(emailList => {
            return emailList;
        });
}

function updateE(listId, name, description) {
    const requestOptions = {
        method: 'PATCH',
        headers: authHeader(),
        body: JSON.stringify({id: listId, name: name, description:description})
    };

    return fetch(`${config.apiUrl}email-lists/${listId}`, requestOptions)
        .then(helpService.handleResponse)
        .then(emailList => {
            return emailList;
        });
}

function exportE(listId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}email-lists/${listId}/csv`, requestOptions)
        .then(helpService.handleResponse)
        .then(template => {
            return template;
        });
}

function importE(listId, name) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({name: name})
    };

    return fetch(`${config.apiUrl}email-lists/${listId}`, requestOptions)
        .then(helpService.handleResponse)
        .then(template => {
            return template;
        });
}

function findById(array, value) {

    for (var i = 0; i < array.length; i++) {
        if (array[i].id === value) return i;
    }

    return -1;
}
