Page({
	data: {
    good_id: '',
    status: '',
    num: 1,
    good_info: {},
    purchase_history: [],
		is_attention: 0
	},
  attention: function(){
    var that = this;
    var is_attention = this.data.is_attention;
    var store_id = this.data.good_info.store_id;
    getApp().globalData.getData('http://127.0.0.1:8000/wechat/good_detail', {
      store_id: store_id,
      is_attention: is_attention
    }, function (res) {
      that.setData({
        is_attention: is_attention ? 0 : 1
      })
    }, '', 'POST', 'application/x-www-form-urlencoded')
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(1)
    }
    return {
      title: 'hahaha',
      path: '/page/good_details/good_details',
      success: function (res) {
        // 转发成功
        colsole.log(6);
      },
      fail: function (res) {
        // 转发失败
        console.log(4);
      },
      complete: function(){
        console.log(9)
      }
    }
  },
  changeNum: function (e) {
    var num = parseInt(e.detail.value);
    this.setData({
      num: num
    })
  },
  inc: function(){
    var num = parseInt(this.data.num)
    this.setData({
      num: ++num
    })
  },
  dec: function () {
    var num = parseInt(this.data.num)
    if(num > 1){
      this.setData({
        num: --num
      })
    }
  },
  account: function(){
    var good_info = this.data.good_info;
    var num = this.data.num;
    var order_info = [{
      good_id: good_info.good_id,
      good_name: good_info.good_name,
      good_price: good_info.good_price,
      num: num,
      good_type: good_info.good_type,
    }]
    wx.setStorageSync('order_info', order_info)
    wx.navigateTo({
      url: '../confirm_order/confirm_order?store_id='+good_info.store_id
    })
  },
  operating: function (e) {
    var good_id = this.data.good_id;
    var operat_type = e.currentTarget.dataset.type;
    var content_list = ['确定下架吗？', '确定结束吗？'];
    wx.showModal({
      content: content_list[operat_type],
      success: function (res) {
        if (res.confirm) {
          getApp().globalData.getData('http://127.0.0.1:8000/wechat/good_manage', {
            good_id: good_id
          }, function (res) {
            wx.navigateBack({
              delta: 1
            })
          }, '', 'POST', 'application/x-www-form-urlencoded')
        }
      }
    })
  },
  onLoad: function (options){
    var good_id = options.good_id;
    var that = this;
    getApp().globalData.getData('http://127.0.0.1:8000/wechat/good_detail', {
      good_id: good_id
    }, function (res) {
      that.setData({
        good_info: res.data.good_info,
        purchase_history: res.data.purchase_history,
        good_id: good_id,
        status: options.type || '',
        is_attention: res.data.is_attention ? 1 : 0
      })
    })
  }
})
