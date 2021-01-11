Page(
  {
    data:{
      userAccounts:"",
      userPassword:"",
      loginUrl:"https://api.kxz.atcumt.com/jwxt/login",
    },
    inputAcc:function(e){
      this.setData({userAccounts:e.detail.value})
    },//帐号输入
    inputPass:function(e){
      this.setData({userPassword:e.detail.value})
    },//密码输入
    loginClick:function(){
      var that = this;
      var app = getApp()
      wx.showLoading({
        title: '请稍等...',
      })
      wx.request({
        url: that.data.loginUrl,
        data:{
          "username":that.data.userAccounts,
          "password":that.data.userPassword
        },
        method:"POST",
        success(res){
          console.log(res.data)
          console.log(app.globalData.id)
          if(res.data.code == 0){
          app.globalData.id = that.data.userAccounts
          app.globalData.name = res.data.data.name
          app.globalData.tokenInfo = res.data.data.token
          console.log(app.globalData.id)
          console.log("这是请求成功后的token"+res.data.data.token)
          console.log(res.data.data.name)
          try{
            wx.setStorageSync('id',app.globalData.id)
            wx.setStorageSync('token', res.data.data.token)
            wx.setStorageSync('name', res.data.data.name)
          }catch(e){
            console.log("存储失败")
          }
          wx.switchTab({
           url:"/pages/home/home"
          })
        }
        else{
          wx.showToast({
            title: '学号或密码错误，请检查错误',
            icon:'none'
          })
        }
        }
      })
    },//登录验证
    //验证token
    onLoad:function(){

      }
    }
)