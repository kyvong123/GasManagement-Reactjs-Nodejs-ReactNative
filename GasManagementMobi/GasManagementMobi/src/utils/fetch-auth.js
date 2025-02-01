import * as FETCH from "./fetch"

import { getAuthToken, TOKEN } from "./auth-cache"

export const getFetch = (url, params, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    getAuthToken()
      .then(({token}) => {
        if (token) {
          FETCH.getFetch(url, params, token)
            .then(rs => resolve(rs))
            .catch(err => reject(err))
        } else {
          reject(Error("Error"))
        }
      })
      .catch(err => reject(err))
  })
}

export const postFetch = (url, params) => {
  return new Promise((resolve, reject) => {
    getAuthToken()
      .then(data =>
        FETCH.postFetch(url, params, { authorization: data.token })
          .then(rs => resolve(rs))
          .catch(err => reject(err))
      )
      .catch(err => reject(err))
  })
}

export const putFetch = (url, params) => {
  return new Promise((resolve, reject) => {
    getAuthToken()
      .then(data =>
        FETCH.putFetch(url, params, { authorization: data.token })
          .then(rs => resolve(rs))
          .catch(err => reject(err))
      )
      .catch(err => reject(err))
  })
}

export const deleteFetch = (url, params) => {
  return new Promise((resolve, reject) => {
    getAuthToken()
      .then(data =>
        FETCH.deleteFetch(url, params, { authorization: data.token })
          .then(rs => resolve(rs))
          .catch(err => reject(err))
      )
      .catch(err => reject(err))
  })
}
