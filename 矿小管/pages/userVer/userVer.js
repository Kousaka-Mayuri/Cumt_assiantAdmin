Page({
  data:{
    userVerList:[],
    numAll:"",//总数量
    pageAll:"",//总页数
    page:"1",//页数
    per_page:"15",//每页大小
    ratioList:[],
    verRatio:[],
    plaList:[],//平台数量列表
    andPer:0.0,//安卓占比
    iosPer:0.0,//ios占比
    verPer:[],//各版本占比
    colors :["#99CCFF", "#CCCCFF","#EE6AA7","#EEAD0E","#EEEE00","#CCFF66","#FF9933"],//颜色列表
    verList:[],//版本数量列表
    verNum:[],//存在的版本号
    verAll:"",
    version:[]//放在显示层的数组
  },
  toPercent:function(point){
    var str=Number(point*100).toFixed(1);
    str+="%";
    return str;
},//小数转百分数
  getVer:function(fn){
    var that = this;
      wx.request({
        url: 'https://www.lvyingzhao.cn/page_amount?page='+that.data.page+'&perPage='+that.data.per_page,
        method:"GET",
        data:{
          "page":that.data.page,
          "perPage":that.data.per_page,
        },
        success:function(res){
          that.setData({
            numAll:res.data.num,
            userVerList:res.data.data
          })
          that.countpage()
        },
      })

  },//获取用户版本信息
  getVerClassify:function(fn){
    var that = this
    wx.request({
      url: 'https://www.lvyingzhao.cn/version',
      method:"GET",
      success(res){
        that.setData({verRatio:res.data.data,
          verAll:res.data.num
        })
        var perNum;
        var s = parseInt(res.data.num);
        for(var index in res.data.data)
        {
          that.data.verNum.push(index)
          that.data.verList.push(res.data.data[index])
          perNum = res.data.data[index]/res.data.num
          perNum = that.toPercent(perNum)
          that.data.verPer.push(perNum)
          s = s-parseInt(res.data.data[index])
        }//获取各个版本号
        that.data.verNum.push("其他");
        that.data.verList.push(s);
        that.data.verRatio["其他"]=String(s);
        perNum = s/res.data.num;
        perNum = that.toPercent(perNum)
        that.data.verPer.push(perNum)
        var a = [];
       a =  that.toObject(that.data.verRatio);
       that.setData({version:a})
        fn()
      },
    })
  },//用户版本信息分类
  toObject(str){
    var that = this
    var s = [];
    var count = 0;
    for(var index in str){
    var a = {
      "version":index,
      "num":str[index],
      "color":"color:"+that.data.colors[count],
      "percent":that.data.verPer[count]
    }
    count++;
    s.push(a)
  }
  return s;
  },//数组拼成对象数组
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
      var str = parseInt(this.data.page)
      str--;
      this.setData({page:String(str)})
    this.getVer()
  }
  },//上一页
  plusPage:function(){
    var num = parseInt(this.data.page)+1
    var temNum = parseInt(this.data.pageAll)
    if(num>temNum){
      wx.showToast({
      title: '已到最后一页',
      icon:"none"
    })}
    else{
      var str = parseInt(this.data.page)
      str++;
      this.setData({page:String(str)})
    this.getVer()
  }
  },//下一页
  jumppage:function(e){
    var str = getApp().jumpPage(e)
    this.setData({page:str})
    this.getVer()
  },//跳转页面
  countpage:function(){
    var str;
    str = getApp().countPage(this.data.numAll,this.data.per_page)
    this.setData({pageAll:str})
  },//获取总页数
  getPlaRatio:function(fn){
    var that = this
    wx.request({
      url: 'https://www.lvyingzhao.cn/type',
      method:"GET",
      success(res){
        that.setData({ratioList:res.data,
        numAll:res.data.num})
        var a = res.data.data.ios;
        var b = res.data.data.android;
        var list =[];
        list.push(a);
        list.push(b);
        that.setData({plaList:list})
        a = a/that.data.numAll;
        var s = a.toFixed(2);
        s = that.toPercent(s);
        that.setData({andPer:s});
        b = b/that.data.numAll;
        s = b.toFixed(2);
        s=that.toPercent(s);
        that.setData({iosPer:s})
        fn()
      },
      fail(res){
        console.log("fail")
      }
    })
  },//获取用户平台比例
  printCanvas:function(array,all,colors,str){
    var that = this;
    var context = wx.createContext()
    var point = {x:80,y:60};//圆心绘制
    var radius = 50;//半径大小
    var total = parseInt(all)
    for(var i = 0;i<array.length;i++){
      var start = 0;
      var end = 0;
      if(i>0){
        for(var j =0 ;j<i;j++){
          start += (array[j]/total)*2*Math.PI;
        }
      }//计算初始弧度
      end = start + array[i]/total*2*Math.PI
      context.beginPath();//开启画布
      context.arc(point.x,point.y,radius,start,end,false);//绘制
      context.lineTo(point.x,point.y);//连回圆心
      context.setFillStyle(colors[i]);//填充颜色
      context.fill();//填充动作
      context.closePath();//关闭画布
    }
    wx.drawCanvas({
      canvasId:str,
      actions:context.getActions()
    })
  },//画饼状图
  printPla:function(){
    this.printCanvas(this.data.plaList,this.data.numAll,this.data.colors,"userPla")
  },//画平台饼状图
  printVer:function(){
    this.printCanvas(this.data.verList,this.data.verAll,this.data.colors,"verNum")
  },
  onLoad:function(){
    this.getVer()
    this.getPlaRatio(this.printPla)
    this.getVerClassify(this.printVer)
},
  onReady:function(){
  },
  onShow:function(){
  }
})