import axios from 'axios'
import Cookie from "js-cookie"

let Api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL
})

Api.defaults.headers.common = {
    "X-Requested-With": "XMLHttpRequest",
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Language": "en",
    "X-XSRF-TOKEN": Cookie.get("XSRF-TOKEN") ?? null,
}

export default Api;
