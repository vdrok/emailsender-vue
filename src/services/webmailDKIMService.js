import config from 'config';
import { authHeader } from '../helpers/authHeader';
import { helpService } from "./helpService";

export default class WebmailDKIMService {
  constructor (itemName) {
    this.itemName = itemName
  }
  
  op (reqMethod, params, body) {
    const requestOptions = {
      method: reqMethod,
      headers: authHeader()
    }
  
    if (body)
      requestOptions.body = JSON.stringify(body)
  
    return fetch(`${config.apiUrl}${this.itemName}${params}`, requestOptions)
      .then(helpService.handleResponse)
  }
  
  enum (limit, offset) {
    return this.op('GET', `?limit=${limit}&offset=${offset}`, false)
  }
  
  create (webmail) {
    return this.op('POST', '', webmail)
  }
  
  delete (webmailID) {
    return this.op('DELETE', `/${webmailID}`, false)
  }
  
  update (webmailID, webmail) {
    return this.op('PATCH', `/${webmailID}`, webmail)
  }
}
