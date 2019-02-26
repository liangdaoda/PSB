<template>
  <div class="personal-register">
    <div class="register-wrap">
      <div class="register-header">
        <h4>个人注册</h4>
      </div>
      <div class="input-box phone-box">
        <span>手机号码</span>
        <input v-model="telphone" type="tel" placeholder="请输入你的手机号">
      </div>
      <div class="input-box check-number-box">
        <span>手机验证码</span>
        <input v-model="smsCode" type="tel" placeholder="请输入验证码">
        <a v-show="canGetSms" :style="enableGetSms" @click="getSms" href="javascript:;">获取验证码</a>
        <a v-show="!canGetSms" :style="enableGetSms" href="javascript:;">重新获取({{count}})s</a>
      </div>
      <div class="input-box password-box">
        <span>设置密码</span>
        <input v-model="password" type="tel" placeholder="请输入密码">
      </div>
      <div class="input-box comfirm-password-box">
        <span>确认密码</span>
        <input v-model="confirmPwd" type="tel" placeholder="请再次输入密码">
      </div>
      <a :style="enableRegister" @click="onClickRegister" class="register-button" href="javascript:;">注册</a>
    </div>
  </div>
</template>
<script>
import apiSetting from "../../services/apiSetting.js";
import http from "../..//services/httpAxios.js";
import { AuthInfo } from "../../config/env";
import { isOpenPlatform, getPlatformInfo } from "../../config/util";
export default {
  name: "personalRegister",
  data() {
    return {
      telphone: "",
      smsCode: "",
      password: "",
      confirmPwd: "",
      timer: null,
      canGetSms: true,
      count: ""
    };
  },
  computed: {
    enableGetSms() {
      if (_.isEmpty(this.telphone)) {
        return {
          "background-color": "#f2f2f2",
          "pointer-events": "none"
        };
      } else {
        if (this.canGetSms) {
          return {
            "background-color": "#e5e5e5",
            "pointer-events": "auto"
          };
        } else {
          return {
            "background-color": "#f2f2f2",
            "pointer-events": "none"
          };
        }
      }
    },
    enableRegister() {
      if (
        _.isEmpty(this.telphone) ||
        _.isEmpty(this.smsCode) ||
        _.isEmpty(this.password) ||
        _.isEmpty(this.confirmPwd)
      ) {
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
    getSms() {
      if (!/^1[34578]\d{9}$/.test(this.telphone)) {
        this.$message.error("手机号码格式不正确");
        return false;
      } else {
        http(apiSetting.GetSms, {
          FlagType: 1, //（0-验证码登陆,1-注册,2-找回密码,3-手机或邮箱验证）
          Account: this.telphone
        }).then(
          res => {
            if (res.data.ResCode === 1000) {
              const TIME_COUNT = 60;
              let self = this;
              if (!this.timer) {
                self.count = TIME_COUNT;
                self.canGetSms = false;
                self.timer = setInterval(() => {
                  if (self.count > 0 && self.count <= TIME_COUNT) {
                    self.count--;
                  } else {
                    self.canGetSms = true;
                    window.clearInterval(self.timer);
                    self.timer = null;
                  }
                }, 1000);
              }
            } else {
              this.$message.error(res.data.Msg);
            }
          },
          error => {
            console.log("获取验证码失败");
          }
        );
      }
    },
    isMeetConditions(obj) {
      if (obj.condition) {
        this.$message.error(obj.tip);
        return true;
      }
      return false;
    },
    onClickRegister() {
      let judgeObj = [
        {
          condition: !/^1[34578]\d{9}$/.test(this.telphone),
          tip: "手机号码格式不正确"
        },
        {
          condition: !/^\d{6}$/.test(this.smsCode),
          tip: "验证码不正确"
        },
        {
          condition: !/^[a-zA-Z0-9_\@\-\+\!\#\$\%\^\&\*\(\)\.\~\?\,\:\/\=\;\<\>\|\[\]\{\}]{6,30}$/.test(
            this.password
          ),
          tip: "请输入6-30位非汉字"
        },
        {
          condition: !_.eq(this.password, this.confirmPwd),
          tip: "2次密码不一致"
        }
      ];
      for (let i = 0; i < judgeObj.length; i++) {
        if (this.isMeetConditions(judgeObj[i])) {
          return false;
        }
      }
      let accountData = {
        MobilePhone: this.telphone,
        Password: this.password,
        ValidCode: this.smsCode
      };
      let self = this;
      let platform = getPlatformInfo();
      if (isOpenPlatform()) {
        _.extend({
          EnterpriseUserId: platformInfo.enterpriseUserId,
          EnterpriseId: platformInfo.enterpriseId
        });
      }
      http(apiSetting.AccountRegister, accountData).then(
        res => {
          if (res.data.ResCode === 1000) {
            self.$message({
              showClose: true,
              message: "注册成功",
              type: "success"
            });
            AuthInfo.Token = res.data.Token;
            localStorage.setItem("token", res.data.Token);
            localStorage.setItem("token", res.data.Token);
            localStorage.setItem("refreshToken", res.data.RefreshToken);
            if (isOpenPlatform()) {
              if (platformInfo && platformInfo.targetUrl) {
                self.$router.replace(platformInfo.targetUrl);
              } else {
                console.log(`跳转地址不存在.`);
              }
            } else {
              // 登录成功去到发票列表
              self.$router.push({
                name: "invoiceList"
              });
            }
          } else {
            self.$message.error(res.data.Msg);
          }
        },
        error => {
          self.$message.error("注册失败");
        }
      );
    }
  }
};
</script>
<style lang="less" scoped>
.personal-register {
  border-radius: 6px;
  margin: 0 auto;
  .register-wrap {
    text-align: center;
    margin: 164px auto 0 auto;
    width: 540px;
    height: 550px;
    background-color: #ffffff;
    box-shadow: 0px -4px 20px 0px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    .register-header {
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
      margin: 0 auto 32px auto;
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
        letter-spacing: 3px;
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
        margin: 0 30px 0 17px;
      }
    }
    .check-number-box {
      input {
        width: 163.5px;
      }
      span {
        letter-spacing: 0px;
      }
      a {
        width: 110px;
        height: 46px;
        line-height: 46px;
        text-align: center;
        background-color: #f2f2f2;
        display: inline-block;
      }
    }
    .register-button {
      width: 400px;
      height: 54px;
      line-height: 54px;
      background-color: #3b8bfd;
      border-radius: 2px;
      display: inline-block;
      font-family: "MicrosoftYaHei";
      font-size: 16px;
      font-weight: normal;
      color: #ffffff;
    }
  }
}
</style>

