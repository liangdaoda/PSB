<template>
  <div class="pagination">
      <a href="javascript:;" @click="first"></a>
      <a href="javascript:;" @click="pre"></a>
      <input type="text" v-model="showPage" readonly>
      <a href="javascript:;" @click="next"></a>
      <a href="javascript:;" @click="last"></a>
      <p>跳转至第<input type="text" v-model="gotoPage">页</p>
      <a href="javascript:;" @click="toPage">确定</a>
  </div>
</template>

<script>
import http from "../..//services/httpAxios.js";
import apiSetting from "../../services/apiSetting.js";

export default {
  name: "pagination",
  data() {
    return {
      showPage: 0,
      maxPage: Math.ceil(this.count / 10),
      gotoPage: 1
    };
  },
  props: ["count", "type", "condition"],
  mounted() {
    this.showPage = this.condition.PageIndex + "/" + this.maxPage;
    if (this.type == "invoiceList") {
      this.getInvoicesType = apiSetting.getInvoices;
    } else if (this.type == "recycleList") {
      this.getInvoicesType = apiSetting.GetDeleteInvoices;
    }
  },
  watch: {
    count: function(val) {
      this.maxPage = Math.ceil(this.count / 10);
      if (this.condition.PageIndex > this.maxPage) {
        this.pre();
      }
      this.showPage = this.condition.PageIndex + "/" + this.maxPage;
    },
    condition: {
      handler(newValue, oldValue) {
        this.showPage = this.condition.PageIndex + "/" + this.maxPage;
      },
      deep: true
    }
  },
  methods: {
    first() {
      if (this.condition.PageIndex != 1) {
        this.condition.PageIndex = 1;
        http(this.getInvoicesType, this.condition).then(
          res => {
            if (res.data.ResCode === 1000) {
              this.$emit("first", res.data.Data.DataList);
              this.showPage = this.condition.PageIndex + "/" + this.maxPage;
            } else {
              this.$message.error(res.data.Msg);
            }
          },
          error => {
            console.log(error);
          }
        );
      }
      this.changeCondition();
    },
    pre() {
      if (this.condition.PageIndex != 1) {
        this.condition.PageIndex--;
        http(this.getInvoicesType, this.condition).then(
          res => {
            if (res.data.ResCode === 1000) {
              this.$emit("pre", res.data.Data.DataList);
              this.showPage = this.condition.PageIndex + "/" + this.maxPage;
            } else {
              this.$message.error(res.data.Msg);
            }
          },
          error => {
            console.log(error);
          }
        );
      }
      this.changeCondition();
    },
    next() {
      if (this.condition.PageIndex != this.maxPage) {
        this.condition.PageIndex++;
        http(this.getInvoicesType, this.condition).then(
          res => {
            if (res.data.ResCode === 1000) {
              this.$emit("next", res.data.Data.DataList);
              this.showPage = this.condition.PageIndex + "/" + this.maxPage;
            } else {
              this.$message.error(res.data.Msg);
            }
          },
          error => {
            console.log(error);
          }
        );
      }
      this.changeCondition();
    },
    last() {
      if (this.condition.PageIndex != this.maxPage) {
        this.condition.PageIndex = this.maxPage;
        http(this.getInvoicesType, this.condition).then(
          res => {
            if (res.data.ResCode === 1000) {
              this.$emit("last", res.data.Data.DataList);
              this.showPage = this.condition.PageIndex + "/" + this.maxPage;
            } else {
              this.$message.error(res.data.Msg);
            }
          },
          error => {
            console.log(error);
          }
        );
      }
      this.changeCondition();
    },
    toPage() {
      if (this.gotoPage >= 1 && this.gotoPage <= this.maxPage) {
        this.condition.PageIndex = this.gotoPage;
        http(this.getInvoicesType, this.condition).then(
          res => {
            if (res.data.ResCode === 1000) {
              this.$emit("toPage", res.data.Data.DataList);
              this.showPage = this.condition.PageIndex + "/" + this.maxPage;
            } else {
              this.$message.error(res.data.Msg);
            }
          },
          error => {
            console.log(error);
          }
        );
      }
      this.changeCondition();
    },
    changeCondition() {
      console.log(this.condition);
      this.$emit("changeCondition", this.condition);
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/common.less";
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-right: 12px;
  a {
    margin-left: 6px;
    display: inline-block;
    width: 24px;
    height: 24px;
    &:first-child {
      background: url("@{imgUrl}/list/btn_begin_normal.png") center center
        no-repeat;
      &:hover {
        background: url("@{imgUrl}/list/btn_begin_highlight.png") center center
          no-repeat;
      }
      &:active {
        background: url("@{imgUrl}/list/btn_begin_down.png") center center
          no-repeat;
      }
    }
    &:first-child + a {
      background: url("@{imgUrl}/list/btn_previous_normal.png") center center
        no-repeat;
      &:hover {
        background: url("@{imgUrl}/list/btn_previous_highlight.png") center
          center no-repeat;
      }
      &:active {
        background: url("@{imgUrl}/list/btn_previous_down.png") center center
          no-repeat;
      }
    }
    &:first-child + a + input + a {
      background: url("@{imgUrl}/list/btn_next_normal.png") center center
        no-repeat;
      &:hover {
        background: url("@{imgUrl}/list/btn_next_highlight.png") center center
          no-repeat;
      }
      &:active {
        background: url("@{imgUrl}/list/btn_next_down.png") center center
          no-repeat;
      }
    }
    &:first-child + a + input + a + a {
      background: url("@{imgUrl}/list/btn_last_normal.png") center center
        no-repeat;
      &:hover {
        background: url("@{imgUrl}/list/btn_last_highlight.png") center center
          no-repeat;
      }
      &:active {
        background: url("@{imgUrl}/list/btn_last_down.png") center center
          no-repeat;
      }
    }
    &:last-child {
      width: 42px;
      height: 24px;
      margin-left: 16px;
      background-color: @theme;
      border-radius: 2px;
      color: #fff;
      line-height: 24px;
      text-align: center;
    }
  }
  p {
    display: inline-block;
    margin-left: 20px;
  }
  input {
    width: 42px;
    height: 24px;
    background-color: #ffffff;
    border-radius: 2px;
    border: solid 1px #e5e5e5;
    margin-left: 6px;
    text-align: center;
    &:nth-child(1) {
      margin-right: 6px;
    }
  }
}
</style>
