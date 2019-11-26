Page({
	data: {
		address_id: 0,
    provinceName: '',
    cityName: '',
    countyName: ''
	},
  choose: function(){
    wx.chooseAddress({
      success: function (res) {
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })
  },
	onLoad: function(options){
		console.log(options.id)
	}
})
