Page({
  data:{
    feedback:[],
    deleId:0,
    id:null,
    page:"1",//当前页数
    per_page:"5",
    deleArr:{},
    viewBg:'#ffffff',
    numAll:"",//反馈总数
    pageAll:"",//总页数
  },
  minsPage:function(){
    var num = parseInt(this.data.page)-1
    if(num<=0)
    {
      wx.showToast({
        title: '这是第一页',
        icon:"none"
      })
    }
    else{
    var str = String(num)
    this.setData({page:str})
    console.log(this.data.page)
    this.pushPage()
    var temDele ={}
    this.setData({deleArr:temDele})
  }
  },//上一页
  plusPage:function(){
    var num = parseInt(this.data.page)+1
    var str = String(num)
    var temNum = parseInt(this.data.pageNum)/parseInt(this.data.per_page)
    if(parseInt(this.data.pageNum)%parseInt(this.data.per_page)!=0){
      temNum++
    }
    if(num>temNum){wx.showToast({
      title: '已到最后一页',
      icon:"none"
    })}
    else{
      this.setData({page:str})
    console.log(this.data.page)
    this.pushPage()
    var temDele ={}
    this.setData({deleArr:temDele})
  }
  },//下一页
  itemSelected:function(e){
    var index = e.currentTarget.dataset.index;
    var item = this.data.feedback[index];
    console.log(item.id)
    item.isSelected = !item.isSelected;
    if(item.isSelected==true)
    {
      this.data.viewBg = '#000000'
      this.data.deleArr[index] = item.id
      for(var a in this.data.deleArr){
        console.log(a + " " + this.data.deleArr[a])
      }
    }else
    {
      this.data.viewBg = '#fffffff'
      delete this.data.deleArr[index];
    }
    this.setData({
      feedback:this.data.feedback
    })
  },//多选框选取
  pushPage:function(){
    var that = this
    var app = getApp()
    wx.request({
      url: 'https://api.kxz.atcumt.com/admin/page_feedback?page='+that.data.page+"&perPage="+that.data.per_page,//https://api.kxz.atcumt/admin/page_feedback?page=2&perPage=3
      header:{"token":app.globalData.tokenInfo},
      data:{
        "page":that.data.page,
        "per_page":that.data.per_page,
        "numAll":that.data.num
      },
      method:"GET",
      success(res){
        console.log(res.data)
        that.setData({
          feedback:res.data.data,
          numAll:res.data.num,
        })
        that.countpage()
      },
      fail(res){
        console.log(res.data)
      }
    })
  },//获取分页信息
  deleData:function()
  {
    var that = this
    var app = getApp()
    var deleSave =[]
    for(var sKey in this.data.deleArr){
      deleSave.push(this.data.deleArr[sKey])
    }
    for(var i = 0;i<deleSave.length;i++){
      wx.request({
      url: "https://api.kxz.atcumt.com/admin/feedback/"+deleSave[i],
      header:{
        "token":app.globalData.tokenInfo
      },
      data:{
        "id":deleSave[i]
      },
      method:"DELETE",
      success(res){
        if(res.statusCode==204){
        wx.showToast({
          title: '删除成功',
          icon:"success"
        })
        console.log("删除成功")
        console.log(res.data+"status:"+res.statusCode)
        that.setData({id:null})
        that.onLoad()
      }
      else{
        console.log("删除失败")
        wx.showToast({
          title: '删除失败',
          icon:"none",
          duration:2000
        })
        that.setData({id:null})
      }
      }
    },
  )}
  },//删除数据
  jumppage:function(e){
    var str;
    str = getApp().jumpPage(e);
    this.setData({page:str})
    this.pushPage()
  },//跳转页数
  countpage:function(){
    var page = getApp().countPage(this.data.numAll,this.data.per_page)
    this.setData({pageAll:page})
  },//计算总页数
  onLoad:function(){
    this.pushPage()
  }
})