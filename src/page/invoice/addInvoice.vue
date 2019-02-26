<template>
  <div class="add-invoice" v-loading="loading">
    <div class="top">
      <span class="title">{{pageName}}</span>
      <a href="javascript:;" @click="saveInvoice" :class="{'active': ifCanSave}">保存</a>
      <a href="javascript:;" @click="$router.push({name: 'invoiceList'});">关闭</a>
    </div>
    <div class="info">
      <div style="display: block">
        <span style="font-weight: 600">
          <span class="left-blue"></span>
          发票文件
        </span>
        <img class="picture" :src="invoiceItem.Picture" @click="picturePre">
      </div>
      <span>
        <span class="left-blue"></span>
        发票信息
      </span>
      <div>
        <span>
          <span class="font-red">* </span>价税合计</span>
        <input type="text" style="ime-mode: disabled;" v-model="invoiceItem.Amount" :readonly="!amountOrTaxCanEdit(invoiceItem)" @input="ChangeAmount" placeholder="请输入含税金额">
      </div>
      <!-- <div class="kind" v-show="invoiceItem.IsSpecialInvoice">
        <span>
          <span class="font-red"></span>专用发票</span>
        <div>
          <a href="javascript:;" @click="changeKind(true)" :class="{'active': invoiceItem.InvoiceKind == '专用发票' ? true : false, 'cannotClick': !codeNumberDateTypeCanEdit(invoiceItem) }">是</a>
          <a href="javascript:;" @click="changeKind(false)" :class="{'active': invoiceItem.InvoiceKind != '专用发票' ? true : false, 'cannotClick': !codeNumberDateTypeCanEdit(invoiceItem) }">否</a>
        </div>
      </div> -->
      <div v-show="invoiceItem.InvoiceKind === '专用发票' && invoiceItem.IsSpecialInvoice == true">
        <span>
          <span class="font-red"></span>发票税额</span>
        <input type="text" style="ime-mode: disabled;" v-model="invoiceItem.TotalTaxPrice" :readonly="!amountOrTaxCanEdit(invoiceItem)" @input="ChangeTaxPrice" placeholder="请输入发票税额">
      </div>
      <div>
        <span>
          <span class="font-red"></span>开票日期</span>
        <el-date-picker value-format="yyyy-MM-dd" :picker-options="pickerOptions" :readonly="!codeNumberDateTypeCanEdit(invoiceItem)" v-model="invoiceItem.InvoiceDate" type="date" placeholder="请选择日期"></el-date-picker>
      </div>
      <div>
        <span>发票代码</span>
        <input type="text" onkeyup="this.value=this.value.replace(/\D/g,'')" :readonly="!codeNumberDateTypeCanEdit(invoiceItem)" maxlength="12" v-model="invoiceItem.InvoiceCode" placeholder="请输入发票代码">
      </div>
      <div>
        <span>发票号码</span>
        <input type="text" onkeyup="this.value=this.value.replace(/\D/g,'')" :readonly="!codeNumberDateTypeCanEdit(invoiceItem)" maxlength="8" v-model="invoiceItem.InvoiceNumber" placeholder="请输入发票号码">
      </div>
      <div>
        <span>
          <span class="font-red"></span>发票数量</span>
        <input type="text" v-model="invoiceItem.InvoiceCount" @input="InvoiceCountInput" placeholder="请输入发票数量">
      </div>
      <div>
        <span>
          <span class="font-red"></span>商家名称</span>
        <input type="text" maxlength="30" v-model="invoiceItem.InvoiceCompany" :readonly="!codeNumberDateTypeCanEdit(invoiceItem)" placeholder="请输入商家名称">
      </div>
      <div class="clearfix"></div>
      <span>
        <span class="left-blue"></span>
        其他信息
      </span>
      <div class="property">
        <span>
          <span class="font-red"></span>发票属性</span>
        <div>
          <a href="javascript:;" @click="invoiceItem.InvoiceProperty = 1" :class="{'active': invoiceItem.InvoiceProperty === 1 ? true : false}">单位发票</a>
          <a href="javascript:;" @click="invoiceItem.InvoiceProperty = 2" :class="{'active': invoiceItem.InvoiceProperty === 2 ? true : false}">家庭发票</a>
        </div>
      </div>
      <div>
        <span>费用类型</span>
        <input type="text" class="cursor" @click="showInvTypes = !showInvTypes" v-model="invoiceItem.InvoiceTypeName" readonly>
        <i class="el-icon-arrow-down" :class="{'active': showInvTypes}" @click="showInvTypes = !showInvTypes"></i>
        <transition name="el-zoom-in-left">
          <div class="invoiceTypes" v-show="showInvTypes" ref="invoiceTypes" :style="{'top':typeTop}">
            <div v-for="item in invoiceTypes" :key="item.Id">
              <p>{{item.Name}}</p>
              <span v-for="items in item.Children" :key="items.Id" @click="selectType(items)" :class="{'active': items.isActive}">{{items.Name}}</span>
            </div>
          </div>
        </transition>
      </div>
      <div>
        <span>
          <span class="font-red"></span>用途备注</span>
        <textarea maxlength="50" v-model="invoiceItem.InvoicePurpose" placeholder="请输入发票用途"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import http from "../..//services/httpAxios.js";
