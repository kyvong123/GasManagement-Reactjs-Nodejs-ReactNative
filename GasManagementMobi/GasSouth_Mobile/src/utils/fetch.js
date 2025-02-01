import instance from 'axios'
// export const API = 'http://27.74.251.0:5000'
// const TOKEN =  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWFmODQ2ZmVlZmMyMDBhMjI2NmY5YzMiLCJwYXNzd29yZCI6IiQyYSQxMCRUT0tmaHN1b1dtOE1ydFplWmhHY1RlaDJVSjlMcFJsOXFhMXA3NWNHSWhhQ2tERjgvbVI1SyIsImlhdCI6MTU0NjkxNTU3NX0.0-8N1hKJigVG3kO65IVmMdKVe-mRUf7wnf0Foy2BXD0'
export const API = 'http://118.70.180.24:5000'
const TOKEN =  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWFmODQ2ZmVlZmMyMDBhMjI2NmY5YzMiLCJwYXNzd29yZCI6IiQyYSQxMCRzV0o4ZXFKWWVPVmxJb2d3d010dWkubTFTUWI2WUNNMDZDdnR2aS9WNEtvSWp1cHNkcW4zQyIsImlhdCI6MTU0NjM5OTg3MH0.yO6UzQRnYTEkz_6vCyncJpQWOqqHFMxBCAK96viYamw'

var axios = instance.create({
  baseURL: `${API}/`,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
})

const getHeaders = (token = null) => {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
  if (token) {
    headers.authorization = token
  }
  return headers
}

export function putFetch (url, data, props, token = null) {
  let attributes = Object.assign(
    {
      cache: true,
      headers: getHeaders(token)
    },
    props
  )
  return new Promise((resolve, reject) => {
    axios
      .put(url, data, attributes)
      .then(res => {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject(Error('Error'))
        }
      })
      .catch(e => {
        reject(e)
      })
  })
}

export function postFetch (url, props, token = null) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, props, {
        cache: true,
        headers: getHeaders(token)
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(e => reject(e))
  })
}

export function postFetchRegister (url, props, header = {}) {
  const headers = Object.assign(getHeaders(), header)
  return new Promise((resolve, reject) => {
    axios
      .post(url, props, {
        cache: true,
        headers,
        validateStatus: status => {
          return status < 500;
        }
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(e => reject(e))
  })
}

async function postData(url = ``, data = {}, token = null) {
  return
    fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(res => {
      return res.json()
    });
}

export function getFetch (url, props, token = null) {
  const attributes = Object.assign(
    {
      headers: getHeaders(token)
    },
    props
  )
  return new Promise((resolve, reject) => {
    axios
      .get(url, attributes)
      .then(res => {
        resolve(res.data)
      })
      .catch(e => reject(e))
  })
}

export const deleteFetch = (url, props, token = null) => {
  const attributes = Object.assign(
    {
      headers: getHeaders(token)
    },
    props
  )
  return new Promise((resolve, reject) => {
    axios
      .delete(url, attributes)
      .then(res => {
        resolve(res.data)
      })
      .catch(e => {
        reject(e)
      })
  })
}

export function uploadFile (url, file) {
  const data = {
    uri: file.uri,
    name: file.fileName,
    type: file.mime
  }

  if (!data.name && file.path) {
    data.name = file.path.replace(/^.*[\\\/]/, "")
  }

  let params = new FormData()
  params.append("file", data)
  return new Promise((resolve, reject) => {
    instance
      .create({
        timeout: 30000
      })
      .post(url, params)
      .then(result => {
        if (result && result.data) {
          resolve(result.data)
        } else {
          reject(Error("Upload fail"))
        }
      })
      .catch(err => reject(err))
  })
}

export function uploadFileCrop (url, file) {
  const data = {
    uri: file.path,
    name: file.fileName,
    type: file.mime
  }

  if (!data.name && file.path) {
    data.name = file.path.replace(/^.*[\\\/]/, "")
  }
  
  let params = new FormData()
  params.append("file", data)
  return new Promise((resolve, reject) => {
    instance
      .create({
        timeout: 30000
      })
      .post(url, params)
      .then(result => {
        if (result && result.data) {
          resolve(result.data)
        } else {
          reject(Error("Upload fail"))
        }
      })
      .catch(err => reject(err))
  })
}