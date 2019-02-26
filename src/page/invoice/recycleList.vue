<template>
  <div class="invoice-list">
    <div class="content">
      <div class="right">
        <div class="filter" v-show="!showEmpty || condition.Keyword">
          <div class="search">
            <input type="text" placeholder="请输入费用类型/发票代码/发票号码/商家搜索" v-model="condition.Keyword">
            <i></i>
          </div>
        </div>
        <div class="list">
          <div>
            <a href="javascript:;" v-show="!this.showEmpty" @click="restoreInvoices" :class="{active: selectedItems.length>0 || deleteInvs.length >0}">还原</a>
            <a href="javascript:;" v-show="!this.showEmpty" :class="{active: selectedItems.length>0 || deleteInvs.length >0}" @click="centerDialogVisible = true">删除</a>
            <a href="javascript:;" v-show="!this.showEmpty" @click="clearDialog = true">清空</a>
          </div>
          <p class="selectNum">（已选择
            <span>{{deleteInvs.length}}</span>）</p>
          <list-table v-show="!this.showEmpty" :condition="condition" :selectAble="selectAble" :delete-invs="deleteInvs" :invoice-items="invoiceItems" v-loading="loading" @selectItems="selectItems"></list-table>
          <pagination v-show="!this.showEmpty" :condition="condition" :type="type" :count="count" @first="first" @pre="pre" @next="next" @last="last" @toPage="toPage"></pagination>
          <div class="empty" v-show="invoiceItems.length === 0">暂无发票</div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="centerDialogVisible" width="30%" center class="delete">
      <p style="text-align: center">删除后发票将无法找回，</p>
      <p style="text-align: center">您确认要删除吗？</p>
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" @click="deleteInvoices">确 认</a>
        <a @click="centerDialogVisible = false" href="javascript:;">取 消</a>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="clearDialog" width="30%" center class="delete">
      <p style="text-align: center">清空后发票将无法找回，</p>
      <p style="text-align: center">您确认要清空吗？</p>
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" @click="clearInvoices">确 认</a>
        <a @click="clearDialog = false" href="javascript:;">取 消</a>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import bodyHeader from "../home/header";
