const serviceModule = {
  //获取发票列表
  getInvoices: {
    url: '/Invoice/GetInvoices',
    method: 'post'
  },
  // 获取token
  getToken: {
    url: '/Ticket/Login',
    method: 'post'
  },
  //获取回收站发票列表
  GetDeleteInvoices: {
    url: '/Invoice/GetDeleteInvoices',
    method: 'post'
  },
  //获取费用类型树形
  GetChargeTypes: {
    url: '/BasicData/GetChargeTypeTree',
    method: 'post'
  },
  // 删除发票
  DeleteInvoices: {
    url: '/Invoice/DeleteInvoices',
    method: 'post'
  },
  // 删除发票
  RestoreInvoices: {
    url: '/Invoice/RestoreInvoices',
    method: 'post'
  },
  // 保存发票
  UpdateInvoice: {
    url: '/Invoice/UpdateInvoice',
    method: 'post'
  },
  //获取用户信息
  GetMemberDetail: {
    url: '/Ticket/GetMemberDetail',
    method: 'post'
  },
  // 登录
  PersonalLogin: {
    url: '/Ticket/Login',
    method: 'post'
  },
  // 注册获取验证码
  GetSms: {
    url: '/Sms/SendSms',
    method: 'post'
  },
  // 账号注册
  AccountRegister: {
    url: '/Ticket/Register',
    method: 'post'
  },
  GetInvoiceDetail: {
    url: '/Invoice/GetInvoiceDetail',
    method: 'post'
  },
  //创建发票资源ID
  CreateResourceId: {
    url: '/Open/Invoice/CreateInvoiceResource',
    method: 'post'
  },
  //预览打印发票
  previewInvoicePrint: {
    url: '/Invoice/PreviewInvoicePrint',
    method: 'post'
  }
}
const apiSetting = { ...serviceModule
}

export default apiSetting
