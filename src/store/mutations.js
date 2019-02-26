export default {
  // 更新筛选条件
  updateCondition(state, condition) {
    state.condition = condition;
  },
  // 更新回收站筛选条件
  updateDelCondition(state, condition) {
    state.delCondition = condition;
  },
  // 更新已选
  updateSelectInvs(state, selectInvs) {
    state.selectInvs = selectInvs;
  },
  // 更新回收站已选
  updateDeleteInvs(state, isShowFilterContent) {
    state.deleteInvs = deleteInvs;
  },
  // 更细筛选框显示
  updateFilterShow(state, updateFilterShow) {
    state.isShowFilterContent = updateFilterShow;
  },
  // 更新用户手机号码
  updateMobilePhone(state, MobilePhone) {
    state.MobilePhone = MobilePhone;
  }
}
