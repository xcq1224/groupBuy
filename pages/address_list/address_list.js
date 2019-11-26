Page({
	data: {
		address_id: 0
	},
	choose_address: function(e){
		this.setData({
			address_id: e.currentTarget.dataset.id
		})
	}
})
