Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: false,
    flag1: true,
    attention_list: []
  },
  longtap: function(){
    this.setData({
      flag: true,
      flag1: false
    })
  },
  navigateTo: function(e){
    var flag1 = this.data.flag1;
    if (flag1){
      var store_id = e.currentTarget.dataset.id;
      console.log(store_id);
      wx.navigateTo({
        url: '../store/store?id=' + store_id
      })
    }
  },
  cancel: function(){
    this.setData({
      flag: false,
      flag1: true
    })
  },
  unsubscribe: function(e){
    var that = this;
    var store_id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var attention_list = this.data.attention_list;
    getApp().globalData.getData('http://127.0.0.1:8000/wechat/attention', {store_id: store_id}, function (res) {
      attention_list.splice(index, 1)
      that.setData({
        attention_list: attention_list
      })
    }, '', 'POST', 'application/x-www-form-urlencoded')
  },
  onShow: function(){
    var that = this;
    getApp().globalData.getData('http://127.0.0.1:8000/wechat/attention', {}, function (res) {
      that.setData({
        attention_list: res.data.attention_list
      })
    })
  }
})