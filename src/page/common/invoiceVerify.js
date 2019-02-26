const invoiceEditVerify = {
    data() {
        return {
            typeIds: [1, 2, 4, 6]
        }
    },
    methods: {
        amountOrTaxCanEdit(invoiceItem, amountCanEdit) {
            //价税合计 发票税额 是否可编辑判断
            // 真票  InvoiceValidate = 1
            // 电子发票 pdf导入 第三方应用 微信卡包  InvoiceSource = 1,2,4,6
            if (invoiceItem.InvoiceValidate === 1 ||
                _.includes(this.typeIds, invoiceItem.InvoiceSource)) {
                if (amountCanEdit) {
                    return true;
                }
                return false;
            }
            return true;
        },
        codeNumberDateTypeCanEdit(invoiceItem) {
            // 扫码 电子发票 PDF 第三方应用 微信卡包 照片中的二维码（预留
            if (_.includes(this.typeIds, invoiceItem.InvoiceSource)) {
                return false
            }
            return true;
        },
        totalTaxPriceCanEdit(invoiceItem, taxPriceCanEdit) {
            if (invoiceItem.InvoiceValidate === 1 || _.includes(this.typeIds, invoiceItem.InvoiceSource)) {
                if (taxPriceCanEdit) {
                    return true;
                }
                return false
            }
            return true;
        }
    }
}
export {
    invoiceEditVerify
}
