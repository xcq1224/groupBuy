Page({
	data: {
		orderStatus: 0,
    mentionStatus: 0,
    goodType: 0,
    isShow: 0,
    order_list: [],
    show_list: [],
	},
  showChoose: function(e){
    this.setData({
      isShow: e.currentTarget.dataset.index
    })
  },
  hideChoose: function (e) {
    this.setData({
      isShow: 0
    })
  },
  chooseStatus: function(e){
    this.setData({
      orderStatus: e.currentTarget.dataset.index,
      isShow: 0
    })
    this.filterGood()
  },
  mentionStatus: function (e) {
    this.setData({
      mentionStatus: e.currentTarget.dataset.index,
      isShow: 0
    })
    this.filterGood()
  },
  goodType: function (e) {
    this.setData({
      goodType: e.currentTarget.dataset.index,
      isShow: 0
    })
    this.filterGood()
  },
  confirm_receipt: function(){
    wx.showModal({
      title: '确认已收到货？',
      success: function(res){
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  filterGood: function () {
    var orderStatus = this.data.orderStatus,
        mentionStatus = this.data.mentionStatus,
        goodType = this.data.goodType,
        order_list = this.data.order_list,
        show_list = [];
    for (var index in order_list) {
      var flag1 = false;
      switch (orderStatus) {
        case '1':
          if (order_list[index].order_status != '0') {
            flag1 = true
          }
          break;
        case '2':
          if (order_list[index].order_status != '1') {
            flag1 = true
          }
          break;
        case '3':
          if (order_list[index].order_status != '2') {
            flag1 = true
          }
          break;
        case '4':
          if (order_list[index].order_status != '3') {
            flag1 = true
          }
          break;
        case '5':
          if (order_list[index].order_status != '4') {
            flag1 = true
          }
          break;
      }
      if (flag1) continue;
      var flag2 = false;
      switch (mentionStatus) {
        case '1':
          if (order_list[index].delivery_methods != '1') {
            flag2 = true
          }
          break;
        case '2':
          if (order_list[index].delivery_methods != '0') {
            flag2 = true
          }
          break;
      }
      if (flag2) continue;
      var flag3 = false;
      switch (goodType) {
        case '1':
          if (order_list[index].good_type != '1') {
            flag3 = true
          }
          break;
        case '2':
          if (order_list[index].good_type != '0') {
            flag3 = true
          }
          break;
      }
      if (flag3) continue;
      show_list.push(order_list[index])
    }
    this.setData({
      show_list: show_list
    })
  },
  onLoad: function(options){
    var that = this;
    getApp().globalData.getData('http://127.0.0.1:8000/wechat/order_list', {}, function (res) {
      that.setData({
        order_list: res.data.order_list,
        orderStatus: options.status || 0
      })
      that.filterGood()
    })
  }
})
