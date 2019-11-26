var dateTimePicker = require('../../utils/dateTimePicker.js');

Page({
  data: {
    goodImgs: [],
    goodInfo: {},
    addressList: [],
    storeAddress: [],
    dateTimeArray: null,
    dateTime: null,
    switch1: '',
    switch2: '',
    switch3: '',
    startYear: 2018,
    endYear: 2050,
    current: 0,
  },
  onLoad() {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);

    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj.dateTimeArray.pop();
    var lastTime = obj.dateTime.pop();
    console.log(1);
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
    });
  },
  bindKeyInput: function (e) {
    var goodInfo = this.data.goodInfo;
    goodInfo[e.currentTarget.dataset.name] = e.detail.value.trim();
    this.setData({
      goodInfo: goodInfo
    })
  },
  chooseImgs: function () {
    var that = this
    wx.chooseImage({
      count: 9,
      success: function (res) {
        var tempFilePaths = that.data.goodImgs.concat(res.tempFilePaths)
        if (tempFilePaths.length > 9) {
          wx.showModal({
            title: '提示',
            content: '最多上传9张商品图片！',
          })
        }
        that.setData({
          goodImgs: tempFilePaths.slice(0, 9),
        })
      }
    })
  },
  delImg: function (e) {
    var index = e.currentTarget.dataset.index;
    var goodImgs = this.data.goodImgs;
    goodImgs.splice(index, 1);
    this.setData({
      goodImgs: goodImgs
    })
  },
  changeDateTime(e) {
    this.setData({ dateTime: e.detail.value });
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },
  switch1Change: function (e) {
    this.setData({
      switch1: e.detail.value
    })
  },
  switch2Change: function (e) {
    this.setData({
      switch2: e.detail.value
    })
  },
  switch3Change: function (e) {
    this.setData({
      switch3: e.detail.value
    })
  },
  changeSwiper: function(e){
    this.setData({
      current: e.currentTarget.dataset.index,
    })
  },
  addAddress: function(){
    var that = this;
    var addressList = this.data.addressList;
    wx.chooseAddress({
      success: function (res) {
        addressList.push({
          contacts: res.userName,
          phone: res.telNumber,
          address: res.provinceName + res.cityName + res.countyName + res.detailInfo,
          checked: true,
        })
        that.setData({
          addressList: addressList
        })
      }
    })
  },
  changeAddress: function(e){
    var addressList = this.data.addressList;
    var index = e.currentTarget.dataset.index;
    addressList[index].checked = !addressList[index].checked
    this.setData({
      addressList: addressList
    })
  },
  chooseAddress: function(){
    this.setData({
      current: 2,
    })
  },
  submit: function () {
    var goodInfo = this.data.goodInfo;
    var goodImgs = this.data.goodImgs;
    if (!goodInfo['good_name']) {
      wx.showModal({
        content: '请填写商品名称！',
      })
      return;
    }
    if (!goodInfo['good_desc']) {
      wx.showModal({
        content: '请填写商品介绍！',
      })
      return;
    }
    if (!goodImgs.length) {
      wx.showModal({
        content: '请上传商品图片',
      })
      return;
    }
    if (!goodInfo['good_spec']) {
      wx.showModal({
        content: '请填写商品规格！',
      })
      return;
    }
    if (!goodInfo['good_price']) {
      wx.showModal({
        content: '请填写商品价格！',
      })
      return;
    }
    if (!goodInfo['stock']) {
      wx.showModal({
        content: '请填写商品库存！',
      })
      return;
    }
    if(this.data.switch2){
      if (!this.data.addressList.length){
        wx.showModal({
          content: '请添加线下自提点！',
        })
      }
    }
    var dateTimeArray = this.data.dateTimeArray;
    var dateTime = this.data.dateTime;
    if(this.data.switch1){
      var datetime = dateTimeArray[0][dateTime[0]] + '-' + dateTimeArray[1][dateTime[1]] + '-' + dateTimeArray[2][dateTime[2]] + ' ' + dateTimeArray[3][dateTime[3]] + ':' + dateTimeArray[4][dateTime[4]];
      goodInfo['datatime'] = datetime;
    }
    var data = {
      goodInfo: goodInfo,
      goodImgs: goodImgs,
      addressList: this.data.addressList
    }
    console.log(data);
  }
})