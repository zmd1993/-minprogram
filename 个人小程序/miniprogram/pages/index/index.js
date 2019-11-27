//index.js
var openId;
const app = getApp()

Page({
  data: {
    navBar:[
      {
        text:'新增账号',
        icon:'cloud://hua-7e98f2.6875-hua-7e98f2-1259001707/newIcon/2_1.png',
        path:''
      },
      {
        text: '修改账号',
        icon: 'cloud://hua-7e98f2.6875-hua-7e98f2-1259001707/newIcon/2_01.png',
        path: ''
      },
      {
        text: '删除账号',
        icon: 'cloud://hua-7e98f2.6875-hua-7e98f2-1259001707/newIcon/2_3.png',
        path: ''
      },
      {
        text: '新增类别',
        icon: 'cloud://hua-7e98f2.6875-hua-7e98f2-1259001707/newIcon/2_4.png',
        path: ''
      }
    ],
   navList:''
  },

  onLoad: function() {
    openId =wx.getStorageSync("openId");
    this.getAccount();
  },
  getAccount:function(){
    var that = this;
    const db = wx.cloud.database();
    db.collection("category").where({
      openId:openId
    }).get({
      success:function(res){
        console.log(res.data)
        that.setData({
          navList:res.data
        })
      }
    })
  }
})
