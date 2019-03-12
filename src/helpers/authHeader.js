import { store } from '../vuex'

export function authHeader(setCT = true) {
  // return authorization header with jwt token
  const user = store.state.authentication.user;

  if (user && user.token) {
    let res = setCT ? { 'Content-Type': 'application/json' } : {}
    res.Authorization = 'Bearer ' + user.token
    return res
  } else {
    return { 'Content-Type': 'application/json' };
  }
}

