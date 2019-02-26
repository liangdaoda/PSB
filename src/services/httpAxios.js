import axios from 'axios'
import qs from 'qs'
import {
  ApiPath,
  AuthInfo
} from '../config/env'

axios.interceptors.request.use(config => {
  //显示loading
  return config
}, error => {
  return Promise.reject(error)
})


axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.resolve(error.response)
})

function errorState(response) {
  //请求失败回调
}

function successState(res) {
  // 请求成功回调
}
const httpServer = (opts, data) => {
  let Public = JSON.parse(JSON.stringify(AuthInfo));//公共参数
  let httpDefaultOpts = { //http默认配置
    method: opts.method,
    baseURL: ApiPath,
    url: opts.url,
    timeout: 10000,
    params: Object.assign(Public, data),
    // data: qs.stringify(Object.assign(Public, data)),
    data: Object.assign(Public, data),
    headers: opts.method == 'get' ? {
      'X-Requested-With': 'XMLHttpRequest',
      "Accept": "application/json",
      "Content-Type": "application/json"
    } : {
        'X-Requested-With': 'XMLHttpRequest',
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
  }

  if (opts.method == 'get') {
    delete httpDefaultOpts.data
  } else {
    delete httpDefaultOpts.params
  }
  let promise = new Promise(function (resolve, reject) {
    axios(httpDefaultOpts).then(
      (res) => {
        successState(res)
        resolve(res)
      }
    ).catch(
      (response) => {
        errorState(response)
        reject(response)
      }
    )
  })
  return promise
}

export default httpServer
