const app = getApp()
Page({
    data:{
      name:""
    },
    getName:function(){
      var app = getApp()
      console.log(app.globalData.name)
      this.setData({name:app.globalData.name})
      console.log(this.data.name)
    },
    goFeedback:function()
    {
      wx.navigateTo({
        url: '/pages/feedback/feedback',
      })
    },//查看反馈信息
    goUsernum:function()
    {
      wx.navigateTo({
        url:'/pages/usernum/usernum'
      })
    },//查看用户总数
    goUserVer:function(){
      wx.navigateTo({
        url: '/pages/userVer/userVer',
      })
    },//查看版本信息
    goNewVer:function(){
      var app = getApp()
      var idNeed = app.globalData.id
      if(idNeed == "08192988"||"08192942")
      {
        wx.navigateTo({
          url: '/pages/newVer/newVer',
        })
      }
      else {wx.showToast({
        title: '您未拥有此权限',
        icon:'none',
        duration:2000
      })
    }
    },//发布新版本
    logout:function(){
      var app = getApp()
      app.globalData.tokenInfo =""
      app.globalData.name = ""
      app.globalData.id = ""
      wx.clearStorage({
        success: (res) => {
          console.log("删除成功")
        },
      })
      wx.redirectTo({
        url: '/pages/login/login',
      })
    },//退出登录，清空本地缓存
    onLoad:function(){
      try{
        app.globalData.tokenInfo = wx.getStorageSync('token')
        app.globalData.name = wx.getStorageSync('name')
        app.globalData.id = wx.getStorageSync('id')
        if(app.globalData.tokenInfo){

          if(app.globalData.tokenInfo!=""&&app.globalData.tokenInfo!=undefined&&app.globalData.tokenInfo!=null){
            console.log(getApp().globalData.tokenInfo)
            wx.switchTab({
              url:"/pages/home/home"
             })
          }
        }}
        catch(e){
          console.log("读取失败")
          console.log(app.globalData.tokenInfo)
        }
      this.getName()
    },
    goDeleUser:function(){
      wx.navigateTo({
        url: '/pages/deleUser/deleUser',
      })
    }//跳转用户删除界面
    
})