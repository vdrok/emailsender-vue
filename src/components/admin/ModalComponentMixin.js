export default {
  props: {
    visible: Boolean
  },
  computed: {
    dVisible: {
      get: function () {
        return this.visible
      },
      set: function (val) {
        if (val) {
          this.onShow()
        } else {
          this.onCancel()
        }          
      }
    }
  },
  methods: {
    onSave: function () {
      this.$emit('save', this.data)
    },
    onCancel: function () {
      this.$emit('cancel')
    },
    onShow () {
      // placeholder to avoid vue warning
    }
  }  
}