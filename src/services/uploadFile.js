import axios from 'axios'
import {
  ApiPath,
  AuthInfo
} from '../config/env'

export default async (formData, type) => {
  let config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }; //添加请求头
  let url = ApiPath + (type === "img" ? "/Invoice/CreateInvoiceByImage" : "/Invoice/CreateInvoiceByPdf");
  formData.append("Platform", AuthInfo.Platform);
  formData.append("Token", AuthInfo.Token);
  formData.append("DeviceId", AuthInfo.DeviceId);
  formData.append("Latlng", AuthInfo.Latlng);
  formData.append("ApiVersion", AuthInfo.ApiVersion)
  return axios.post(url, formData, config).then(response => {
    return response;
  })
}
