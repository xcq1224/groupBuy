Page({
	data: {
		isStore: 0,
    tabIndex: 0,
    totalNum: 0,
    store_id: '',
    good_list: [],
    items: [{
      name: '百香果',
      num: 0
    },{
      name: '牛油果',
      num: 0
    }]
	},
  getTotalNum: function(){
    var totalNum = 0
    for (var index in this.data.items) {
      totalNum += this.data.items[index].num
    }
    this.setData({
      totalNum: totalNum
    })
  },
  chooseTab: function(e){
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
  },
  reduce: function(e){
    var index = e.currentTarget.dataset.index;
    var num = this.data.items[index].num;
    var that = this;
    if(num > 0){
      that.data.items[index].num = --num;
      this.setData({
        items: that.data.items
      })
    }
    this.getTotalNum()
  },
  add: function (e) {
    var index = e.currentTarget.dataset.index;
    var num = parseInt(this.data.items[index].num);
    var that = this;
    if (num < 10) {
      that.data.items[index].num = ++num;
      this.setData({
        items: that.data.items
      })
    }
    this.getTotalNum()
  },
  changeNum: function(e){
    var index = e.currentTarget.dataset.index;
    this.data.items[index].num = parseInt(e.detail.value);
    var that = this;
    this.setData({
      items: that.data.items
    })
    this.getTotalNum()
  },
  // getData: function (url, data, success) {
  //   var that = this
  //   var third_session = wx.getStorageSync('third_session')
  //   if (third_session) {
  //     data.third_session = third_session
  //     wx.request({
  //       url: url,
  //       data: data,
  //       success: function (res) {
  //         console.log(res);
  //         if (res.data.status == 500) {
  //           console.log(res);
  //         } else if (res.data.status == 200) {
  //           if (res.data.is_login) {
  //             success(res)
  //           } else {
  //             console.log('fffffffffffffffffff')
  //             getApp().globalData.wx_login(that.getData, url, data, success)
  //           }
  //         }
  //       }
  //     })
  //   } else {
  //     getApp().globalData.wx_login(that.getData, url, data, success)
  //   }
  // },
  onLoad: function(options){
    this.setData({
      store_id: options.id
    })
  },
  onShow: function(){
    var that = this;
    getApp().globalData.getData('http://127.0.0.1:8000/wechat/store', {
      id: that.data.store_id,
    }, function(res){
      that.setData({
        isStore: res.data.is_store,
        good_list: res.data.good_list
      })
    })
  }
})
