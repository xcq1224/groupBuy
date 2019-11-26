var dateTimePicker = require('../../utils/dateTimePicker.js');

Page({
  data: {
    storeId: '',
    good_id: '',
    status: 0,
    goodImgs: [],
    goodInfo: {},
    addressList: [],
    dateTimeArray: null,
    dateTime: null,
    switch1: false,
    switch2: false,
    switch3: true,
    startYear: 2018,
    endYear: 2050,
    current: 0,
  },
  onLoad(options) {
    var that = this;
    if (options.good_id){
      var success = function(res){
        // 获取完整的年月日 时分秒，以及默认显示的数组
        var obj = dateTimePicker.dateTimePicker(that.data.startYear, that.data.endYear, res.data.good_info.deadline_time);
        // 精确到分的处理，将数组的秒去掉
        var lastArray = obj.dateTimeArray.pop();
        var lastTime = obj.dateTime.pop();
        that.setData({
          goodInfo: res.data.good_info,
          status: options.type || 0,
          goodImgs: res.data.picture_list,
          addressList: res.data.address_list,
          switch1: res.data.good_info.good_type == 1,
          switch2: res.data.good_info.is_mention,
          switch3: res.data.good_info.is_delivery,
          dateTime: obj.dateTime,
          dateTimeArray: obj.dateTimeArray,
          storeId: options.store_id || '',
          good_id: options.good_id || '',
        })
      }
      console.log(options.good_id)
      getApp().globalData.getData('http://127.0.0.1:8000/wechat/publish_product', {
        good_id: options.good_id
      }, success)
    }else{
      // 获取完整的年月日 时分秒，以及默认显示的数组
      var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
      // 精确到分的处理，将数组的秒去掉
      var lastArray = obj.dateTimeArray.pop();
      var lastTime = obj.dateTime.pop();
      this.setData({
        dateTime: obj.dateTime,
        dateTimeArray: obj.dateTimeArray,
        storeId: options.store_id || '',
        good_id: options.good_id || '',
      });
    }
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
  groupAddress: function () {
    var goodInfo = this.data.goodInfo;
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        goodInfo['address'] = res.address;
        goodInfo['address_name'] = res.name;
        goodInfo['latitude'] = res.latitude;
        goodInfo['longitude'] = res.longitude;
        that.setData({
          goodInfo: goodInfo,
        })
      }
    })
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
  changeSwiper: function (e) {
    this.setData({
      current: e.currentTarget.dataset.index,
    })
  },
  addAddress: function () {
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
  changeAddress: function (e) {
    var addressList = this.data.addressList;
    var index = e.currentTarget.dataset.index;
    addressList[index].checked = !addressList[index].checked
    this.setData({
      addressList: addressList
    })
  },
  submit: function (e) {
    var goodInfo = this.data.goodInfo;  // 商品信息
    var goodImgs = this.data.goodImgs.slice(0);  // 本地图片
    var store_id = this.data.storeId;   // 商店id
    var img_list = [];  // 上传成功的图片
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
    if (!goodInfo['restriction']) {
      goodInfo['restriction'] = 0
    }
    if (this.data.switch2) {
      if (!this.data.addressList.length) {
        wx.showModal({
          content: '请添加线下自提点！',
        })
        return;
      }
    }
    var dateTimeArray = this.data.dateTimeArray;
    var dateTime = this.data.dateTime;
    if (this.data.switch1) {
      var deadline_time = dateTimeArray[0][dateTime[0]] + '-' + dateTimeArray[1][dateTime[1]] + '-' + dateTimeArray[2][dateTime[2]] + ' ' + dateTimeArray[3][dateTime[3]] + ':' + dateTimeArray[4][dateTime[4]];
      goodInfo['deadline_time'] = deadline_time;
    }
    if (this.data.switch1) {
      if (!this.data.goodInfo.address_name) {
        wx.showModal({
          content: '请填写团购地址！',
        })
        return;
      }
    }
    goodInfo['good_price'] = goodInfo['good_price'] * 100
    goodInfo['is_mention'] = this.data.switch2;
    goodInfo['is_delivery'] = this.data.switch3;
    goodInfo['is_publish'] = e.currentTarget.dataset.publish;
    var data = {
      'third_session': getApp().globalData.third_session,
      'goodInfo': JSON.stringify(goodInfo),
      'addressList': JSON.stringify(this.data.addressList),
      'storeId': store_id,
      'action': 'add_good'
    };
    var uploadImg = function (tempFilePaths){
      if (tempFilePaths.length){
        var path = tempFilePaths.shift();
        if(path.indexOf('tmp') != -1){
          getApp().globalData.uploadData('http://127.0.0.1:8000/wechat/publish_product', { 'action': 'upload', 'store_id': store_id }, function (data) {
            img_list.push(data.path);
            uploadImg(tempFilePaths)
          }, path)
          // wx.uploadFile({
          //   url: 'http://127.0.0.1:8000/wechat/publish_product',
          //   filePath: path,
          //   name: 'file',
          //   formData: { 'action': 'upload', 'store_id': store_id },
          //   success: function (res) {
          //     img_list.push(JSON.parse(res.data).path);
          //     uploadImg(tempFilePaths)
          //   },
          //   fail: function () {
          //     wx.showModal({
          //       content: '网络异常，请稍后再试！',
          //     })
          //   }
          // })
        }else{
          img_list.push(path);
          uploadImg(tempFilePaths)
        }
      }else{
        data['img_list'] = JSON.stringify(img_list);
        getApp().globalData.getData('http://127.0.0.1:8000/wechat/publish_product', data, function (res) {
          wx.navigateBack({
            delta: 1
          })
        }, '', 'POST', 'application/x-www-form-urlencoded')
      }
    };
    uploadImg(goodImgs);
  }
})