import Api from "./Api"

export default {
  view (poll) {
    return Api.get(`/poll/${poll}`)
  },

  store (poll) {
    return Api.post(`/poll`, poll)
  },

  vote (option, data) {
    return Api.post(`option/${option}/vote`, data)
  },

  results (poll) {
    return Api.get(`/poll/${poll}/results`)
  },
}
