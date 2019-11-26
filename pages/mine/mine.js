Page({
	data: {
    nickName: '',
    avatarUrl: '',
    payment_num: 0,
    ship_num: 0,
    receipt_num: 0,
    storeList: [],
	},
  // 首先获取third_session， 没有就直接调用登录并回调当前函数获取数据，有就判断缓存是否过期，过期了就重新登录并回调获取数据。
  onShow: function(){
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
        });
      }
    });
    getApp().globalData.getData('http://127.0.0.1:8000/wechat/my_info', {}, function (res) {
      that.setData({
        payment_num: res.data.payment_num,
        ship_num: res.data.ship_num,
        receipt_num: res.data.receipt_num,
        storeList: res.data.store_list,
      })
    })
  },
  chooseAddress: function () {
    wx.chooseAddress({
      success: function (res) {
        console.log(res)
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })
  }
})
