Page({
  data: {
    store_id: '',
    store_info: {},
    flag: true,
  },
  bindKeyInput: function (e) {
    var store_info = this.data.store_info;
    store_info[e.currentTarget.dataset.name] = e.detail.value.trim();
    this.setData({
      store_info: store_info
    })
  },
  chooseImage: function () {
    var that = this;
    var store_info = this.data.store_info;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        store_info['logo'] = res.tempFilePaths[0]
        store_info['change_logo'] = 1
        that.setData({
          store_info: store_info,
        })
      }
    })
  },
  submit: function(){
    var store_info = this.data.store_info;
    if(!store_info.store_name){
      wx.showModal({
        content: '店铺名称不能为空',
      })
    }
    if(store_info.change_logo){
      getApp().globalData.uploadData('http://127.0.0.1:8000/wechat/edit_store', store_info, function (data) {
        wx.navigateBack({
          delta: 1
        })
      }, store_info.logo)
    }else{
      getApp().globalData.getData('http://127.0.0.1:8000/wechat/edit_store', store_info, function (res) {
        wx.navigateBack({
          delta: 1
        })
      },'', 'POST', 'application/x-www-form-urlencoded')
    }
  },
  chooseAddress: function(){
    var store_info = this.data.store_info;
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        store_info['address'] = res.address;
        store_info['address_name'] = res.name;
        store_info['latitude'] = res.latitude;
        store_info['longitude'] = res.longitude;
        that.setData({
          store_info: store_info,
        })
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      store_id: options.store_id
    })
  },
  onShow: function () {
    var that = this;
    if (!this.data.flag) return
    getApp().globalData.getData('http://127.0.0.1:8000/wechat/edit_store', {
      id: that.data.store_id
    }, function (res) {
      that.setData({
        store_info: res.data.store_info,
        flag: false
      })
    })
  }
})
