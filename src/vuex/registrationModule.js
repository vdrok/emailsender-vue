import { userService } from '../services';
import { router } from '../router';

const initialState = { status: {registered: false, inRegistration: false}, errorText: '' };

export const registration = {
    namespaced: true,
    state: initialState,
    actions: {
        register({ dispatch, commit }, { email, username, password }) {
            commit('registerRequest', { email });

            userService.register(email, username, password)
                .then(
                    () => {
                        commit('registrationSuccess');
                        router.push('/');
                    },
                    error => {
                        commit('registrationFailure', error);
                    }
                );
        },
    },
    mutations: {
        registerRequest(state) {
            state.status = { inRegistration: true};
            state.errorText = '';
        },
        registrationSuccess(state) {
            state.status = { registered: true};
            state.errorText = '';
        },
        registrationFailure(state, error) {
            state.status = {};
            state.errorText = error;
        },
    }
}
