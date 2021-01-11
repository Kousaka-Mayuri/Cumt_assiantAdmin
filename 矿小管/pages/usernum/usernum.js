Page({
  data:{
    page:"1",
    per_page:"15",
    userList:[],//用户信息
    chuserList:[],
    userAll:"",//用户总数
    pageAll:"",//总页数
    isLastPage:false
  },
  judgeNum:function(){
    if(this.data.page == this.data.pageAll)
    this.setData({isLastPage:true})
    else this.setData({isLastPage:false})
  },//判断是否是最后一页
  checkPer:function(that,per){
    that = this
    for(var i = 0;i<per;i++)
        {
          switch(that.data.userList[i].permission)
          {
            case 1:that.changeObjList(that.data.userList[i],"黑名单");break;
            case 2:that.changeObjList(that.data.userList[i],"普通用户");break;
            case 4:that.changeObjList(that.data.userList[i],"白嫖用户");break;
            case 8:that.changeObjList(that.data.userList[i],"付费用户");break;
            case 16:that.changeObjList(that.data.userList[i],"第三方用户");break;
            case 32:that.changeObjList(that.data.userList[i],"老师");break;
            case 64:that.changeObjList(that.data.userList[i],"管理员");break;
            case 128:that.changeObjList(that.data.userList[i],"root");break;
          }
        }
        that.setData({
          chuserList:that.data.userList
        })
  },//用户权限实名化
  changeObjList:function(arr,str){
    var arr2 ={
      username:arr.username,
      permission:arr.permission,
      perName:str
    }
    arr.perName = str;
    return 0;
  },
  countpage:function(){
    var str = getApp().countPage(this.data.userAll,this.data.per_page)
    this.setData({pageAll:str})
  },//计算总页数
  getUserInfo:function(){
    var that = this
    var app = getApp()
    wx.request({
      url: 'https://api.kxz.atcumt.com/admin/page_amount?page='+this.data.page+'&perPage='+this.data.per_page,
      header:{
        "token":app.globalData.tokenInfo
      },
      data:{
        "page":this.data.page,
        "per_page":this.data.per_page,
      },
      method:"GET",
      success(res){
        that.setData({
          userList:res.data.data,
          userAll:res.data.num,
        });
        that.countpage()
        that.judgeNum()
        var temNum = parseInt(that.data.userAll)%parseInt(that.data.per_page)
        if(that.data.isLastPage == false)
        that.checkPer(that,parseInt(that.data.per_page))
        else that.checkPer(that,temNum)
      }
    })
  },//请求用户数据
  minsPage:function(){
    var num = parseInt(this.data.page)-1
    if(num<=0)
    {
      wx.showToast({
        title: '这是第一页',
        icon:"none"
      })}
    else{
    var str = String(num)
    this.setData({page:str})
    this.getUserInfo()}
  },//上一页
  plusPage:function(){
    var num = parseInt(this.data.page)+1
    var str = String(num)
    var temNum = this.data.pageAll
    if(num>temNum){wx.showToast({
      title: '已到最后一页',
      icon:"none"
    })}
    else{
      this.setData({page:str})
      this.getUserInfo()
  }},//下一页
  jumppage:function(e){
    var str
    str = getApp().jumpPage(e)
    console.log(str)
    this.setData({page:str})
    this.getUserInfo()
  },//跳转页面
  onLoad:function(){
   
  },
  onReady:function(){
    this.getUserInfo()
  }
})