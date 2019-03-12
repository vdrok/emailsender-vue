export default {
  methods: {
    userName (owner_id) {
      if (!this.$store.state.user.getByIdHashMap[owner_id]) {
        this.$store.dispatch('user/getById', { userID: owner_id }, { root: true })
      }

      let owner = this.$store.state.user.getByIdHashMap[owner_id] && this.$store.state.user.getByIdHashMap[owner_id].email
      return (owner===this.$store.state.user.userInfo.email) ? 'you' : owner
    }
  }
}
