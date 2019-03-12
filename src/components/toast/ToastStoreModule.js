export const toasts = {
  namespaced: true,
  state: {
    id: 1,
    maxToasts: 5,
    timeBeforeClose: 15000, // 15 sec
  
    toasts: []
  },
  // internal parameters
  // Mutations
  mutations: {
    add (state, toast) {
      let self = this

      toast.id = state.id++

      if (state.timeBeforeClose > 0) {
        toast.timer = setTimeout(function (id) {
          self.commit('toasts/close', id)
        }, state.timeBeforeClose, toast.id)
      }

      state.toasts.push(toast)

      if (state.toasts.length > state.maxToasts) {
        state.toasts.shift()
      }
    },
    close (state, id) {
      state.toasts = state.toasts.filter(x => (x.id !== id))
    }
  }  
}