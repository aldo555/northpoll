import Api from "./Api"

export default {
  view (poll) {
    return Api.get(`/poll/${poll}`)
  },

  store (poll) {
    return Api.post(`/poll`, poll)
  },

  vote (option) {
    return Api.post(`option/${option}/vote`)
  },

  results (poll) {
    return Api.get(`/poll/${poll}/results`)
  },
}
