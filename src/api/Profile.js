import Api from "./Api"

export default {
  store (profile) {
    return Api.post(`/profile`, profile)
  },
}
