<template>
  <div class="header">
    <div class="top">
      <div>
        <p class="tl">
          <a :href="`${WebSitePath}/personalIndex.html`">个人版</a>
          <a :href="`${WebSitePath}/companyIndex.html`">企业版</a>
          <a :href="`${WebSitePath}/platform.html`">开放平台</a>
          <a :href="`${WebSitePath}/collect.html`">票据收集</a>
          <a v-if="!isJinCaiHuLian" :href="`${WebSitePath}/partnerIndex.html`">合作伙伴</a>
        </p>
        <p class="tr">
          <span>你好，</span>
          <span>{{NickName}}</span>
          <span></span>
          <span>{{welcomeName}}</span>
        </p>
      </div>
    </div>
    <div class="content">
      <div class="logo" @click="gotoWebSite">
        <img :src="logo" :style="logoStyle" alt="">
      </div>
      <p class="title">发票管理</p>
    </div>
  </div>
</template>

<script>
import http from "../..//services/httpAxios.js";
import apiSetting from "../../services/apiSetting.js";
import {
  AuthInfo,
  ApiPath,
  WebSitePath,
  imgBaseUrl,
  JinCaiWebSitePath
} from "../../config/env";
import store from "../../store/store.js";
export default {
  name: "body-header",
  created() {
    // 获取token
    if (this.$route.query.token) {
      localStorage.setItem("token", this.$route.query.token);
      AuthInfo.Token = this.$route.query.token;
    } else {
      AuthInfo.Token = localStorage.getItem("token");
    }
    //#region add by qinpeihua 如果是来自金财互联，则公司logo要改 合作伙伴隐藏
    if (this.$route.query.Companey) {
      localStorage.setItem("isJinCaiHuLian", this.$route.query.Companey);
      AuthInfo.Companey = this.$route.query.Companey;
      this.isJinCaiHuLian =
        this.$route.query.Companey == "jincaihulian" ? false : true;
      this.welcomeName = "我的金财互联";
      this.logo = imgBaseUrl + "jchl_logo.png";
      this.WebSitePath = JinCaiWebSitePath;
    }
    //#endregion
    this.token = AuthInfo.Token;
    http(apiSetting.GetMemberDetail, {}).then(
      res => {
        if (res.data.ResCode === 1000) {
          this.NickName = res.data.Data.NickName;
          this.$store.commit("updateMobilePhone", res.data.Data.MobilePhone);
        } else {
          this.$message.error(res.data.Msg);
        }
      },
      error => {
        console.log(error);
      }
    );
  },
  data() {
    return {
      NickName: "",
      token: "",
      WebSitePath: WebSitePath,
      isJinCaiHuLian: false,
      welcomeName: "我的票税宝",
      logo: imgBaseUrl + "home/logo.png"
    };
  },
  computed: {
    logoStyle() {
      if (this.isJinCaiHuLian) {
        return {
          width: "129px",
          height: "32px",
          "margin-top": "13px"
        };
      }
    }
  },
  methods: {
    gotoWebSite() {
      if (this.companey == "jincaihulian") {
        window.location.href = this.WebSitePath + "/index.html"; //去金财互联官网地址
      } else {
        window.location.href = this.WebSitePath + "/index.html"; //去票税宝官网地址
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../style/common.less";
.header {
  width: 100%;
  background-color: #fff;
  min-width: 1180px;
  font-size: 14px;
  .content {
    display: flex;
    border-bottom: 1px solid #e5e5e5;
    .logo {
      cursor: pointer;
      display: inline-block;
      width: 180px;
      height: 56px;
      img {
        margin-top: 10px;
        margin-left: 23px;
        vertical-align: middle;
      }
    }
    p {
      display: inline-block;
      margin-left: 23px;
      color: @titleColor;
      line-height: 56px;
    }
  }
  .top {
    height: 25px;
    background-color: #1e1b29;
    font-size: 12px;
    div {
      width: 1200px;
      margin: 0 auto;
      position: relative;
      line-height: 25px;
      p {
        display: inline-block;
        color: #fff;
        a {
          color: #fff;
          &:hover {
            color: #3b8bfd;
          }
          &:first-child {
            color: #3b8bfd;
          }
        }
      }
      .tl {
        a {
          margin-right: 27px;
        }
      }
      .tr {
        position: absolute;
        right: 0;
        span {
          &:first-child + span + span {
            display: inline-block;
            height: 16px;
            border-left: 1px solid #fff;
            margin: 0 12px;
            position: relative;
            top: 4px;
          }
          &:first-child + span + span + span {
            color: #3b8bfd;
          }
        }
      }
    }
  }
}
</style>
