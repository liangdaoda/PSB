//阿里服务器
// 生产环境
let ApiPath = 'https://mypsb.cn/api'
let WebSitePath = 'https://mypsb.cn/api/web/site/officalsite'
// 测试环境
// let ApiPath = 'http://test.mypsb.cn/api'
// let WebSitePath = 'http://test.mypsb.cn/api/site/officalsite'
// 开发环境
// let ApiPath = 'http://dev.mypsb.cn/api'
// let WebSitePath = 'http://dev.mypsb.cn/api/site/officalsite'

//华为服务器
// let ApiPath = 'http://s2.psb.mobi/api' // 微信外网api接口地址  dev  test  pre
// let WebSitePath = 'http://s2.psb.mobi/api/web/site/officalsite'
// let JinCaiWebSitePath = 'http://psb.mobi/' //金财测试服务器地址
// 'http://10.0.0.77:8092' // 官网本地环境
// 'http://mypsb.cn/api/test/WebSite' // 官网测试环境
// 'http://mypsb.cn' // 官网正式环境
// 'http://psb.mobi/api/dev/WebSite' // 官网开发环境


// let ApiPath = 'http://mypsb.cn/api/test/jincai' // 微信外网api接口地址  dev  test  pre
// let WebSitePath = 'http://mypsb.cn/test/jincai'
// let JinCaiWebSitePath = 'http://psb.mobi/test/jincai' //金财测试服务器地址
let imgBaseUrl = 'static/images/' // 本地环境
let AuthInfo = { // 基本信息
  "DeviceId": "Netscape",
  "Platform": "Pc",
  "Token": "",
  "RefreshToken": "",
  "Latlng": "",
  "Companey": "",
  "ApiVersion": 2
}

/**
 * 开放平台信息
 */
const PLATFORMINFO = 'PLATFORMINFO'

export {
  ApiPath,
  AuthInfo,
  PLATFORMINFO,
  WebSitePath,
  imgBaseUrl,
  JinCaiWebSitePath
}
