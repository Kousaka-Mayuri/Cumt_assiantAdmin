Page({
  data:{
    id:"",
  },
  inputId:function(e){
    this.setData({id:e.detail.value})
  },//输入ID
  confirm:function(){
    var that = this
    wx.showModal({
      title:"警告",
      content:"请确认是否要删除该用户",
      success(res){
        if(res.confirm){
          that.delePush()
        }
        else if(res.cancel)
        {
          
        }
      }
    })
  },//删除确认
  delePush:function(){
    wx.request({
      url: 'https://www.lvyingzhao.cn/user/'+this.data.id,
      method:"DELETE",
      data:{
        "id":this.data.id
      },
      success(res){
        wx.showToast({
          title: '删除成功',
          icon:"success",
          duration:2000
        })
      },
      fail(res){
        wx.showToast({
          title: '删除失败',
          icon:"none",
          duration:2000
        })
      }
    })
  }
})