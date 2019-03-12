import config from 'config';
import { authHeader } from '../helpers/authHeader';
import { helpService } from "./helpService";

export default class BlackListService {
  listOp (reqMethod, params, body) {
    let formData = new FormData()
    formData.append('ip', body)    

    const requestOptions = {
      method: reqMethod,
      headers: authHeader(false),
      body: formData
    }
   
    return fetch(`${config.apiUrl}blacklist/${params}`, requestOptions)
      .then(response => {
        return helpService.handleResponseOpt(response, true)
      })
  }
  
  check(ipaddr) {
    return this.listOp('POST', 'check', ipaddr)
  }

  multiCheck(ipaddr) {
    return this.listOp('POST', 'multicheck', ipaddr)
  }
}
