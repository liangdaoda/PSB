<template>
  <div class="invoice-detail">
    <div class="top">
      <span class="title">发票详情</span>
      <a href="javascript:;" @click="$router.push({name: 'invoiceList'});">关闭</a>
    </div>
    <div class="info">
      <div>
        <span>
          <span class="font-red">* </span>发票文件</span>
        <img class="picture" :src="invoiceItem.Picture">
      </div>
      <div>
        <span>
          <span class="font-red">* </span>价税合计</span>
        <span>{{invoiceItem.Amount}}</span>
      </div>
      <div>
        <span>费用类型</span>
        <span>{{invoiceItem.InvoiceTypeName}}</span>
      </div>
      <div class="kind">
        <span>
          <span class="font-red"></span>专用发票</span>
        <span>{{invoiceItem.InvoiceKind == '专用发票' ? 是 : 否}}</span>
      </div>
      <div>
        <span>
          <span class="font-red"></span>发票税额</span>
        <span>{{invoiceItem.TotalTaxPrice}}</span>
      </div>
      <div>
        <span>
          <span class="font-red">* </span>发票代码</span>
        <span>{{invoiceItem.InvoiceCode}}</span>
      </div>
      <div>
        <span>
          <span class="font-red">* </span>发票号码</span>
        <span>{{invoiceItem.InvoiceNumber}}</span>
      </div>
      <div>
        <span>
          <span class="font-red"></span>开票日期</span>
        <span>{{invoiceItem.InvoiceDate}}</span>
      </div>
      <div>
        <span>
          <span class="font-red"></span>发票数量</span>
        <span>{{invoiceItem.InvoiceCount}}</span>
      </div>
      <div class="property">
        <span>
          <span class="font-red"></span>发票属性</span>
        <span>{{invoiceItem.InvoiceProperty === 1 ? 单位发票 : 家庭发票}}</span>
      </div>
      <div>
        <span>
          <span class="font-red"></span>商家名称</span>
        <span>{{invoiceItem.InvoiceCompany}}</span>
      </div>
      <div class="clearfix"></div>
      <div>
        <span>
          <span class="font-red"></span>用途备注</span>
        <span>{{invoiceItem.InvoicePurpose}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { AuthInfo } from "../../config/env";
import http from "../..//services/httpAxios.js";
import apiSetting from "../../services/apiSetting.js";
import { getPlatformInfo } from "../../config/util";
export default {
  data() {
    return {
      invoiceItem: {
        InvoiceKind: "",
        IsSpecialInvoice: false
      }
    };
  },
  created() {
    this.getInvoiceDetail();
  },
  methods: {
    getInvoiceDetail() {
      let platformInfo = getPlatformInfo();
      let invoiceId = {
        Id: platformInfo.currentInvoiceId
      };
      http(apiSetting.GetInvoiceDetail, invoiceId).then(
        res => {
          if (res.data.ResCode === 1000) {
            this.invoiceItem = res.data.Data;
          } else {
            self.$message({
              showClose: true,
              message: "获取数据失败",
              type: "error"
            });
          }
        },
        error => {
          console.log("出错了");
        }
      );
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/common.less";
.invoice-detail {
  width: 100%;
  .top {
    height: 56px;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
    background-color: #fff;
    .title {
      margin: 24px 35px 0 24px;
      display: inline-block;
    }
    > a {
      width: 62px;
      height: 24px;
      display: inline-block;
      background-color: @theme;
      border: 1px solid @theme;
      line-height: 24px;
      text-align: center;
      border-radius: 2px;
      color: #fff;
      margin-right: 16px;
      &:nth-child(2) {
        background-color: #fff;
        color: #333;
        border: 1px solid #999;
        // pointer-events: none;
      }
      &:nth-child(3) {
        color: #333;
        border: 1px solid #999;
        background-color: #fff;
      }
    }
    > .active {
      background-color: @theme !important;
      border: 1px solid @theme !important;
      pointer-events: auto !important;
      color: #fff !important;
    }
  }
  .info {
    padding: 24px;
    width: 800px;
    .font-red {
      color: #ef1212;
    }
    > div {
      margin-right: 64px;
      position: relative;
      width: 290px;
      &:first-child {
        float: none;
      }
      &:last-child {
        float: none;
        display: flex;
        width: 100%;
      }
      > input {
        width: 206px;
        height: 30px;
        border: 1px solid #ddd;
        border-radius: 2px;
        text-indent: 1em;
        color: #333;
      }
      > .cursor {
        cursor: pointer;
      }
      > i {
        position: absolute;
        right: 15px;
        top: 11px;
        transition: 0.5s;
        cursor: pointer;
      }
      > .active {
        transform: rotate(-90deg);
      }
      > span {
        margin-right: 16px;
        display: inline-block;
        position: relative;
        padding-left: 12px;
        > span {
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      .invoiceTypes {
        position: absolute;
        right: -452px;
        top: -168px;
        width: 416px;
        padding: 14px 13px;
        border: 1px solid #ddd;
        max-height: 640px;
        overflow: auto;
        z-index: 4;
        > div {
          border-bottom: 1px solid #e5e5e5;
          margin-bottom: 12px;
          &:last-child {
            border-bottom: none;
          }
          > p {
            margin-bottom: 12px;
            color: #333;
          }
          > span {
            display: inline-block;
            margin-bottom: 13px;
            margin-right: 24px;
            color: #888;
            cursor: pointer;
            &:hover {
              color: #3b8bfd;
            }
          }
          > .active {
            color: @theme;
          }
        }
      }
    }
    > .kind {
      > div {
        display: inline-block;
        height: 32px;
        line-height: 32px;
        > a {
          padding-left: 30px;
          display: inline-block;
          width: 30px;
          height: 32px;
          background: url("@{imgUrl}/add/btn_select_normal.png") 8px center
            no-repeat;
        }
        > .active {
          background: url("@{imgUrl}/add/btn_select_down.png") 8px center
            no-repeat;
        }
        > .cannotClick {
          pointer-events: none;
        }
      }
    }
    > .property {
      > div {
        display: inline-block;
        height: 32px;
        line-height: 32px;
        > a {
          padding-left: 30px;
          display: inline-block;
          width: 60px;
          height: 32px;
          background: url("@{imgUrl}/add/btn_select_normal.png") 8px center
            no-repeat;
        }
        > .active {
          background: url("@{imgUrl}/add/btn_select_down.png") 8px center
            no-repeat;
          color: #333;
        }
        > .cannotClick {
          pointer-events: none;
        }
      }
    }
    > div {
      display: flex;
      margin-bottom: 24px;
      float: left;
      > .picture {
        border: 1px solid #ddd;
        border-radius: 2px;
        max-width: 180px;
        max-height: 120px;
        min-width: 180px;
        min-height: 120px;
        width: auto;
        height: auto;
        cursor: pointer;
      }
      > span {
        margin-top: 10px;
        margin-right: 16px;
        display: inline-block;
        position: relative;
        padding-left: 12px;
        > span {
          position: absolute;
          left: 0;
          top: 0;
        }
      }
      > textarea {
        width: 542px;
        height: 80px;
        padding: 7px 9px;
        border: 1px solid #ddd;
        border-radius: 2px;
        resize: none;
        color: #333;
        font-family: "Microsoft YaHei";
        font-size: 12px;
      }
    }
  }
  .clearfix {
    margin: 0 !important;
    clear: both;
    height: 0;
    overflow: hidden;
  }
}
</style>
<style lang="less">
// 日期样式
.add-invoice {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 208px;
    height: 32px;
  }
  .el-input__inner {
    font-size: 12px;
    height: 32px;
    border-radius: 2px;
    border: 1px solid #ddd;
    color: #333;
  }
  .el-input__icon {
    line-height: 32px;
  }
}
</style>

