import config from 'config';
import { authHeader } from '../helpers/authHeader';
import { helpService } from "./helpService";

export default class ListService {
  constructor(listPrefix, serverPrefix) {
    this.listPrefix = listPrefix 
    this.serverPrefix = serverPrefix 
  }

  listOp (reqMethod, params, body, parseReply = true) {
    const requestOptions = {
      method: reqMethod,
      headers: authHeader()
    }
  
    if (body)
      requestOptions.body = JSON.stringify(body)
  
    return fetch(`${config.apiUrl}${this.listPrefix}${params}`, requestOptions)
      .then(response => {
        return helpService.handleResponseOpt(response, parseReply)
      })
  }
  
  enumLists (limit, offset) {
    return this.listOp('GET', `?limit=${limit}&offset=${offset}`, false)
  }
  
  createList (list) {
    return this.listOp('POST', '', list)
  }
  
  deleteList (listId) {
    return this.listOp('DELETE', `/${listId}`, false)
  }
  
  updateList (listId, list) {
    return this.listOp('PATCH', `/${listId}`, list)
  }
  
  getListById (listId) {
    return this.listOp('GET', `/${listId}`, false)
  }
  
  importList (listId, listData) {
    let formData = new FormData()
    formData.append('file', listData, listData.name)

    // Content type will be set automatically to 'multipart/form-data' when formData assigned to body
    // This is why we are no using authHeader() which sets content type to 'applcation/json'
    const requestOptions = {
      method: 'POST',
      headers: authHeader(false),
      body: formData
    }    

    return fetch(`${config.apiUrl}${this.listPrefix}/${listId}/csv`, requestOptions)
      .then(response => {
        return helpService.handleResponseOpt(response, true)
      })
  }

  exportList (listId) {
                                              // do not parse reply as JSON
    return this.listOp('GET', `/${listId}/csv`, false, false)
  }
  
  enumItems (listId, offset = 0, limit = 9999, filter = '') {
    let filterParam = filter ? `&search=${filter}` : ''

    return this.listOp('GET', `/${listId}/${this.serverPrefix}?offset=${offset}&limit=${limit}${filterParam}`, false)
  }
  
  createItem (listId, server) {
    return this.listOp('POST', `/${listId}/${this.serverPrefix}`, server)
  }
  
  updateItem (listId, server) {
    return this.listOp('PATCH', `/${listId}/${this.serverPrefix}/${server.id}`, server)
  }
  
  deleteItem (listId, id) {
    return this.listOp('DELETE', `/${listId}/${this.serverPrefix}/${id}`, false)
  }

  checkBlackList (listId, id) {
    return this.listOp('GET', `/${listId}/${this.serverPrefix}/${id}/blacklist`, false)
  }
}
