import config from 'config';
import { authHeader } from '../helpers/authHeader';
import {store} from "../vuex";
import {helpService} from "./helpService";

export const userService = {
    login,
    register,
    getInformation,
    getById,
    getAll,
    refresh
};

function login(email, password, keepMeLoggedIn) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
    };

    return fetch(`${config.apiUrl}users/login`, requestOptions)
        .then(helpService.handleResponse)
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                if(keepMeLoggedIn) {
                    localStorage.setItem('user', JSON.stringify(user));
                }

            }

            return user;
        });
}

function register(email, username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, username: username, password: password })
    };

    return fetch(`${config.apiUrl}users`, requestOptions)
        .then(helpService.handleResponse)
        .then(user => {
            return user;
        });
}

function refresh() {
    const user = store.state.authentication.user;

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: user.refresh_token})
    };

    return fetch(`${config.apiUrl}tokens/refresh`, requestOptions)
        .then(handleLoginResponse)
        .then(user => {
            if (user.token) {
                localStorage.setItem('user', JSON.stringify(user));
            }
            return user;
        });
}

function getInformation() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return helpService.fetchWithRefresh(`${config.apiUrl}users/me`, requestOptions)
        .then(helpService.handleResponse)
        .then(user => {
            return user;
        });
}

function getById(userId){
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return helpService.fetchWithRefresh(`${config.apiUrl}users/${userId}`, requestOptions)
        .then(helpService.handleResponse)
        .then(user => {
            return user;
        });
}

function getAll(limit, offset){
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return helpService.fetchWithRefresh(`${config.apiUrl}users?limit=${limit}&offset=${offset}`, requestOptions)
        .then(helpService.handleResponse)
        .then(user => {
            return user;
        });
}

function handleLoginResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                helpService.logout();
                location.reload(true);
            }

            const error = (data && data.error) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}