import apiSetting from "../../services/apiSetting.js";
import store from "../../store/store.js";
export default {
  name: "add-invoice",
  data() {
    return {
      invoiceItem: {
        InvoiceKind: "",
        IsSpecialInvoice: false
      },
      source: "",
      pageName: "",
      invoiceTypes: {},
      showInvTypes: true,
      typeHeight: "",
      typeTop: "-2000px",
      typeIds: [1, 2, 4, 6],
      loading: false,
      pickerOptions: {
        //禁用选择今天之后的日期
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  computed: {
    ifCanSave: function() {
      if (this.invoiceItem.Amount > 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  created() {
    this.invoiceItem = this.$route.params.invoiceItem;
    this.source = this.$route.params.source;
    if (this.source === "add") {
      this.pageName = "添加发票";
      console.log(this.$store.state.condition);
      if (this.$store.state.condition.InvoiceProperty === 1) {
        //单位发票
        console.log("单位发票");
        this.invoiceItem.InvoiceProperty = 1;
      } else if (this.$store.state.condition.InvoiceProperty === 2) {
        // 家庭发票
        console.log("家庭发票");
        this.invoiceItem.InvoiceProperty = 2;
      }
      if (this.$store.state.condition.InvoiceSource === 7) {
        // 邮箱发票
        console.log("邮箱发票");
      }
    } else {
      this.pageName = "编辑发票";
    }
    if (this.invoiceItem) {
      if (this.invoiceItem.Amount === 0) {
        this.invoiceItem.Amount = "";
      }
      if (this.invoiceItem.TotalTaxPrice === 0 && this.source === "add") {
        this.invoiceItem.TotalTaxPrice = "";
      }
      if (this.invoiceItem.InvoiceCount === 0) {
        this.invoiceItem.InvoiceCount = "";
      }
      // 获取费用类型
      this.invoiceTypes = JSON.parse(localStorage.getItem("invoiceTypes"));
      if (!this.invoiceTypes) {
        http(apiSetting.GetChargeTypes, {}).then(
          res => {
            if (res.data.ResCode === 1000) {
              localStorage.setItem(
                "invoiceTypes",
                JSON.stringify(res.data.Data)
              );
              this.invoiceTypes = JSON.parse(
                localStorage.getItem("invoiceTypes")
              );
            } else {
              this.$message.error(res.data.Msg);
            }
          },
          error => {
            console.log(error);
          }
        );
      }
      // 检测费用类型是否显示专票开关
      let flag = false;
      let id = this.invoiceItem.InvoiceType;
      this.invoiceTypes.forEach(function(value) {
        value.Children.forEach(function(values) {
          if (id === values.Id && values.IsSpecialInvoice === true) {
            flag = true;
          }
        });
      });
      if (flag) {
        this.invoiceItem.IsSpecialInvoice = true;
      }
    } else {
      this.$router.push({ path: "/invoiceList" });
    }
  },
  mounted() {
    this.typeHeight = this.$refs.invoiceTypes.clientHeight;
    if (!this.typeHeight) {
      this.typeHeight = this.$refs.invoiceTypes.clientHeight;
    }
    this.typeTop = this.typeHeight / 2;
    if (this.typeTop > 168) {
      this.typeTop = 168;
    }
    this.typeTop = -this.typeTop + "px";
    this.showInvTypes = false;
  },
  methods: {
    // 发票文件点击
    picturePre() {
      window.open(this.invoiceItem.Picture);
    },
    // 点击费用类型
    selectType(type) {
      if (type.IsSpecialInvoice) {
        this.invoiceItem.IsSpecialInvoice = true;
        // 重新赋值invoicekind触发computed属性
        if (this.invoiceItem.InvoiceKind === "专用发票") {
          this.invoiceItem.InvoiceKind = "";
          this.invoiceItem.InvoiceKind = "专用发票";
        }
      } else {
        this.invoiceItem.IsSpecialInvoice = false;
      }
      console.log(this.invoiceItem.IsSpecialInvoice);
      // 遍历费用类型isActive
      this.invoiceTypes = this.invoiceTypes.map(function(value, key) {
        value.Children.map(function(values, keys) {
          values.isActive = false;
          return values;
        });
        return value;
      });
      type.isActive = true;
      this.showInvTypes = false;
      this.invoiceItem.InvoiceTypeName = type.Name;
      this.invoiceItem.InvoiceType = type.Key;
    },
    // 是否专票
    changeKind(boolean) {
      if (boolean) {
        this.invoiceItem.InvoiceKind = "专用发票";
      } else {
        this.invoiceItem.InvoiceKind = "非专用发票";
      }
    },
    saveInvoice() {
      // if (this.invoiceItem.InvoiceCategoryCode == 10) {
      //   this.$message.error("保存失败，电子发票请选择PDF文件上传");
      //   return;
      // }
      if (this.invoiceItem.Amount === 0) {
      }
      if (!this.invoiceItem.TotalTaxPrice) {
        this.invoiceItem.TotalTaxPrice = 0;
      }
      if (!this.invoiceItem.InvoiceCount) {
        this.invoiceItem.InvoiceCount = 1;
      }
      if (!this.invoiceItem.InvoiceType) {
        this.invoiceItem.InvoiceType = -1;
      }
      this.loading = true;
      http(apiSetting.UpdateInvoice, this.invoiceItem).then(
        res => {
          this.loading = false;
          if (res.data.ResCode === 1000) {
            this.$message.success("保存成功");
            setTimeout(() => {
              this.$router.push({ name: "invoiceList" });
            }, 500);
          } else {
            this.$message.error(res.data.Msg);
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    ChangeAmount(e) {
      let value = e.target.value;
      let i = value.length;
      while (i--) {
        if (!/^(([1-9][0-9]{0,7})|0)(\.([0-9]{1,2})?)?$/.test(value)) {
          value = value.substring(0, i);
          i = value.length;
        }
      }
      e.target.value = value;
      this.invoiceItem.Amount = value;
    },
    InvoiceCountInput(e) {
      let value = e.target.value;
      let i = value.length;
      while (i--) {
        if (!/^(([1-9][0-9]{0,1}))$/.test(value)) {
          value = value.substring(0, i);
          i = value.length;
        }
      }
      e.target.value = value;
      this.invoiceItem.InvoiceCount = value;
    },
    ChangeTaxPrice(e) {
      let value = e.target.value;
      let i = value.length;
      while (i--) {
        if (!/^(([1-9][0-9]{0,7})|0)(\.([0-9]{1,2})?)?$/.test(value)) {
          value = value.substring(0, i);
          i = value.length;
        }
      }
      e.target.value = value;
      this.invoiceItem.TotalTaxPrice = value;
    },
    amountOrTaxCanEdit(invoiceItem) {
      //价税合计 发票税额 是否可编辑判断
      // 真票  InvoiceValidate = 1
      // 电子发票 pdf导入 第三方应用 微信卡包  InvoiceSource = 1,2,4,6
      if (
        invoiceItem.InvoiceValidate === 1 ||
        _.includes(this.typeIds, invoiceItem.InvoiceSource)
      ) {
        return false;
      }
      return true;
    },
    codeNumberDateTypeCanEdit(invoiceItem) {
      // 发票代码 号码 日期 专票 商家
      // 扫码 电子发票 PDF 第三方应用 微信卡包 照片中的二维码（预留
      if (_.includes(this.typeIds, invoiceItem.InvoiceSource)) {
        return false;
      }
      return true;
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/common.less";
.add-invoice {
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
        color: #999;
        border: 1px solid #999;
        pointer-events: none;
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
      margin-right: 60px;
      position: relative;
      width: 290px;
      &:first-child {
        float: none;
        margin-bottom: 52px;
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
        display: block;
        position: relative;
        padding-left: 12px;
        > span {
          position: absolute;
          top: 0;
          left: 0;
        }
        > .left-blue {
          width: 4px;
          height: 14px;
          background-color: #38adff;
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
      display: inline-block;
      margin-bottom: 24px;
      > .picture {
        border: 1px solid #ddd;
        border-radius: 2px;
        max-width: 180px;
        max-height: 120px;
        min-width: 120px;
        min-height: 120px;
        width: auto;
        height: auto;
        cursor: pointer;
        display: block;
        margin-top: 25px;
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
        width: 541px;
        height: 80px;
        padding: 7px 9px;
        border: 1px solid #ddd;
        border-radius: 2px;
        margin-left: 4px;
        resize: none;
        color: #333;
        font-family: "Microsoft YaHei";
        font-size: 12px;
      }
    }
    > span {
      display: block;
      position: relative;
      padding-left: 10px;
      margin-bottom: 24px;
      font-weight: 600;
      margin-top: 28px;
      > .left-blue {
        width: 4px;
        height: 14px;
        background-color: #38adff;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
  .clearfix {
    margin: 0 !important;
    clear: both;
    height: 0;
    overflow: hidden;
    display: none !important;
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

