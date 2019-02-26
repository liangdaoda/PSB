<template>
  <div class="nav">
    <div class="content">
      <ul>
        <li :class="{active: !recycle && condition.InvoiceProperty === 0 && condition.InvoiceSource !== 7}" @click="toList(1)">全部发票</li>
        <li :class="{active: !recycle && condition.InvoiceProperty === 1}" @click="changeCondition(1)">单位发票</li>
        <li :class="{active: !recycle && condition.InvoiceProperty === 2}" @click="changeCondition(2)">家庭发票</li>
        <li :class="{active: !recycle && condition.InvoiceSource === 7}" @click="changeCondition(3)">邮箱发票</li>
        <li :class="{active: recycle}" @click="toList(2)">已删除发票</li>
      </ul>
    </div>
  </div>
</template>

<script>
import store from "../../store/store.js";

export default {
  name: "body-nav",
  data() {
    return {
      recycle: false,
      condition: {}
    };
  },
  created() {
    this.condition = this.$store.state.condition;
  },
  mounted() {
    if (this.$route.path == "/invoiceList") {
      this.recycle = false;
    } else if (this.$route.path == "/recycle") {
      this.recycle = true;
    }
  },
  methods: {
    toList(list) {
      if (list == 1) {
        this.$store.state.condition.InvoiceProperty = 0;
        this.$store.state.condition.InvoiceSource = 0;
        this.$router.push({
          name: "invoiceList"
        });
        this.recycle = false;
      } else if (list == 2) {
        this.$router.push({
          name: "recycleList"
        });
        //  this.$router.push({
        //   name: "invoiceDetail"
        // });
        this.recycle = true;
      }
    },
    changeCondition(status) {
      this.recycle = false;
      this.$router.push({
        name: "invoiceList"
      });
      if (status === 3) {
        this.$store.state.condition.InvoiceSource = 7;
        this.$store.state.condition.InvoiceProperty = 0;
      } else {
        this.$store.state.condition.InvoiceSource = 0;
        this.$store.state.condition.InvoiceProperty = status;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/common.less";
.nav {
  height: 100vh;
  background-color: #f7f9fb;
  min-height: 500px+58px;
  overflow: hidden;
  width: 180px;
  flex: 0 0 180px;
  border-right: 1px solid #e5e5e5;
  .content {
    display: inline-block;
    width: 180px;
    ul {
      li {
        width: 116px;
        height: 46px;
        padding-left: 60px;
        line-height: 46px;
        border-left: 4px solid #f7f9fb;
        background-size: 20px 22px;
        cursor: pointer;
        &:first-child {
          margin-top: 11px;
          background: #f7f9fb url("@{imgUrl}/home/ico_invoice_normal.png") 20px
            center no-repeat;
          &.active {
            background: hsl(0, 0%, 92%)
              url("@{imgUrl}/home/ico_invoice_down.png") 20px center no-repeat;
            color: @theme;
          }
        }
        &:first-child + li {
          background: #f7f9fb url("@{imgUrl}/home/ico_company_normal.png") 20px
            center no-repeat;
          &.active {
            background: #ebebeb url("@{imgUrl}/home/ico_company_down.png") 20px
              center no-repeat;
            color: @theme;
          }
        }
        &:first-child + li + li {
          background: #f7f9fb url("@{imgUrl}/home/ico_family_normal.png") 20px
            center no-repeat;
          &.active {
            background: #ebebeb url("@{imgUrl}/home/ico_family_down.png") 20px
              center no-repeat;
            color: @theme;
          }
        }
        &:first-child + li + li + li {
          background: #f7f9fb url("@{imgUrl}/home/ico_email_normal.png") 20px
            center no-repeat;
          &.active {
            background: #ebebeb url("@{imgUrl}/home/ico_email_down.png") 20px
              center no-repeat;
            color: @theme;
          }
        }
        &:first-child + li + li + li + li {
          background: #f7f9fb url("@{imgUrl}/home/ico_delete_normal.png") 20px
            center no-repeat;
          &.active {
            background: #ebebeb url("@{imgUrl}/home/ico_delete_down.png") 20px
              center no-repeat;
            color: @theme;
          }
        }
      }
      .active {
        border-left: 4px solid @theme;
      }
    }
  }
}
</style>
