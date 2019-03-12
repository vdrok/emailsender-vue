import * as util from '../../helpers/util.js'
import tst from './../toast/Toasts.js'

export default {
  data () {
    return {
      svc: null,
      offset: 0,
      limit: 0,
      total: 0,
      data: [],
      modalVisible: false,
      modalData: {},
      modalOp: '',
      modalIdx: -1
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      this.svc.enum(99999, 0)
        .then((data) => {
          this.limit = data.Limit
          this.offset = data.Offset
          this.total = data.Total
          this.data = this.extractData(data) === null ? [] : this.extractData(data)
        },
        error => {
          this.inRequest = false
          tst.error(error)
        })
    },
    addItem () {
      this.modalData = this.getNewItem()
      this.modalIdx = -1
      this.modalOp = 'Create'
      this.modalVisible = true
    },
    editItem (item) {
      let idx = this.data.indexOf(item.item)

      // to avoid inline edit we clone object
      this.modalData = util.cloneObject(this.data[idx])
      this.modalOp = 'Edit'
      this.modalIdx = idx
      this.modalVisible = true      
    },
    deleteItem (item) {
      let idx = this.data.indexOf(item.item)

      this.svc.delete(this.data[idx].id)        
        .then(data => {
          // and on success remove from servers list
          this.data.splice(idx, 1)            
        },
        error => {
          tst.error(error)
        })
    },
    saveItem (item) {
      this.modalVisible = false
      
      if (this.modalIdx >= 0) {
        // existing edit
        this.svc.update(item.id, item) 
          .then(reply => {
            this.$set(this.data, this.modalIdx, item)
          },
          error => {
            tst.error(error)
          })
      } else {
        // add new        
        this.svc.create(item)
          .then(reply => {
            // set id for webmail
            //item.id = reply.id
            this.data.push(reply)
          },
          error => {
            tst.error(error)
          })
      }

    }
  }
}