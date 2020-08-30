import axios from 'axios'
import Cookie from 'js-cookie'
import { vm } from '@/main'

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

Api.interceptors.response.use((response) => {
  return response;
}, function (error) {
  if (error.response.status === 404) {
    vm.$notify({
      type: 'error',
      title: 'Oopsie',
      text: 'Not sure what you\'re trying to find but that poll doesn\'t exist.',
    })

    vm.$router.push({ name: 'Create'})
  }

  if (error.response.status >= 500) {
    vm.$notify({
      type: 'error',
      title: 'Oopsie',
      text: 'It looks like this time we made the oopsie. Let\'s not talk about this. Try whatever you were doing again.',
    })
  }
  return Promise.reject(error.response);
});

export default Api;
