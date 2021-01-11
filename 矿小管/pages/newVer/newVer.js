Page({
  data:{
    version:"",
    url:"",
    description:"",
    isForceUpgrade:"False",
    isClicked:false
  },
  inputVersion:function(e){
    this.setData({version:e.detail.value})
    console.log(this.data.version)
  },
  inputUrl:function(e){
    this.setData({url:e.detail.value})
    console.log(this.data.url)
  },
  inputDes:function(e){
    this.setData({description:e.detail.value})
    console.log(this.data.description)
  },
  changeUp:function(e){
    var bool = this.data.isClicked
    bool = !bool
    this.setData({isClicked:bool});
    if(bool){
      console.log("true")
      this.setData({isForceUpgrade:"True"})
      console.log(this.data.isForceUpgrade)
    }
    else{
      console.log("false")
      this.setData({isForceUpgrade:"False"})
      console.log(this.data.isForceUpgrade)
    }
  },
  pushNewVer:function(){
    var app = getApp();
    var that = this;
    wx.request({
      url: 'https://api.kxz.atcumt.com/admin/version',
      header:{
        "token":app.globalData.tokenInfo
      },
      data:{
        "version":that.data.version,
        "url":that.data.url,
        "description":that.data.description,
        "isForceUpgrade":that.data.isForceUpgrade
      },
      method:"POST",
      success:function(res){
        console.log(res.data)
        wx.showToast({
          title: '推送成功',
          icon:'success',
          duration:2000
        })
      },
      fail:function(res){
        console.log(res.data)
        wx.showToast({
          title: '推送失败，请查询是否有误',
          icon:'none',
          duration:2000
        })
      }
    })
  },
  confirm:function(){
    var that = this;
    wx.showModal({
      title:"警告",
      content:"确定要推送吗？",
      success(res){
        if(res.confirm){
          that.pushNewVer()
        }else if(res.cancel){
          console.log(that.data.version)
          console.log(that.data.url)
          console.log(that.data.description)
          console.log(that.data.isForceUpgrade)
        }
      }
    })
  }
})

