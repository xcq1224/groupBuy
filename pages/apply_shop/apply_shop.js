Page({
	data: {		
    apply_status: -1,
    store_id: '',
    store_name: '',
    phone: '',
    name: '',
    ID_card_picture: '',  //身份证照片
    flag: true,
	},
	onShow: function (options) {
    if(!this.data.flag) return
    var that = this
    getApp().globalData.getData('http://127.0.0.1:8000/wechat/apply_store', {}, function (res) {
      that.setData({
        apply_status: res.data.is_success ? 0 : ++res.data.store_data.status,
        store_name: res.data.store_data.store_name || '',
        phone: res.data.store_data.phone || '',
        name: res.data.store_data.nick || '',
        store_id: res.data.store_data.store_id || '',
        ID_card_picture: res.data.store_data.ID_picture || '',
      })
    })
	},
  changeInput1: function(e){
    this.setData({
      store_name: e.detail.value
    })
  },
  changeInput2: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  changeInput3: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  chooseImage: function(){
    var that = this
    if (this.data.apply_status == 0){
      this.setData({
        flag: false
      })
      wx.chooseImage({
        count: 1,
        success: function (res) {
          var tempFilePaths = res.tempFilePaths[0]
          console.log(res)
          that.setData({
            ID_card_picture: tempFilePaths,
            flag: true
          })
        },
        fail: function (res) {
        }
      })
    }
  },
  step2: function(){
    var that = this
    var uPattern = /^1[345678]\d{9}$/;
    if (!that.data.store_name) {
      wx.showModal({
        content: '店铺名不能为空！',
        showCancel: false
      })
      return;
    }
    if (!uPattern.test(that.data.phone)) {
      wx.showModal({
        content: '手机号输入错误！',
        showCancel: false
      })
      return;
    }
    if (!that.data.name) {
      wx.showModal({
        content: '姓名不能为空！',
        showCancel: false
      })
      return;
    }
    if (!that.data.ID_card_picture) {
      wx.showModal({
        content: '请上传手持身份证照片！',
        showCancel: false
      })
      return;
    }
    getApp().globalData.uploadData('http://127.0.0.1:8000/wechat/apply_store', {
      'name': that.data.name,
      'phone': that.data.phone,
      'store_name': that.data.store_name
    }, function (data) {
      that.setData({
        apply_status: 1
      })
    }, that.data.ID_card_picture)
  }
})
