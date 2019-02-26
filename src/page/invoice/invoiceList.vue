<template>
  <div class="invoice-list" v-loading="uploadLoading">
    <div class="content">
      <div class="right">
        <div class="filter">
          <a href="javascript:;" @click="isShowFilterContent = !isShowFilterContent">筛选
            <i :class="{'el-icon-caret-bottom': !isShowFilterContent, 'el-icon-caret-top': isShowFilterContent}"></i>
          </a>
          <div class="search">
            <input type="text" placeholder="请输入费用类型/发票代码/发票号码/商家搜索" v-model="condition.Keyword">
            <i></i>
          </div>
        </div>
        <filter-content :condition="condition" @changeCondition="changeCondition" :show="isShowFilterContent"></filter-content>
        <div class="list">
          <div :class="{FolderType: condition.InvoiceSource === 7}">
            <a href="javascript:;" @mouseenter="showAddType = true" @mouseleave="showAddType = false">
              添加
              <i class="el-icon-caret-bottom"></i>
              <div v-show="showAddType">
                <a href="javascript:;">
                  上传图片
                  <input type="file" ref="uploadImg" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" @change="uploadImg($event,'img')">
                </a>
                <a href="javascript:;">
                  上传PDF
                  <input type="file" accept="application/pdf" @change="uploadImg($event,'pdf')">
                </a>
              </div>
            </a>
            <a href="javascript:;" class="edit" @click="toEdit()" :class="{canEdit: selectedItems.length==1 || deleteInvs.length==1}">编辑</a>
            <a href="javascript:;" class="re" v-if="!isPlatform">报销</a>
            <a href="javascript:;" class="comfirm" v-if="isPlatform">确定</a>
            <a href="javascript:;" class="del" :class="{active: selectedItems.length>0 || deleteInvs.length >0}" @click="centerDialogVisible = true">删除</a>
            <a href="javascript:;" @click="previewInvoicePrint" :class="{canEdit: selectedItems.length>0 || deleteInvs.length>0}" class="print">打印</a>
            <a href="javascript:;" @click="downloadInvoiceFile" :class="{canEdit: selectedItems.length>0 || deleteInvs.length>0}" class="download">下载</a>
          </div>
          <p class="selectNum">（已选择
            <span>{{deleteInvs.length}}</span>）</p>
          <list-table :condition="condition" :selectAble="selectAble" :type="type" :delete-invs="deleteInvs" :invoice-items="invoiceItems" v-loading="loading" @selectItems="selectItems"></list-table>
          <pagination :condition="condition" @changeCondition="changeCondition" :type="type" :count="count" @first="first" @pre="pre" @next="next" @last="last" @toPage="toPage"></pagination>
          <div class="empty" v-show="showEmpty">{{condition.InvoiceSource===7 ? emailTip : tips}}</div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="centerDialogVisible" width="30%" center class="delete">
      <p style="text-align: center">删除发票可在30天内从回收站恢复，您确认将发票移入回收站吗？</p>
      <span slot="footer" class="dialog-footer">
        <a href="javascript:;" @click="deleteInvoices">确 认</a>
        <a @click="centerDialogVisible = false" href="javascript:;">取 消</a>
      </span>
    </el-dialog>
    <drap-upload :uploadLoading="uploadLoading" @changeUploadLoading="changeUploadLoading"></drap-upload>
    <el-dialog title="打印单预览" :visible.sync="previewDialog" top="5vh">
      <p>纸质发票无需打印，已选择{{invPic.length}}张电子发票，合计<span>{{printMount}}</span>元</p>
      <iframe id="printIframe" :src="printUrl" frameborder="0" width="550px" height="700px"></iframe>
      <div class="bottom">
        <a href="javascript:;" @click="gotoPrint">打印</a>
        <a href="javascript:;" @click="previewDialog = false">取消</a>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import listTable from "./invoiceTable";
