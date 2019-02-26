import Vue from 'vue'
import Router from 'vue-router'
import invoiceList from '../page/invoice/invoiceList'
import recycleList from '../page/invoice/recycleList'
import addInvoice from '../page/invoice/addInvoice'
const AuthFail = r => require.ensure([], () => (require('../page/openPlatform/authFail')), 'authfail')
const PersonalLogin = r => require.ensure([], () => r(require('../page/login/personalLogin')), 'personalLogin')
const PersonalRegister = r => require.ensure([], () => r(require('../page/login/personalRegister')), 'personalRegister')
const InvoiceDetail = r => require.ensure([], () => (require('../page/invoice/invoiceDetail')), 'invoiceDetail')
const Cookie = require("../tools/cookie")
import {
  PLATFORMINFO,
  AuthInfo
} from '../config/env'
import {
  setSessionStore,
  isOpenPlatform
} from '../config/util'

Vue.use(Router)

const router = new Router({
  routes: [{
      path: '*',
      name: '',
      component: invoiceList
    },
    {
      path: '/invoiceList',
      name: 'invoiceList',
      component: invoiceList
    },
    {
      path: '/recycle',
      name: 'recycleList',
      component: recycleList
    },
    {
      path: '/addInvoice',
      name: 'addInvoice',
      component: addInvoice
    },
    {
      path: '/editInvoice',
      name: 'editInvoice',
      component: addInvoice
    },
    {
      path: '/personalRegister',
      name: 'personalRegister',
      component: PersonalRegister
    },
    {
      path: '/personalLogin',
      name: 'personalLogin',
      component: PersonalLogin
    },
    {
      path: '/invoiceDetail',
      name: 'invoiceDetail',
      component: InvoiceDetail
    }
  ]
})

router.beforeEach(function (to, from, next) {
  // //记录开放平台信息
  if (to.query.platform) {
    if (/^\/authFail$/.test(to.path)) {
      next();
      return;
    }
    if (document.cookie.length > 0) {
      let cookieToken = Cookie.get('Token');
      localStorage.setItem("token", cookieToken);
      AuthInfo.Token = cookieToken;
    }
    setSessionStore(PLATFORMINFO, {
      isOpenPlatform: (to.query.platform && true) || false,
      targetUrl: to.hash && to.hash.match(/\?/g).length > 0 ? to.hash.split('?')[0].split('/')[1] : "",
      mobiPhone: to.query.mobiPhone,
      enterpriseId: to.query.enterpriseId,
      enterpriseUserId: to.query.enterpriseUserId,
      selectedCallbackUrl: to.query.selectedCallbackUrl,
      selectedInvoices: to.query.selectedInvoices,
      currentInvoiceId: to.query.currentInvoiceId,
      invoiceIds: to.query.invoiceIds
    })

    // 检测是否登录
    let authInfo = localStorage.getItem("token");
    if (!authInfo || authInfo.Token == '') {
      if (/^\/personalLogin$/.test(to.path) || /^\/personalRegister$/.test(to.path)) {
        next();
        return;
      } else {
        next({
          path: '/personalLogin'
        })
      }
    } else {
      next();
      return;
    }
  } else {
    next();
    return;
  }
})

export default router;
