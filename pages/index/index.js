//index.js

const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {
      index: 0,
      msg: 'this is a template',
      time: '2016-09-15'
    },
    store_list: [],
    good_list: [],
    chooseStore: [],
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    tabIndex: 0,
    inputShowed: false,
    inputVal: "",
    swiper_array: [
      'http://img5.imgtn.bdimg.com/it/u=2945501816,1175753751&fm=27&gp=0.jpg', 'http://img4.imgtn.bdimg.com/it/u=1055786243,1090274561&fm=27&gp=0.jpg', 'http://img2.99114.com/group1/M00/00/3E/wKgGS1c0RQKAT1BDAAKTvrjsuRc504.jpg', 'http://img.jituwang.com/uploads/allimg/160303/257929-1603030R93948.jpg'
    ],
    good_data: []
  },

  /**
   * 输入框操作
   */
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },  
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    var value = e.detail.value
    var value_copy = value.toLowerCase()
    var store_list = this.data.store_list
    var chooseStore = []
    for (var index in store_list){
      if (store_list[index].store_logogram.indexOf(value_copy) != -1 || store_list[index].store_name.indexOf(value_copy) != -1){
        chooseStore.push({
          name: store_list[index].store_name,
          id: store_list[index].id
        })
      }
    }
    this.setData({
      inputVal: value,
      chooseStore: chooseStore
    });
  },
  switchTab: function (e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  getDistance: function(lat1, lng1, lat2, lng2) {
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    return s
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.getLocation({
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.request({
          url: 'http://127.0.0.1:8000/wechat/index',
          data: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            that.setData({
              store_list: res.data.store_list,
              good_list: res.data.good_list
            })
          },
          fail: function () {
            console.log('fail');
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})