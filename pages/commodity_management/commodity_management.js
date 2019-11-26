Page({
	data: {
		goodType: 0,
    priceInterval: 0,
    stockStatus: 0,
    isShow: 0,
    store_id: '',
    good_list: [],
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
  goodType: function(e){
    this.setData({
      goodType: e.currentTarget.dataset.index,
      isShow: 0
    })
    this.filterGood();
  },
  priceInterval: function (e) {
    this.setData({
      priceInterval: e.currentTarget.dataset.index,
      isShow: 0
    })
    this.filterGood();
  },
  stockStatus: function (e) {
    var status = e.currentTarget.dataset.index;
    var good_list = this.data.good_list;
    var show_list = [];
    var status_list = [0, 20, 100, 200];
    this.setData({
      stockStatus: status,
      isShow: 0
    })
    this.filterGood();
  },
  filterGood: function(){
    var goodType = this.data.goodType,
        priceInterval = this.data.priceInterval,
        stockStatus = this.data.stockStatus,
        good_list = this.data.good_list,
        show_list = [];
    for(var index in good_list){
      var flag1 = false;
      switch (goodType) {
        case '1':   
          if(good_list[index].good_type){
            flag1 = true
          }
          break;
        case '2':
          if (!good_list[index].good_type) {
            flag1 = true
          }
          break;
        case '3':
          if (!good_list[index].is_deadline & good_list[index].is_publish) {
            flag1 = true
          }
          console.log()
          break;
      }
      if(flag1) continue;
      var flag2 = false;
      switch (priceInterval) {
        case '1':
          if (good_list[index].good_price > 50) {
            flag2 = true
          }
          break;
        case '2':
          if (good_list[index].good_price <= 50 || good_list[index].good_price > 100) {
            flag2 = true
          }
          break;
        case '3':
          if (good_list[index].good_price <= 100 || good_list[index].good_price > 300) {
            flag2 = true
          }
          break;
        case '4':
          if (good_list[index].good_price <= 300) {
            flag2 = true
          }
          break;
      }
      if (flag2) continue;
      var flag3 = false;
      switch (stockStatus) {
        case '1':
          if (good_list[index].stock > 20) {
            flag3 = true
          }
          break;
        case '2':
          if (good_list[index].stock <= 20 || good_list[index].stock > 100) {
            flag3 = true
          }
          break;
        case '3':
          if (good_list[index].stock <= 100 || good_list[index].stock > 200) {
            flag3 = true
          }
          break;
        case '4':
          if (good_list[index].stock <= 200) {
            flag3 = true
          }
          break;
      }
      if (flag3) continue;
      show_list.push(good_list[index])
    }
    this.setData({
      show_list: show_list
    })
  },  
  operating: function(e){
    var good_id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var operat_type = e.currentTarget.dataset.type;
    var content_list = ['确定下架吗？', '确定结束吗？', '确定上架吗？'];
    var good_list = this.data.good_list;
    var that = this;
    wx.showModal({
      content: content_list[operat_type],
      success: function(res){
        if (res.confirm) {
          if (operat_type == 2) {
            wx.navigateTo({
              url: '../publish_product/publish_product?store_id=' + that.data.store_id + '&good_id=' + good_id + '&type=2'
            })
          } else {
            getApp().globalData.getData('http://127.0.0.1:8000/wechat/good_manage', {
              good_id: good_id
            }, function () {
              good_list[index].is_publish = false;
              good_list[index].type = 2;
              that.setData({
                good_list: good_list
              })
              that.filterGood();
            }, '', 'POST', 'application/x-www-form-urlencoded')
          }
        }
      }
    })
  },
  onLoad: function(options){
    this.setData({
      store_id: options.store_id
    })
  },
  onShow: function(){
    var that = this
    getApp().globalData.getData('http://127.0.0.1:8000/wechat/good_manage', {
      store_id: that.data.store_id
    }, function (res) {
      that.setData({
        good_list: res.data.good_list,
        show_list: res.data.good_list
      })
    })
  }
})
