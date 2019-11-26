//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    userInfo: null,
    test: 'a',
    wx_login: function (func, url, data, success, filePath, method, content_type){
      wx.login({
        success: function (e) {
          var code = e.code;
          wx.getUserInfo({
            success: function (res) {
              wx.setStorage({
                key: 'userInfo',
                data: {
                  nickName: res.userInfo.nickName,
                  avatarUrl: res.userInfo.avatarUrl,
                  gender: res.userInfo.gender
                }
              });
              wx.request({
                url: "http://127.0.0.1:8000/wechat/login",
                data: {
                  code: code,
                  nickName: res.userInfo.nickName,
                  avatarUrl: res.userInfo.avatarUrl,
                  gender: res.userInfo.gender
                },
                success: function (res) {
                  wx.setStorageSync('third_session', res.data.third_session)
                  func(url, data, success, filePath, method, content_type)
                }
              })
            }
          })
        }
      });
    },
    // url：请求地址， filePath：上传图片临时地址， data：post数据，success：成功回调函数
    uploadData: function (url, data, success, filePath, method, content_type) {
      var that = this
      var third_session = wx.getStorageSync('third_session')
      if (third_session) {
        data.third_session = third_session
        wx.uploadFile({
          url: url,
          filePath: filePath,
          name: 'file',
          formData: data,
          success: function (res) {
            var data = JSON.parse(res.data);
            if (data.status == 500) {
              console.log(data);
            } else if (data.status == 200) {
              if (data.is_login) {
                success(data)
              } else {
                console.log('dddddddddddddddd')
                getApp().globalData.wx_login(that.uploadData, url, data, success, filePath, method, content_type)
              }
            }
          },
          fail: function(){
            console.log('uploadfile fail')
          }
        })
      } else {
        getApp().globalData.wx_login(that.uploadData, url, data, success, filePath, method, content_type)
      }
    },
    // url：请求地址， data：请求参数， success：成功回调函数， method： 请求方式， content_type：header请求类型
    getData: function (url, data, success, filePath, method, content_type) {
      var that = this
      var third_session = wx.getStorageSync('third_session')
      if (third_session) {
        data.third_session = third_session
        wx.request({
          url: url,
          data: data,
          method: method || 'GET',
          header: {
            'content-type': content_type || 'application/json'
          },
          success: function (res) {
            if (res.data.status == 500) {
              console.log(res);
            } else if (res.data.status == 200) {
              if (res.data.is_login) {
                success(res)
              } else {
                console.log('dddddddddddddddd')
                getApp().globalData.wx_login(that.getData, url, data, success, filePath, method, content_type)
              }
            }
          }
        })
      } else {
        console.log('fffffffffffffffffff')
        getApp().globalData.wx_login(that.getData, url, data, success, filePath, method, content_type)
      }
    }
  }
})