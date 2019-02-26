<template>
  <el-table class="invoiceTable" ref="multipleTable" :data="invoiceItems" tooltip-effect="dark" style="width: 100%" @cell-click="toSelect" @select-all="selectAll" @select="select" @selection-change="handleSelectionChange" @sort-change="sortChange">
    <el-table-column type="selection" width="34" :selectable="checkSelectAble"></el-table-column>
    <el-table-column ref="InvoiceDate" min-width="140" label="开票日期" sortable="custom" show-overflow-tooltip>
      <template slot-scope="scope">
        <span @click.stop="toEdit(scope.row)">{{scope.row.InvoiceDate}}</span>
        <!-- <el-tooltip effect="light" class="item" content="报销不合规" placement="bottom-start">
          <i v-show="!scope.row.IsCompliance" class="warn"></i>
        </el-tooltip> -->
        <el-tooltip effect="light" class="item" placement="bottom-start">
          <div slot="content">真发票<br/>发票信息与国家税务机关电子信息一致</div>
          <i v-show="scope.row.InvoiceValidate === 1" class="warn right"></i>
        </el-tooltip>
        <el-tooltip effect="light" class="item" placement="bottom-start">
          <div slot="content">异常发票<br/>发票信息与国家税务机关电子信息至少有一项不一致</div>
          <i v-show="scope.row.InvoiceValidate === 3" class="warn error"></i>
        </el-tooltip>
        <el-tooltip effect="light" class="item" placement="bottom-start">
          <div slot="content">无此发票<br/>发票信息无法在国家税务机关的电子信息中查到</div>
          <i v-show="scope.row.InvoiceValidate === 2" class="warn none"></i>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column ref="RecordDate" min-width="140" label="添加日期" sortable="custom" show-overflow-tooltip>
      <template slot-scope="scope">
        <span @click.stop="toEdit(scope.row)">{{scope.row.RecordDate.substring(0,10)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="商家" min-width="140" show-overflow-tooltip>
      <template slot-scope="scope">
        <span @click.stop="toEdit(scope.row)">{{scope.row.InvoiceCompany}}</span>
      </template>
    </el-table-column>
    <el-table-column ref="Amount" min-width="140" label="价税合计" sortable="custom" show-overflow-tooltip>
      <template slot-scope="scope">
        <span @click.stop="toEdit(scope.row)">{{scope.row.FAmount ? scope.row.FAmount : scope.row.Amount}}</span>
      </template>
    </el-table-column>
    <el-table-column label="费用类型" min-width="140" show-overflow-tooltip>
      <template slot-scope="scope">
        <i :class="{family: scope.row.InvoiceProperty === 2}"></i>
        <span @click.stop="toEdit(scope.row)" v-html="highlight(scope.row.FullChargeTypeName)"></span>
      </template>
    </el-table-column>
    <el-table-column label="发票状态" min-width="140" show-overflow-tooltip>
      <template slot-scope="scope">
        <span @click.stop="toEdit(scope.row)">{{ scope.row.StatusName}}</span>
      </template>
    </el-table-column>
    <el-table-column label="用途" width="420" show-overflow-tooltip>
      <template slot-scope="scope">
        <span @click.stop="toEdit(scope.row)">{{scope.row.InvoicePurpose}}</span>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  data() {
    return {
      multipleSelection: [],
      oldSelection: [],
      selectMore: false,
      selectItems: []
    };
  },
  props: ["invoiceItems", "deleteInvs", "selectAble", "condition", "type"],
  watch: {
    // 列表数据发生变化
    invoiceItems: {
      handler: function(newValue, oldValue) {
        let selectedItems = [];
        this.oldSelection = [];
        for (let i = 0; i < this.deleteInvs.length; i++) {
          for (let j = 0; j < this.invoiceItems.length; j++) {
            if (this.deleteInvs[i].Id == this.invoiceItems[j].Id) {
              selectedItems.push(this.invoiceItems[j]);
              this.oldSelection.push(this.invoiceItems[j]);
            }
          }
        }
        this.toggleSelection(selectedItems);
      },
      deep: true
    }
  },
  mounted() {
    // 检测回收站去掉排图标
    if (!this.type) {
      setTimeout(() => {
        var icoSort = document.querySelectorAll(".caret-wrapper");
        for (let i = 0; i < icoSort.length; i++) {
          icoSort[i].style.display = "none";
        }
      }, 1);
    }
    switch (this.condition.SortColumn) {
      case "InvoiceDate":
        if (this.condition.SortMode) {
          this.$refs.InvoiceDate.columnConfig.order = "ascending";
        } else {
          this.$refs.InvoiceDate.columnConfig.order = "descending";
        }
        break;
      case "RecordDate":
        if (this.condition.SortMode) {
          this.$refs.RecordDate.columnConfig.order = "ascending";
        } else {
          this.$refs.RecordDate.columnConfig.order = "descending";
        }
        break;
      case "Amount":
        if (this.condition.SortMode) {
          this.$refs.Amount.columnConfig.order = "ascending";
        } else {
          this.$refs.Amount.columnConfig.order = "descending";
        }
        break;
      default:
        break;
    }
  },
  methods: {
    // 已选发生变化
    handleSelectionChange(items) {
      if (this.multipleSelection.length < items.length) {
        this.selectMore = true;
      } else {
        this.selectMore = false;
      }
      this.multipleSelection = items;
    },
    // 勾选
    toggleSelection(rows) {
      setTimeout(() => {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      }, 1);
    },
    // 点击选中某条数据
    select(selection, row) {
      if (this.selectMore) {
        this.deleteInvs.push(row);
      } else {
        for (let i = 0; i < this.deleteInvs.length; i++) {
          if (this.deleteInvs[i].Id === row.Id) {
            this.deleteInvs.splice(i, 1);
          }
        }
      }
      let flag = true;
      for (let j = 0; j < this.oldSelection.length; j++) {
        if (this.oldSelection[j].Id == row.Id) {
          flag = false;
        }
      }
      if (flag) {
        this.oldSelection.push(row);
      }
      this.$emit("selectItems", this.deleteInvs);
    },
    // 点击全选
    selectAll(items) {
      console.log(items);
      if (this.selectAble) {
        if (items.length === 0 || this.selectMore === false) {
          for (let i = 0; i < this.deleteInvs.length; i++) {
            for (let j = 0; j < this.oldSelection.length; j++) {
              if (this.deleteInvs[i].Id === this.oldSelection[j].Id) {
                // 避免索引问题，赋空值
                this.deleteInvs[i] = "";
              }
            }
          }
          this.$emit("selectItems", this.deleteInvs);
        } else {
          for (let i = 0; i < this.multipleSelection.length; i++) {
            this.deleteInvs.push(this.multipleSelection[i]);
          }
          this.$emit("selectItems", this.deleteInvs);
        }
        // 去重
        this.oldSelection = [];
        for (let i = 0; i < items.length; i++) {
          let flag = true;
          for (let j = 0; j < this.oldSelection.length; j++) {
            if (this.oldSelection[j].Id == items[i].Id) {
              flag = false;
            }
          }
          if (flag) {
            this.oldSelection.push(items[i]);
          }
        }
      }
    },
    // 检测是否到达勾选上限
    checkSelectAble(row, index) {
      if (!this.selectAble) {
        for (let i = 0; i < this.deleteInvs.length; i++) {
          if (row.Id === this.deleteInvs[i].Id) {
            return true;
          }
        }
      } else {
        return true;
      }
    },
    // 点击某一条数据
    toSelect(row, column, cell, event) {
      this.toggleSelection([row]);
      // 与选择数据变化方法顺序冲突，需加定时器
      setTimeout(() => {
        if (this.selectMore) {
          this.deleteInvs.push(row);
        } else {
          for (let i = 0; i < this.deleteInvs.length; i++) {
            if (this.deleteInvs[i].Id === row.Id) {
              this.deleteInvs.splice(i, 1);
            }
          }
        }
        let flag = true;
        for (let j = 0; j < this.oldSelection.length; j++) {
          if (this.oldSelection[j].Id == row.Id) {
            flag = false;
          }
        }
        if (flag) {
          this.oldSelection.push(row);
        }
        this.$emit("selectItems", this.deleteInvs);
      }, 1);
    },
    // 跳转编辑页
    toEdit(row) {
      if (this.type === "invoiceList") {
        this.$router.push({
          name: "editInvoice",
          params: { invoiceItem: row, source: "edit" }
        });
      }
    },
    // 搜索关键词高亮显示
    highlight(text) {
      var reg = new RegExp(this.condition.Keyword, "g");
      if (reg.test(text)) {
        text = text.replace(
          reg,
          '<span style="color: red">' + this.condition.Keyword + "</span>"
        );
      }
      return text;
    },
    checkAmount() {
      let amount = this.invoiceItem.FAmount || this.invoiceItem.Amount + "";
      let arr = amount.split(".");
      if (arr[0].length > 4) {
        arr[0] = arr[0].slice(0, 2);
        arr[1] = arr[0].slice(2, 4) + "万";
      } else {
        if (typeof arr[1] == "undefined") {
          arr[1] = "00";
        } else if (arr[1].length == 1) {
          arr[1] = arr[1] + "0";
        }
      }
      this.amountFront = arr[0] || 0;
      this.amountEnd = arr[1];
    },
    // 排序 降序descending 升序ascending
    sortChange(column) {
      if (column.column) {
        switch (column.column.label) {
          case "开票日期":
            this.$refs.RecordDate.columnConfig.order = null;
            this.$refs.Amount.columnConfig.order = null;
            this.condition.SortColumn = "InvoiceDate";
            if (column.order === "descending") {
              this.condition.SortMode = 0;
            } else {
              this.condition.SortMode = 1;
            }
            break;
          case "添加日期":
            this.$refs.InvoiceDate.columnConfig.order = null;
            this.$refs.Amount.columnConfig.order = null;
            this.condition.SortColumn = "RecordDate";
            if (column.order === "descending") {
              this.condition.SortMode = 0;
            } else {
              this.condition.SortMode = 1;
            }
            break;
          case "价税合计":
            this.$refs.RecordDate.columnConfig.order = null;
            this.$refs.InvoiceDate.columnConfig.order = null;
            this.condition.SortColumn = "Amount";
            if (column.order === "descending") {
              this.condition.SortMode = 0;
            } else {
              this.condition.SortMode = 1;
            }
            break;
          default:
            break;
        }
      } else {
        // 去掉默认排序
        switch (this.condition.SortColumn) {
          case "InvoiceDate":
            this.$refs.InvoiceDate.columnConfig.order = "ascending";
            this.condition.SortMode = 1;
            break;
          case "RecordDate":
            this.$refs.RecordDate.columnConfig.order = "ascending";
            this.condition.SortMode = 1;
            break;
          case "Amount":
            this.$refs.Amount.columnConfig.order = "ascending";
            this.condition.SortMode = 1;
            break;
          default:
            break;
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../style/common.less";
.el-table {
  margin: 25px;
  background-color: #ffffff;
  border-radius: 6px;
  border: solid 1px #e5e5e5;
  .warn {
    width: 16px;
    height: 16px;
    display: inline-block;
    background: url("@{imgUrl}/list/ico_hint.png") center center no-repeat;
    position: relative;
    top: 3px;
    left: 6px;
    line-height: 0px;
  }
  .right {
    background: url("@{imgUrl}/list/right.png") center center no-repeat;
  }
  .error {
    background: url("@{imgUrl}/list/error.png") center center no-repeat;
  }
  .none {
    background: url("@{imgUrl}/list/none.png") center center no-repeat;
  }
  .family {
    position: absolute;
    left: -12px;
    top: 13px;
    width: 20px;
    height: 20px;
    background: url("@{imgUrl}/list/family.png") center center no-repeat;
  }
}
</style>
<style lang="less">
@import "../../style/common.less";
// 表格自定义样式
.content {
  .right {
    .list {
      > .el-table {
        width: 98% !important;
        color: #777 !important;
        border-bottom: none !important;
        font-size: 12px !important;
        thead {
          color: #333 !important;
          font-size: 13px !important;
        }
      }
    }
  }
}
// 勾选框样式自定义
.el-checkbox {
  color: transparent !important;
}
.el-table-column--selection .cell {
  padding-right: 0px !important;
}
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #fff !important;
  border-color: #ddd !important;
}
.el-checkbox__inner::after {
  border: 1px solid @theme !important;
  border-left: 0 !important;
  border-top: 0 !important;
}
.el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #ddd !important;
}
.el-checkbox__inner:hover {
  border-color: #ddd !important;
}
// 报销不合规提示文字
.el-tooltip__popper.is-light {
  background: #fffcde !important;
  border: 1px solid #e5e5e5 !important;
  color: #666 !important;
  width: 156px;
}
.el-tooltip__popper .popper__arrow:after {
  border-bottom-color: #fffcde !important;
}
.el-tooltip__popper[x-placement^="bottom"] .popper__arrow::after {
  border-bottom-color: #fffcde;
}
.el-tooltip__popper[x-placement^="bottom"] .popper__arrow::after {
  top: 1px !important;
  margin-left: -5px !important;
  border-top-width: 0 !important;
  border-bottom-color: #fffcde !important;
}
.el-tooltip__popper.is-light[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: #e5e5e5 !important;
}
.el-table .cell span {
  cursor: pointer !important;
}
// 序号数字
.el-table .cell .num {
  position: relative !important;
  font-size: 13px !important;
  top: 1px !important;
  line-height: 0px;
}
// 表头点击
.el-table th:first-child + th > .cell,
.el-table th:first-child + th + th > .cell,
.el-table th:first-child + th + th + th + th > .cell {
  cursor: pointer;
}
// 排序箭头
.el-table .caret-wrapper {
  position: absolute !important;
  top: -4px !important;
  left: 58px !important;
}

//表格文字
.el-table .cell,
.el-table th div {
  padding-right: 24px !important;
}
// 去掉...
.el-table th {
  overflow: visible !important;
}
.el-table th:first-child .cell,
.el-table td:first-child .cell,
.el-table th:first-child div {
  overflow: visible !important;
}
.el-table th div {
  overflow: hidden !important;
}
</style>

