<template>
  <transition name="el-fade-in-linear">
    <div class="filter-content" @click="hideFilterContent" :style="{'height': contentHeight}">
      <div @click="preventHide">
        <p>
          <span>开票日期：</span>
          <a href="javascript:;" @click="changeCondition(item, DateMode,'DateMode')" v-for="item in DateMode" :class="{active: item.show}" :key="item.name">{{item.name}}</a>
          <el-date-picker
            value-format = "yyyy-MM-dd"
            :picker-options="StartDateOptions"
            v-model="StartDate"
            type="date"
            @change="clearActive"
            placeholder="请选择开始日期">
          </el-date-picker>
          <span style="padding: 4px 6px">-</span>
          <el-date-picker
            value-format = "yyyy-MM-dd"
            :picker-options="EndDateOptions"
            v-model="EndDate"
            type="date"
            @change="clearActive"
            placeholder="请选择结束日期">
          </el-date-picker>
        </p>
        <p>
          <span>添加日期：</span>
          <a href="javascript:;" @click="changeCondition(item, RecordDateMode,'RecordDateMode')" v-for="item in RecordDateMode" :class="{active: item.show}" :key="item.name">{{item.name}}</a>
          <el-date-picker
            value-format = "yyyy-MM-dd"
            :picker-options="StartRecordDateOptions"
            v-model="StartRecordDate"
            type="date"
            @change="clearActive('record')"
            placeholder="请选择开始日期">
          </el-date-picker>
          <span style="padding: 4px 6px">-</span>
          <el-date-picker
            value-format = "yyyy-MM-dd"
            :picker-options="EndRecordDateOptions"
            v-model="EndRecordDate"
            type="date"
            @change="clearActive('record')"
            placeholder="请选择结束日期">
          </el-date-picker>
        </p>
        <p>
          <span style="line-height: 26px">费用类型：</span>
          <label>
            <a href="javascript:;" @click="changeCondition(item, InvoiceTypeByCategory,'InvoiceTypeByCategory')" v-for="item in InvoiceTypeByCategory" :class="{active: item.show}" :key="item.Id">{{item.name}}</a>
          </label>
        </p>
        <p>
          <span>发票状态：</span>
          <a href="javascript:;" @click="changeCondition(item, InvoiceStatus,'InvoiceStatus')" v-for="item in InvoiceStatus" :class="{active: item.show}" :key="item.name">{{item.name}}</a>
        </p>
        <p>
          <span>报销合规：</span>
          <a href="javascript:;" @click="changeCondition(item, ComplianceType,'ComplianceType')" v-for="item in ComplianceType" :class="{active: item.show}" :key="item.name">{{item.name}}</a>
        </p>
        <!-- <p>
          <span>发票属性：</span>
          <a href="javascript:;" @click="changeCondition(item, InvoiceProperty,'InvoiceProperty')" v-for="item in InvoiceProperty" :class="{active: item.show}" :key="item.name">{{item.name}}</a>
        </p> -->
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "filter-content",
  data() {
    return {
      InvoiceTypeByCategory: [],
      contentHeight: 0,
      InvoiceStatus: [
        { name: "不限", value: -1, show: true },
        { name: "未报销", value: 0, show: false },
        { name: "报销中", value: 1, show: false },
        { name: "已报销", value: 2, show: false },
        { name: "重复发票", value: 3, show: false }
      ],
      DateMode: [
        { name: "不限", value: "全部", show: true },
        { name: "本周", value: "本周", show: false },
        { name: "本月", value: "本月", show: false },
        { name: "上月", value: "上月", show: false },
        { name: "本季", value: "本季", show: false },
        { name: "上季", value: "上季", show: false },
        { name: "今年", value: "今年", show: false }
      ],
      RecordDateMode: [
        { name: "不限", value: "全部", show: true },
        { name: "本周", value: "本周", show: false },
        { name: "本月", value: "本月", show: false },
        { name: "上月", value: "上月", show: false },
        { name: "本季", value: "本季", show: false },
        { name: "上季", value: "上季", show: false },
        { name: "今年", value: "今年", show: false }
      ],
      ComplianceType: [
        { name: "不限", value: "0", show: true },
        { name: "是", value: "1", show: false },
        { name: "否", value: "2", show: false }
      ],
      InvoiceProperty: [
        { name: "不限", value: "0", show: true },
        { name: "单位发票", value: "1", show: false },
        { name: "家庭发票", value: "2", show: false }
      ],
      StartDate: "",
      EndDate: "",
      StartRecordDate: "",
      EndRecordDate: "",
      // 日期限制
      StartDateOptions: {
        disabledDate: time => {
          return (
            time.getTime() > Date.now() ||
            time.getTime() > new Date(this.EndDate).getTime()
          );
        }
      },
      EndDateOptions: {
        disabledDate: time => {
          return (
            time.getTime() > Date.now() ||
            time.getTime() < new Date(this.StartDate).getTime() - 86400000
          );
        }
      },
      StartRecordDateOptions: {
        disabledDate: time => {
          return (
            time.getTime() > Date.now() ||
            time.getTime() > new Date(this.EndRecordDate).getTime()
          );
        }
      },
      EndRecordDateOptions: {
        disabledDate: time => {
          return (
            time.getTime() > Date.now() ||
            time.getTime() < new Date(this.StartRecordDate).getTime() - 86400000
          );
        }
      }
    };
  },
  props: ["isShowFilterContent", "condition", "show"],
  watch: {
    show: {
      handler(newValue, oldValue) {
        if (this.show) {
          this.contentHeight = "217px";
        } else {
          this.contentHeight = 0;
        }
      },
      deep: true
    }
  },
  created() {
    // 费用类型
    setTimeout(() => {
      let invoiceType = JSON.parse(localStorage.getItem("invoiceTypes"));
      this.InvoiceTypeByCategory.splice(0, 0, {
        name: "不限",
        show: true,
        value: ""
      });
      for (let i = 0; i < invoiceType.length; i++) {
        this.InvoiceTypeByCategory.push({
          name: invoiceType[i].Name,
          value: invoiceType[i].Key,
          show: false
        });
      }
      if (this.condition.InvoiceTypeByCategory != "0") {
        for (let i = 0; i < this.InvoiceTypeByCategory.length; i++) {
          this.InvoiceTypeByCategory[i].show = false;
          if (
            this.InvoiceTypeByCategory[i].value ===
            this.condition.InvoiceTypeByCategory
          )
            this.InvoiceTypeByCategory[i].show = true;
        }
      }
    }, 500);
    // 筛选条件判断是否active
    if (this.condition.InvoiceStatus != -1) {
      for (let i = 0; i < this.InvoiceStatus.length; i++) {
        this.InvoiceStatus[i].show = false;
        if (this.InvoiceStatus[i].value === this.condition.InvoiceStatus) {
          this.InvoiceStatus[i].show = true;
        }
      }
    }
    if (this.condition.DateMode != "全部" && !this.condition.EndDate) {
      for (let i = 0; i < this.DateMode.length; i++) {
        this.DateMode[i].show = false;
        if (this.DateMode[i].value === this.condition.DateMode) {
          this.DateMode[i].show = true;
        }
      }
    }
    if (
      this.condition.RecordDateMode != "全部" &&
      !this.condition.EndRecordDate
    ) {
      for (let i = 0; i < this.RecordDateMode.length; i++) {
        this.RecordDateMode[i].show = false;
        if (this.RecordDateMode[i].value === this.condition.RecordDateMode) {
          this.RecordDateMode[i].show = true;
        }
      }
    }
    if (this.condition.ComplianceType != "0") {
      for (let i = 0; i < this.ComplianceType.length; i++) {
        this.ComplianceType[i].show = false;
        if (this.ComplianceType[i].value === this.condition.ComplianceType) {
          this.ComplianceType[i].show = true;
        }
      }
    }
    if (this.condition.InvoiceProperty != "0") {
      for (let i = 0; i < this.InvoiceProperty.length; i++) {
        this.InvoiceProperty[i].show = false;
        if (this.InvoiceProperty[i].value === this.condition.InvoiceProperty) {
          this.InvoiceProperty[i].show = true;
        }
      }
    }
    if (this.condition.StartDate && this.condition.EndDate) {
      for (let i = 0; i < this.DateMode.length; i++) {
        this.DateMode[i].show = false;
      }
      this.StartDate = this.condition.StartDate;
      this.EndDate = this.condition.EndDate;
    }
    if (this.condition.StartRecordDate && this.condition.EndRecordDate) {
      for (let i = 0; i < this.RecordDateMode.length; i++) {
        this.RecordDateMode[i].show = false;
      }
      this.StartRecordDate = this.condition.StartRecordDate;
      this.EndRecordDate = this.condition.EndRecordDate;
    }
    if (this.show) {
      this.contentHeight = "217px";
    }
  },
  methods: {
    hideFilterContent() {
      this.$emit("hideFilterContent");
    },
    preventHide(event) {
      event.cancelBubble = true;
    },
    // 改变筛选条件
    changeCondition(item, type, queryType) {
      for (let i = 0; i < type.length; i++) {
        type[i].show = false;
      }
      item.show = true;
      this.condition.PageIndex = 1;
      switch (queryType) {
        case "InvoiceStatus":
          this.condition.InvoiceStatus = item.value;
          break;
        case "DateMode":
          this.StartDate = "";
          this.EndDate = "";
          this.condition.StartDate = null;
          this.condition.EndDate = null;
          this.condition.DateMode = item.value;
          break;
        case "InvoiceTypeByCategory":
          this.condition.InvoiceTypeByCategory = item.value;
          break;
        case "RecordDateMode":
          this.StartRecordDate = "";
          this.EndRecordDate = "";
          this.condition.StartRecordDate = null;
          this.condition.EndRecordDate = null;
          this.condition.RecordDateMode = item.value;
          break;
        case "ComplianceType":
          this.condition.ComplianceType = item.value;
          break;
        case "InvoiceProperty":
          this.condition.InvoiceProperty = item.value;
          break;
        default:
          break;
      }
      this.$emit("changeCondition", this.condition);
      console.log(this.condition.StartDate);
      console.log(this.condition.EndDate);
    },
    // 选择日期
    clearActive(val) {
      if (val !== "record") {
        for (let i = 0; i < this.DateMode.length; i++) {
          this.DateMode[i].show = false;
        }
        if (this.StartDate && this.EndDate) {
          this.condition.StartDate = this.StartDate;
          this.condition.EndDate = this.EndDate;
        }
      } else {
        for (let i = 0; i < this.RecordDateMode.length; i++) {
          this.RecordDateMode[i].show = false;
        }
        if (this.StartRecordDate && this.EndRecordDate) {
          this.condition.StartRecordDate = this.StartRecordDate;
          this.condition.EndRecordDate = this.EndRecordDate;
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/common.less";
.filter-content {
  // position: absolute;
  // height: 100vh;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 3;
  width: 100%;
  transition: height 0.2s;
  > div {
    opacity: 1;
    background-color: #fff;
    z-index: 2;
    padding: 15px 12px 17px 37px;
    border-bottom: 1px solid #e5e5e5;
    > p {
      margin-bottom: 21px;
      word-wrap: break-word;
      display: flex;
      &:nth-child(2) {
        margin-bottom: 14px;
      }
      &:nth-child(3) {
        margin-bottom: 14px;
      }
      > span {
        color: #999;
        flex: none;
        padding: 4px 0px 4px 6px;
      }
      &:last-child {
        margin-bottom: 0;
      }
      > label {
        display: inline-block;
        line-height: 34px;
        > a {
          display: inline-block;
          line-height: 12px;
          &:first-child {
            margin-left: 4px;
          }
        }
      }
      > a {
        &:nth-child(2) {
          margin-left: 4px;
        }
      }
      a {
        margin-right: 12px;
        color: #444;
        border-radius: 4px;
        padding: 4px 6px 4px 6px;
        &:hover {
          color: @theme;
        }
      }
      .active {
        background-color: @theme;
        color: #fff;
        &:hover {
          color: #fff;
        }
      }
    }
  }
}
</style>
<style lang="less">
// 日期样式
.filter-content {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 102px !important;
    height: 20px !important;
    position: relative !important;
    top: -3px !important;
  }
  .el-input__inner {
    font-size: 12px !important;
    height: 26px !important;
    line-height: 26px;
    border-radius: 2px !important;
    border: 1px solid #ddd !important;
    color: #333 !important;
    padding: 0 8px 0 8px !important;
    text-align: center !important;
  }
  .el-input__icon {
    display: none !important;
  }
}
</style>
