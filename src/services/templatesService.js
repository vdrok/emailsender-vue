import config from 'config';
import { authHeader } from '../helpers/authHeader';
import {helpService} from "./helpService";

export const templatesService = {
    createT,
    deleteT,
    getList,
    getById,
    updateT
};

function createT(template_name, from_name, reply_email, body_text, body_html, from_email, subject) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({template_name: template_name, from_name: from_name.split(','), reply_email: reply_email, body_text: body_text, body_html: body_html, from_email: from_email, subject: subject.split(','), content_type:'text/html'})
    };

    return helpService.fetchWithRefresh(`${config.apiUrl}letter-templates`, requestOptions)
        .then(helpService.handleResponse)
        .then(template => {
            return template;
        });
}

function deleteT(templateId) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return helpService.fetchWithRefresh(`${config.apiUrl}letter-templates/${templateId}`, requestOptions)
        .then(helpService.handleResponse)
        .then(template => {
            return template;
        });
}

function getList(limit, offset) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return helpService.fetchWithRefresh(`${config.apiUrl}letter-templates?limit=${limit}&offset=${offset}`, requestOptions)
        .then(helpService.handleResponse)
        .then(templates => {
            return templates;
        });
}

function getById(template_id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return helpService.fetchWithRefresh(`${config.apiUrl}letter-templates/${template_id}`, requestOptions)
        .then(helpService.handleResponse)
        .then(template => {
            template.from_name = template.from_name.join(',');
            template.subject =template.subject.join(',');
            console.log(template);
            return template;
        });
}

function updateT(template_name, body_html, templateId) {
    const requestOptions = {
        method: 'PATCH',
        headers: authHeader(),
        body: JSON.stringify({template_name: template_name, body_html: body_html})
    };

    return helpService.fetchWithRefresh(`${config.apiUrl}letter-templates/${templateId}`, requestOptions)
        .then(helpService.handleResponse)
        .then(template => {
            return template;
        });
}
