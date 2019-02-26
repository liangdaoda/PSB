import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex);

const state = {
  isShowFilterContent: false,
  condition: { // 筛选条件
    PageSize: 10, //分页行数
    PageIndex: 1, //分页索引
    InvoiceStatus: -1, //发票状态(-1 全部发票、 0-未报销、1-报销中、2-已报销、3-重复发票)
    DateMode: "全部", //筛选
    InvoiceTypeByCategory: "0", //根据费用类型，费用类型大类,-1查询未设置费用类型的发票
    InvoiceKind: "", //专用发票
    ComplianceType: 0, //报销合规( 0 全部 1 合规 2 不合规 )
    Keyword: "", //搜索关键字
    InvoiceProperty: 0, //发票属性（值范围：0-全部，1-单位发票，2-家庭发票；多个使用“,”分割，如：1,2）
    RecordDateMode: "全部", //添加时间
    StartDate: null, //开票日期  开始时间
    EndDate: null, //开票日期 结束时间
    StartRecordDate: null, //添加 开始时间
    EndRecordDate: null, //添加 结束时间
    SortMode: 0, //排序方式 0为逆序1为正序
    SortColumn: "InvoiceDate", //排序的列 默认为开票日期(InvoiceDate) 支持发票状态(Status)添加日期(RecordDate)价税合计(Amount)
    InvoiceSource: 0 //发票来源 7 邮箱发票
  },
  delCondition: { // 回收站的筛选条件
    PageSize: 10,
    PageIndex: 1,
    InvoiceStatus: -1,
    DateMode: "全部",
    InvoiceTypeByCategory: "0",
    InvoiceKind: "",
    ComplianceType: 0,
    Keyword: ""
  },
  selectInvs: [], // 已选择发票
  deleteInvs: [], // 回收站已选择发票
  MobilePhone: ""
}


export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
