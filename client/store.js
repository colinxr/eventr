import { createStore, action } from 'easy-peasy'

export default createStore({
  test: {
    showTest: true,
    setShowTest: action((state, payload) => {
      state.showTest = payload
    })
  },
  user: {
    user: null,
    setUser: action((state, payload) => {
      state.user = payload
    })
  }
})