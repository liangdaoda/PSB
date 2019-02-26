<template>
  <div class="personal-login">
    <div class="login-wrap">
      <div class="login-header">
        <h4>个人登录</h4>
      </div>
      <div class="input-box phone-box">
        <span>手机号码</span>
        <input v-model="telphone" type="tel" placeholder="请输入你的手机号">
      </div>
      <div class="input-box password-box">
        <span>密码</span>
        <input v-model="password" type="text" placeholder="请输入密码">
      </div>
      <a class="login-button" href="javascript:;" :style="enableLogin" @click="onClickLogin">登录</a>
      <div class="login-foot">
        <a @click="forgetPassword" href="javascript:;">忘记密码？</a>
        <a class="register-now" @click="onRegisterNow" href="javascript:;">
          <i></i>
          立即注册
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import apiSetting from "../../services/apiSetting.js";
import http from "../../services/httpAxios.js";
import { AuthInfo } from "../../config/env";
import { isOpenPlatform, getPlatformInfo } from "../../config/util";
export default {
  name: "personalLogin",
  data() {
    return {
      telphone: "",
      password: ""
    };
  },
  computed: {
    enableLogin() {
      if (_.isEmpty(this.telphone) || _.isEmpty(this.password)) {
        return {
          "background-color": "#dcdcdc",
          "pointer-events": "none"
        };
      } else {
        return {
          "background-color": "#3b8bfd",
          "pointer-events": "auto"
        };
      }
    }
  },
  methods: {
    onClickLogin() {
      if (!/^1[34578]\d{9}$/.test(this.telphone)) {
        this.$message.error("手机号码格式不正确");
        return false;
      }
      if (this.password.length < 6) {
        this.$message.error("请输入6-30位非汉字");
        return false;
      }
      // 第三方进入我们的开放平台才需要登录页
      let platformInfo = getPlatformInfo();
      let loginData = {
        UserName: this.telphone,
        Password: this.password
      };
      if (isOpenPlatform()) {
        _.extend(loginData, {
          EnterpriseUserId: platformInfo.enterpriseUserId,
          EnterpriseId: platformInfo.enterpriseId
        });
      }
      let self = this;
      http(apiSetting.PersonalLogin, loginData).then(
        res => {
          if (res.data.ResCode === 1000) {
            self.$message({
              showClose: true,
              message: "登录成功",
              type: "success"
            });
            AuthInfo.Token = res.data.Token;
            AuthInfo.RefreshToken = res.data.RefreshToken;
            localStorage.setItem("token", res.data.Token);
            localStorage.setItem("refreshToken", res.data.RefreshToken);
            if (isOpenPlatform()) {
              if (platformInfo && platformInfo.targetUrl) {
                self.$router.replace(platformInfo.targetUrl);
              } else {
                console.log("targetUrl不存在");
              }
            } else {
              // 登录去成功去到发票列表
              self.$router.push({
                name: "invoiceList"
              });
            }
          } else {
            this.$message.error(res.data.Msg);
          }
        },
        error => {
          this.$message.error("登录失败");
        }
      );
    },
    forgetPassword() {},
    onRegisterNow() {
      this.$router.push({
        name: "personalRegister"
      });
    }
  }
};
</script>
<style lang="less" scoped>
.personal-login {
  margin: 0 auto;
  border-radius: 6px;
  .login-wrap {
    text-align: center;
    margin: 164px auto 0 auto;
    width: 540px;
    height: 438px;
    background-color: #ffffff;
    box-shadow: 0px -4px 20px 0px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    .login-header {
      height: 56px;
      border-radius: 6px 6px 0px 0px;
      background-image: url("../../../static/images/login/bg_blue.png");
      background-position: center center;
      background-size: 540px 56px;
      h4 {
        font-size: 18px;
        color: white;
        margin-bottom: 4px;
        height: 48px;
        line-height: 48px;
      }
    }
    .input-box {
      margin: 0 auto;
      line-height: 54px;
      width: 400px;
      height: 54px;
      background-color: #ffffff;
      border-radius: 2px;
      border: solid 1px #dddddd;
      text-align: left;
      span {
        width: 64px;
        height: 12px;
        font-family: "MicrosoftYaHei";
        font-size: 13px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 14px;
        letter-spacing: 0px;
        color: #333333;
        margin: 0 34px 0 17px;
      }
      input {
        font-size: 13px;
        padding: 15px 0;
        outline: none;
        width: 270px;
      }
    }
    .phone-box {
      margin-top: 48px;
      span {
        margin: 0 34px 0 17px;
      }
    }
    .password-box {
      margin-top: 32px;
      span {
        letter-spacing: 30px;
        margin-right: -2px;
      }
    }
    .login-button {
      width: 400px;
      height: 54px;
      line-height: 54px;
      background-color: #3b8bfd;
      border-radius: 2px;
      display: inline-block;
      color: white;
      font-family: "MicrosoftYaHei";
      font-size: 16px;
      font-weight: normal;
      color: #ffffff;
      margin-top: 60px;
    }
    .login-foot {
      display: flex;
      margin-top: 32px;
      height: 48px;
      line-height: 48px;
      background-color: #f7faff;
      a {
        flex: 1;
        width: 50%;
        font-family: "MicrosoftYaHei";
        font-size: 15px;
        font-weight: normal;
        color: #666666;
      }
      .register-now {
        color: #3b8bfd;
        i {
          display: inline-block;
          width: 16px;
          height: 16px;
          background-image: url("../../../static/images/login/ico.png");
          background-position: center center;
          background-size: 16px 16px;
          background-repeat: no-repeat;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
