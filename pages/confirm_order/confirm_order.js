Page({
	data: {
    store_id: '',
    totalAmount: 0,
    delivery_methods: 0,
    address_info: '',
    array: ['快递发货', '线下自提'],
    good_list: [],
    mention_list: [],
    address_list: []
	},
  bindPickerChange: function (e) {
    console.log(e.detail.value);
    var address_info = this.data.address_info;
    var delivery_methods = this.data.delivery_methods;
    this.setData({
      delivery_methods: parseInt(e.detail.value),
      address_info: delivery_methods == e.detail.value ? address_info : ''
    })
  },
  chooseReceiptAddress: function(){
    var that = this;
    var address_info;
    wx.chooseAddress({
      success: function (res) {
        address_info = {
          contacts: res.userName,
          phone: res.telNumber,
          address: res.detailInfo,
        };
        that.setData({
          address_info: address_info
        })
      }
    })
  },
  choosePickAddress: function(e){
    var mention_list = this.data.mention_list;
    var index = e.detail.value;
    this.setData({
      address_info: mention_list[index]
    })
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
  total: function(){
    var good_list = this.data.good_list;
    var totalAmount = 0;
    for(var i in good_list){
      totalAmount += good_list[i].good_price * good_list[i].num;
    }
    this.setData({
      totalAmount: totalAmount
    })
  },
  inc: function (e) {
    var index = e.currentTarget.dataset.index;
    var good_list = this.data.good_list;
    good_list[index].num++;
    this.setData({
      good_list: good_list
    })
    this.total()
  },
  changeNum: function (e) {
    var index = e.currentTarget.dataset.index;
    var good_list = this.data.good_list;
    good_list[index].num = parseInt(e.detail.value);
    this.setData({
      good_list: good_list
    })
    this.total()
  },
  dec: function (e) {
    var index = e.currentTarget.dataset.index;
    var good_list = this.data.good_list;
    if (good_list[index].num > 1){
      good_list[index].num--;
      this.setData({
        good_list: good_list
      })
      this.total()
    }
  },
  back: function(){
    wx.navigateBack({
      delta: 1
    })
  },
  pay: function(){
    var address_info = this.data.address_info;
    if(!address_info){
      wx.showModal({
        content: '请选择收货/取货地址！',
      })
      return;
    }
    var data = {
      store_id: this.data.store_id,
      delivery_methods: this.data.delivery_methods,
      totalAmount: this.data.totalAmount * 100,
      address_info: JSON.stringify(this.data.address_info),
      good_list: JSON.stringify(this.data.good_list)
    }
    getApp().globalData.getData('http://127.0.0.1:8000/wechat/confirm_order', data, function (res) {
      console.log(res)
    }, '', 'POST', 'application/x-www-form-urlencoded')
  },
  onLoad: function(options){
    var store_id = options.store_id
    var good_list = wx.getStorageSync('order_info');
    var that = this;
    this.setData({
      good_list: good_list,
      store_id: store_id
    })
    this.total()
    getApp().globalData.getData('http://127.0.0.1:8000/wechat/confirm_order', {good_id:good_list[0].good_id}, function (res) {
      that.setData({
        mention_list: res.data.mention_list,
        address_list: res.data.address_list
      })
    })
  }
})
