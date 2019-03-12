import {store} from "../vuex";
import {router} from "../router";
import { userService } from '../services';

export const helpService = {
    handleResponse,
    handleResponseOpt,
    fetchWithRefresh,
    logout
};

function handleResponse(response) {
  return handleResponseOpt(response, true)
}

function handleResponseOpt(response, parseJSON) {
  return response.text().then(text => {
    const data = parseJSON ? (text && JSON.parse(text)) : text
    
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        //location.reload(true);
      }

      const error = (data && data.error) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
}

function fetchWithRefresh(url, requestOptions){
    const newDate = new Date();
    if(store.state.authentication.user && new Date(store.state.authentication.user.refresh_token_expired_at)>newDate && newDate > new Date(store.state.authentication.user.token_expired_at)) {
        return userService.refresh().then((user) => {
            store.commit('authentication/refreshSuccess', user);
        }).then(()=> {return fetch(url, requestOptions);});
    }
    return fetch(url, requestOptions);
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    router.push('/login');
}
