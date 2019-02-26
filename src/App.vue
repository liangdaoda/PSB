<template>
  <div id="app">
    <body-header v-if="isShowNav"></body-header>
    <div class="content">
      <body-nav v-if="isShowNav"></body-nav>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import bodyHeader from "./page/home/header";
import bodyNav from "./page/home/nav";
export default {
  name: "App",
  components: {
    bodyHeader,
    bodyNav
  },
  data() {
    return {};
  },
  mounted() {
    this.$off();
  },
  computed: {
    isShowNav: function() {
      // 如果是在注册和登录页，顶部导航和左侧导航隐藏，否则显示
      if (
        this.$route.path === "/personalLogin" ||
        this.$route.path === "/personalRegister"
      ) {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>

<style lang="less">
@import "style/common.less";
#app {
  overflow: auto;
  .content {
    display: flex;
  }
}
</style>