import pagination from "./pagination";
import drapUpload from "./dragUpload";
import http from "../..//services/httpAxios.js";
import apiSetting from "../../services/apiSetting.js";
import filterContent from "./filter-content";
import uploadFile from "../../services/uploadFile.js";
import store from "../../store/store.js";
import { AuthInfo, ApiPath } from "../../config/env";
import { isOpenPlatform, getPlatformInfo } from "../../config/util";
export default {
  name: "invoice-list",
  components: {
    listTable,
    pagination,
    filterContent,
    drapUpload
  },
  data() {
    return {
      type: "invoiceList",
      invoiceItems: [],
      count: 1,
      recycle: false,
      loading: true,
      uploadLoading: false,
      isShowFilterContent: false,
      centerDialogVisible: false,
      selectedItems: [],
      deleteInvs: [],
      showAddType: false,
      selectAble: true,
      showEmpty: false,
      condition: {
        PageSize: 10,
        PageIndex: 1,
        InvoiceStatus: -1,
        InvoiceSource: 0,
        DateMode: "全部",
        InvoiceTypeByCategory: "0",
        ComplianceType: 0,
        Keyword: "",
        InvoiceProperty: 0,
        RecordDateMode: "全部",
        StartDate: "null",
        EndDate: "null",
        StartRecordDate: "null",
        EndRecordDate: "null"
      },
      isPlatform: false, //是否开放平台
      tips: "暂无发票，拖拽图片或PDF上传发票",
      previewDialog: false,
      printUrl: "",
      invPic: [],
      printMount: 0
    };
  },
  created() {
    this.isPlatform = isOpenPlatform();
    // 还原状态
    this.condition = this.$store.state.condition;
    if (this.$store.state.selectInvs) {
      this.deleteInvs = this.$store.state.selectInvs;
    }
    this.isShowFilterContent = this.$store.state.isShowFilterContent;
    // 获取发票列表
    this.getInvoices();
    // 获取费用类型
    // let invoiceTypes = JSON.parse(localStorage.getItem("invoiceTypes"));
    let invoiceTypes;
    if (!invoiceTypes) {
      http(apiSetting.GetChargeTypes, {}).then(
        res => {
          if (res.data.ResCode === 1000) {
            localStorage.setItem("invoiceTypes", JSON.stringify(res.data.Data));
            this.invoiceTypes = res.data.Data;
          } else {
            this.$message.error(res.data.Msg);
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  },
  computed: {
    selectInvId: function() {
      let DelIds = [];
      for (let i = 0; i < this.deleteInvs.length; i++) {
        DelIds.push(this.deleteInvs[i].Id);
      }
      return DelIds;
    },
    author() {
      return this.$store.state.author;
    },
    emailTip() {
      return (
        "您使用发票邮箱：" +
        this.$store.state.MobilePhone +
        "@mypsb.cn接收的电子发票，会自动进入该页面"
      );
    }
  },
  watch: {
    condition: {
      handler(newValue, oldValue) {
        this.getInvoices();
        this.$store.commit("updateCondition", this.condition);
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
        this.$store.commit("updateSelectInvs", this.deleteInvs);
      },
      deep: true
    },
    isShowFilterContent: function(val) {
      this.$store.commit("updateFilterShow", this.isShowFilterContent);
    }
  },
  methods: {
    getInvoices() {
      if (this.condition.StartDate === null) {
        this.condition.StartDate = null;
      }
      if (this.condition.EndDate === null) {
        this.condition.EndDate = null;
      }
      if (this.condition.StartRecordDate === null) {
        this.condition.StartRecordDate = null;
      }
      if (this.condition.EndRecordDate === null) {
        this.condition.EndRecordDate = null;
      }
      this.loading = true;
      http(apiSetting.getInvoices, this.condition).then(
        res => {
          this.loading = false;
          if (res.data.ResCode === 1000) {
            this.invoiceItems = res.data.Data.DataList;
            this.count = res.data.Data.TotalRecord;
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
    hideFilterContent(val) {
      this.isShowFilterContent = false;
    },
    // 改变筛选条件
    changeCondition(condition) {
      this.condition = condition;
      console.log(this.condition.InvoiceProperty);
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
    // 确认删除发票
    deleteInvoices() {
      this.loading = true;
      this.centerDialogVisible = false;
      let postData = {
        DeleteType: 0,
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
    // 上传
    uploadImg(e, type) {
      this.uploadLoading = true;
      let formData = new FormData();
      formData.append("WithoutUser", "true");
      formData.append("File", e.target.files[0]);
      if (type === "pdf") {
        if (e.target.files[0].size > 2 * 1024 * 1024) {
          this.$message.error("请上传小于2M的PDF文件");
          this.uploadLoading = false;
          return false;
        }
      } else {
        if (e.target.files[0].size > 10 * 1024 * 1024) {
          this.$message.error("请上传小于10M的图片文件");
          this.uploadLoading = false;
          return false;
        }
      }
      uploadFile(formData, type).then(res => {
        this.uploadLoading = false;
        if (res.data.ResCode === 1000) {
          this.$router.push({
            name: "addInvoice",
            params: { invoiceItem: res.data.Data, source: "add" }
          });
        } else {
          this.$message.error(res.data.Msg);
        }
      });
    },
    //创建报销发票的资源ID
    createInvoiceResourceId(ids) {
      return http(apiSetting.createInvoiceResourceId, {
        InvoiceIds: ids,
        InvoiceResourceType: 1
      }).then(
        res => {
          if (res.ResCode == 1000) {
            return res.ResourceId;
          } else {
            this.OPERATOR_MESSAGE_MANAGER(`${res.Msg}`);
          }
        },
        err => {
          this.OPERATOR_MESSAGE_MANAGER(`创建发票资源ID失败`);
        }
      );
    },
    reimburseInvoices() {
      // let platformInfo = getPlatformInfo();
      // if (platformInfo && platformInfo.selectedCallbackUrl) {
      //   let reimburseIds = _.map(this.$store.state.selectInvs, "Id");
      //   createInvoiceResourceId(reimburseIds).then(res => {
      //     if (/\?/g.test(platformInfo.selectedCallbackUrl)) {
      //       window.location.href = `${
      //         platformInfo.selectedCallbackUrl
      //       }&invoiceResourceId=${res}`;
      //     } else {
      //       window.location.href = `${
      //         platformInfo.selectedCallbackUrl
      //       }?invoiceResourceId=${res}`;
      //     }
      //   });
      // }
    },
    toEdit() {
      if (this.type === "invoiceList") {
        this.$router.push({
          name: "editInvoice",
          params: { invoiceItem: this.deleteInvs[0], source: "edit" }
        });
      }
    },
    // 拖拽上传的loading
    changeUploadLoading(state) {
      this.uploadLoading = state;
    },
    // 预览打印单
    previewInvoicePrint() {
      let Ids = [];
      this.invPic = [];
      this.printMount = 0;
      _.forEach(this.deleteInvs, value => {
        if (value.InvoiceSource !== 3) {
          Ids.push(value.Id);
          this.invPic.push({ pic: value.Picture });
          this.printMount = this.accAdd(this.printMount, Number(value.FAmount));
        }
      });
      this.loading = true;
      http(apiSetting.previewInvoicePrint, {
        invoiceIds: Ids,
        HidePrintDiv: true
      }).then(
        res => {
          this.loading = false;
          if (res.data.ResCode === 1000) {
            this.printUrl = res.data.FileUrl;
          } else {
            this.$message.error(res.data.Msg);
          }
        },
        error => {
          console.log(error);
        }
      );
      if (Ids.length > 0) {
        this.previewDialog = true;
      } else {
        this.$message.error("请选择电子发票");
      }
    },
    accAdd(arg1, arg2) {
      var r1, r2, m, n;
      try {
        r1 = arg1.toString().split(".")[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.toString().split(".")[1].length;
      } catch (e) {
        r2 = 0;
      }
      m = Math.pow(10, Math.max(r1, r2));
      n = r1 >= r2 ? r1 : r2;
      return ((arg1 * m + arg2 * m) / m).toFixed(n);
    },
    // 下载
    downloadInvoiceFile() {
      let Ids = [];
      _.forEach(this.deleteInvs, value => {
        Ids.push(value.Id);
      });
      let url = ApiPath + "/Invoice/DownloadInvoiceFile" + "?invoiceIds=" + Ids;
      window.open(url);
    },
    // 打印
    gotoPrint() {
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        window.frames["printIframe"].focus();
        window.frames["printIframe"].print();
      } else {
        document.getElementById("printIframe").contentWindow.print();
      }
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
    overflow: auto;
    min-width: 1000px;
    .right {
      flex: auto;
      overflow: auto;
      position: relative;
      .filter {
        overflow: hidden;
        height: 56px;
        line-height: 56px;
        background-color: #fff;
        border-bottom: 1px solid #e5e5e5;
        position: relative;
        a {
          width: 52px;
          height: 30px;
          border: 1px solid @theme;
          display: inline-block;
          text-align: center;
          line-height: 30px;
          color: @theme;
          margin-left: 24px;
          padding-left: 20px;
          background: url("@{imgUrl}/list/btn_screen_normal.png") 8px center
            no-repeat;
          &:hover {
            border-color: #2b75de;
          }
        }
        > .active {
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
          }
        }
      }
      .list {
        min-height: 500px;
        // height: 86vh;
        overflow: hidden;
        width: 99%;
        position: relative;
        > div {
          margin: 16px 0px 2px 24px;
          position: relative;
          > a {
            display: inline-block;
            width: 62px;
            height: 24px;
            text-align: center;
            line-height: 24px;
            border-radius: 2px;
            margin-right: 12px;
            &:first-child {
              background-color: @theme;
              color: #fff;
              border: 1px solid @theme;
              > div {
                position: absolute;
                width: 62px;
                z-index: 5;
                top: 25px;
                left: 0;
                cursor: pointer;
                > a {
                  position: relative;
                  display: inline-block;
                  height: 24px;
                  width: 100%;
                  color: @theme;
                  background-color: #fff;
                  border: 1px solid @theme;
                  line-height: 24px;
                  text-align: center;
                  &:first-child + a {
                    top: -2px;
                  }
                  &:hover {
                    background: #eff6ff;
                  }
                  > input {
                    cursor: pointer;
                    font-size: 0;
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    opacity: 0;
                    top: 0;
                    left: 0;
                  }
                }
              }
            }
            &.edit,
            &.re,
            &.del,
            &.print,
            &.download {
              background-color: #fff;
              color: #999;
              border: 1px solid #dcdcdc;
              pointer-events: none;
              &.canEdit {
                background-color: @theme;
                border: 1px solid @theme;
                color: #fff;
                pointer-events: auto;
              }
            }
            &:first-child + a + a + .active {
              background-color: #fd3b3b;
              border: 1px solid #fd3b3b;
              color: #fff;
              pointer-events: auto;
            }
          }
        }
        .FolderType {
          visibility: hidden;
        }
        > .selectNum {
          position: absolute;
          color: #999;
          top: 76px;
          left: 130px;
          z-index: 2;
          pointer-events: none;
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
  // 删除确认弹框
  .delete {
    background-color: rgba(0, 0, 0, 0.1);
    > .el-dialog {
      width: 304px !important;
      height: 140px;
      border-radius: 6px;
      box-shadow: none;
      margin-top: 32vh !important;
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
  .el-dialog {
    border-radius: 6px;
    width: 600px;
    .el-dialog__header {
      background-color: #3e8be8;
      border-radius: 6px 6px 0px 0px;
      padding: 8px 20px 8px;
      .el-dialog__title {
        color: #fff;
        font-size: 13px;
      }
      .el-dialog__headerbtn {
        top: 10px;
        right: 18px;
        .el-dialog__close {
          color: #fff;
        }
      }
    }
    .el-dialog__body {
      text-align: center;
      padding: 0;
      p {
        margin-top: 23px;
        color: #333;
        font-size: 12px;
        line-height: 12px;
        span {
          color: #3e8be8;
        }
      }
      .pic {
        max-height: 700px;
        overflow: auto;
        margin-top: 16px;
        img {
          width: 512px;
          height: 336px;
          margin-top: 24px;
          border: 1px solid #e5e5e5;
          &:first-child {
            margin-top: 0;
          }
        }
      }
      .bottom {
        border-top: 1px solid #eee;
        background: #f7faff;
        border-radius: 0 0 6px 6px;
        a {
          width: 78px;
          height: 30px;
          display: inline-block;
          text-align: center;
          line-height: 30px;
          border-radius: 4px;
          margin: 10px 0;
          &:first-child {
            background-color: #3b8bfd;
            color: #fff;
            border: 1px solid #3b8bfd;
            margin-right: 12px;
          }
          &:first-child + a {
            color: #999;
            border: 1px solid #ddd;
            background-color: #fff;
          }
        }
      }
    }
  }
}
</style>