import bodyNav from "../home/nav";
import listTable from "./invoiceTable";
import pagination from "./pagination";
import http from "../..//services/httpAxios.js";
import apiSetting from "../../services/apiSetting.js";
export default {
  name: "invoice-list",
  components: {
    listTable,
    pagination
  },
  data() {
    return {
      type: "recycleList",
      invoiceItems: [],
      count: 1,
      recycle: true,
      loading: true,
      centerDialogVisible: false,
      clearDialog: false,
      selectedItems: [],
      deleteInvs: [],
      selectAble: true,
      showEmpty: false,
      condition: {
        PageSize: 10,
        PageIndex: 1,
        InvoiceStatus: -1,
        DateMode: "",
        InvoiceTypeByCategory: "0",
        InvoiceKind: "",
        ComplianceType: 0,
        Keyword: ""
      }
    };
  },
  created() {
    this.condition = this.$store.state.delCondition;
    if (this.$store.state.deleteInvs) {
      this.deleteInvs = this.$store.state.deleteInvs;
    }
    this.getInvoices();
  },
  computed: {
    selectInvId: function() {
      let DelIds = [];
      for (let i = 0; i < this.deleteInvs.length; i++) {
        DelIds.push(this.deleteInvs[i].Id);
      }
      return DelIds;
    }
  },
  watch: {
    condition: {
      handler(newValue, oldValue) {
        this.getInvoices();
        this.$store.commit("updateDelCondition", this.condition);
      },
      deep: true
    },
    invoiceItems: {
      handler(newValue, oldValue) {
        if (this.invoiceItems.length != 0) {
          this.showEmpty = false;
        } else {
          this.showEmpty = true;
        }
      },
      deep: true
    },
    deleteInvs: {
      handler(newValue, oldValue) {
        this.$store.commit("updateDeleteInvs", this.deleteInvs);
      },
      deep: true
    }
  },
  methods: {
    getInvoices() {
      http(apiSetting.GetDeleteInvoices, this.condition).then(
        res => {
          if (res.data.ResCode === 1000) {
            this.invoiceItems = res.data.Data.DataList;
            this.count = res.data.Data.TotalRecord;
            this.loading = false;
          } else {
            this.$message.error(res.data.Msg);
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    first(data) {
      this.invoiceItems = data;
    },
    pre(data) {
      this.invoiceItems = data;
    },
    next(data) {
      this.invoiceItems = data;
    },
    last(data) {
      this.invoiceItems = data;
    },
    toPage(data) {
      this.invoiceItems = data;
    },
    // 去重
    selectItems(items) {
      this.deleteInvs = this.deleteInvs.concat(items);
      var hash = {};
      this.deleteInvs = this.deleteInvs.reduce(function(item, next) {
        hash[next.Id] ? "" : (hash[next.Id] = true && item.push(next));
        return item;
      }, []);
      if (this.deleteInvs.length > 999) {
        this.selectAble = false;
        this.$message.error("请不要选择超过999张发票");
      } else {
        this.selectAble = true;
      }
      // 去掉空数据
      for (let i = 0; i < this.deleteInvs.length; i++) {
        if (this.deleteInvs[i] === "") {
          this.deleteInvs.splice(i, 1);
        }
      }
    },
    // 还原发票
    restoreInvoices() {
      this.loading = true;
      let postData = {
        Ids: this.selectInvId
      };
      http(apiSetting.RestoreInvoices, postData).then(
        res => {
          this.loading = false;
          this.centerDialogVisible = false;
          if (res.data.ResCode === 1000) {
            this.$message({
              showClose: true,
              message: res.data.Msg,
              type: "success"
            });
            this.deleteInvs = [];
            this.getInvoices();
          } else {
            this.$message.error(res.data.Msg);
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    // 确认删除发票
    deleteInvoices() {
      this.loading = true;
      this.centerDialogVisible = false;
      let postData = {
        DeleteType: 1,
        Ids: this.selectInvId
      };
      http(apiSetting.DeleteInvoices, postData).then(
        res => {
          this.loading = false;
          this.centerDialogVisible = false;
          if (res.data.ResCode === 1000) {
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success"
            });
            this.deleteInvs = [];
            this.getInvoices();
          } else {
            this.$message.error(res.data.Msg);
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    // 清空回收站发票
    clearInvoices() {
      this.loading = true;
      this.clearDialog = false;
      let postData = {
        DeleteType: 1,
        IsClear: true,
        Ids: []
      };
      http(apiSetting.DeleteInvoices, postData).then(
        res => {
          this.loading = false;
          this.centerDialogVisible = false;
          if (res.data.ResCode === 1000) {
            this.$message({
              showClose: true,
              message: "清空成功",
              type: "success"
            });
            this.deleteInvs = [];
            this.getInvoices();
          } else {
            this.$message.error(res.data.Msg);
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/common.less";
.invoice-list {
  min-width: 1000px;
  height: 100vh;
  overflow: auto;
  flex: auto;
  .content {
    display: flex;
    background-color: #f2f2f2;
    width: 100%;
    height: 100%;
    overflow: hidden;
    min-width: 1000px;
    .right {
      flex: auto;
      overflow: hidden;
      .filter {
        overflow: hidden;
        height: 56px;
        line-height: 56px;
        background-color: #fff;
        border-top: 1px solid #e5e5e5;
        border-bottom: 1px solid #e5e5e5;
        position: relative;
        a {
          width: 45px;
          height: 34px;
          border: 1px solid @theme;
          display: inline-block;
          text-align: center;
          line-height: 36px;
          color: @theme;
          margin-left: 24px;
          padding-left: 23px;
          background: url("@{imgUrl}/list/btn_screen_normal.png") 12px center
            no-repeat;
        }
        .search {
          position: absolute;
          right: 24px;
          top: 10px;
          display: inline-block;
          width: 328px;
          height: 36px;
          line-height: 36px;
          border-radius: 2px;
          border: solid 1px #dddddd;
          input {
            width: 288px;
            height: 34px;
            text-indent: 1em;
          }
          i {
            position: absolute;
            right: 13px;
            top: 10px;
            display: inline-block;
            width: 18px;
            height: 18px;
            background: url("@{imgUrl}/list/ico_grabble.png") center center;
            cursor: pointer;
          }
        }
      }
      .list {
        min-height: 500px;
        height: 86vh;
        overflow: hidden;
        width: 99%;
        position: relative;
        > div {
          margin: 16px 0px 0px 24px;
          > a {
            display: inline-block;
            width: 62px;
            height: 24px;
            text-align: center;
            line-height: 24px;
            border-radius: 2px;
            margin-right: 16px;
            background-color: #fff;
            color: #999;
            border: 1px solid #dcdcdc;
            pointer-events: none;
            &:first-child + a + a {
              color: #fff;
              background-color: @theme;
              border: 1px solid @theme;
              pointer-events: auto;
            }
          }
          > .active {
            color: #fff;
            background-color: @theme;
            border: 1px solid @theme;
            pointer-events: auto;
          }
        }
        > .selectNum {
          position: absolute;
          color: #999;
          top: 76px;
          left: 130px;
          z-index: 2;
        }
        > .empty {
          margin-top: 50px;
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          background: url("@{imgUrl}/list/no.png") center center no-repeat;
          color: #484747;
          text-align: center;
          z-index: 2;
          background-color: #f2f2f2;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>
<style lang="less">
.invoice-list {
  .delete {
    > .el-dialog {
      width: 280px !important;
      height: 140px;
      .el-dialog__headerbtn {
        right: 7px;
        top: 6px;
      }
      .el-dialog__body {
        padding: 0 25px;
      }
      .el-dialog__footer {
        margin-top: 14px;
        > .dialog-footer {
          a {
            display: inline-block;
            width: 62px;
            height: 24px;
            border: 1px solid #999;
            color: #333;
            background-color: #fff;
            line-height: 24px;
            border-radius: 2px;
            &:first-child {
              background-color: #fd3b3b;
              border-color: #fd3b3b;
              color: #fff;
              margin-right: 12px;
            }
          }
        }
      }
    }
  }
}
</style>

