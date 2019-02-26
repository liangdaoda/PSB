<template>
  <div class="drap-upload" :class="{active: isDrag}">
  </div>
</template>

<script>
import http from "../..//services/httpAxios.js";
import apiSetting from "../../services/apiSetting.js";
import uploadFile from "../../services/uploadFile.js";
import store from "../../store/store.js";

export default {
  name: "drag-upload",
  data() {
    return {
      isDrag: false
    };
  },
  props: ["uploadLoading"],
  mounted() {
    var dropbox = document.querySelector("#app");
    dropbox.addEventListener("dragenter", this.onDragEnter, false);
    dropbox.addEventListener("dragover", this.onDragOver, false);
    dropbox.addEventListener("dragleave", this.onDragLeave, false);
    dropbox.addEventListener("drop", this.onDrop, false);
  },
  destroyed() {
    // 注销拖拽事件
    var dropbox = document.querySelector("#app");
    dropbox.removeEventListener("dragenter", this.onDragEnter, false);
    dropbox.removeEventListener("dragover", this.onDragOver, false);
    dropbox.removeEventListener("dragleave", this.onDragLeave, false);
    dropbox.removeEventListener("drop", this.onDrop, false);
  },
  watch: {},
  methods: {
    upload(file) {
      this.$emit("changeUploadLoading", "true");
      let formData = new FormData();
      let type = "";
      formData.append("WithoutUser", true);
      formData.append("File", file);
      if (file.size > 10 * 1024 * 1024) {
        this.$message.error("请上传小于10M的图片或PDF文件");
        return false;
      }
      if (file.type.indexOf("image") != -1) {
        type = "img";
      } else if (file.type.indexOf("pdf") != -1) {
        type = "pdf";
      }
      uploadFile(formData, type).then(res => {
        this.$emit("changeUploadLoading", false);
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
    // 拖拽进入
    onDragEnter(e) {
      e.stopPropagation();
      e.preventDefault();
      this.isDrag = true;
    },
    // 拖拽拖动
    onDragOver(e) {
      e.stopPropagation();
      e.preventDefault();
      this.isDrag = true;
    },
    // 拖拽离开
    onDragLeave(e) {
      // 解决元素之间重复触发
      if (e.path.length < 11) {
        e.stopPropagation();
        e.preventDefault();
        this.isDrag = false;
      }
    },
    // 拖拽释放
    onDrop(e) {
      e.stopPropagation();
      e.preventDefault();
      this.isDrag = false;
      var dt = e.dataTransfer;
      if (dt.files.length === 1) {
        this.upload(dt.files[0]);
      } else {
        this.$message.error("请选择1个发票文件");
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/common.less";
.drap-upload {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  display: none;
  opacity: 0.8;
  background: #fff url("@{imgUrl}/list/upload.png") center center no-repeat;
}
.drap-upload.active {
  display: block;
  z-index: 3;
}
</style>
