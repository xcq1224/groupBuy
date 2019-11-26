Page({
	data: {
    store_id: '',
    QR_flag: true,
    store_info: {}
	},
  getQR_code: function(){
    if(this.data.store_info.QR_code){
      this.setData({
        QR_flag: false
      })
    }else{
      var that = this;
      var store_info = this.data.store_info;
      getApp().globalData.getData('http://127.0.0.1:8000/wechat/store_setting', {
        id: that.data.store_id,
      }, function (res) {
        store_info.QR_code = res.data.path;
        that.setData({
          store_info: store_info,
          QR_flag: false
        })
      }, '', 'POST', 'application/x-www-form-urlencoded')
    }
  },
  hideModal: function(){
    this.setData({
      QR_flag: true
    })
  },
  onLoad: function (options) {
    this.setData({
      store_id: options.store_id
    })
  },
  onShow: function(){
    var that = this;
    getApp().globalData.getData('http://127.0.0.1:8000/wechat/store_setting', {
      id: that.data.store_id
    }, function (res) {
      that.setData({
        store_info: res.data.store_info
      })
    })
  }
})
