//index.js
const app = getApp()
var openId = 0;
const db = wx.cloud.database();
var util = require("../../utils/util.js");
Page({
  data: {
    hasLogin:false
  },

  onLoad: function() {
    openId = wx.getStorageSync("openId")||0;
    if(openId==0){
      this.setData({
        hasLogin: false
      })
      this.getUserOpenId()
    }else{
      this.setData({
        hasLogin:true
      })
    }
  },
  // 调用云函数获取用户openId
  getUserOpenId:function(user,state){
    wx.cloud.callFunction({
      name:"login",
      success:res=>{
        console.log(res)
        openId = res.result.openid;
        wx.setStorageSync("openId", openId)
        if(state==1){
          this.checkRegister(user)
        }
      },
      fail:res=>{
        console.log(res)
      }
    })
  },
  // 登录
  getUserInfo:function(){
    wx.getUserInfo({
      success:res=>{
        console.log(res)
        var userInfo = res.userInfo;
        if(openId==0){
          this.getUserOpenId(userInfo,1);
        }else{
          this.checkRegister(userInfo)
        }
      }
    })
  },
  // 判断用户是否注册
  checkRegister:function(userInfo){
    db.collection("user").where({
      openId:openId
    }).get({
      success:res=>{
        console.log(res)
        if(res.data.length==0){
          // 用户未注册
          this.register(userInfo)
        }else{
          if (res.data[0].userInfo.avatarUrl != userInfo.avatarUrl || res.data[0].userInfo.nickName != userInfo.nickName){
            this.updateUserInfo(res.data[0]._id,userInfo);
          }else{
            this.goGame()
          }
        }
      }
    })
  },
  // 注册用户
  register:function(userInfo){
    var time = new Date();
    console.log(time)
    var newTime = util.formatTime(time)
    var timestamp = Date.parse(new Date());
    console.log(openId)
    console.log(newTime)
    db.collection("user").add({
      data:{
        openId: openId,
        userInfo: userInfo,
        addTime: {
          time: newTime,
          timestamp: timestamp
        },
        integral:0
      },
      success:res=>{
        console.log(res)
        wx.setStorageSync("openId", openId)
        this.goGame()
      }
      
    })
  },
  // 用户头像，昵称已改变，更新昵称
  updateUserInfo:function(id,userInfo){
    db.collection("user").doc(id).update({
      data:{
        userInfo:userInfo
      },
      success:res=>{
        console.log('更新昵称头像成功！')
        this.goGame()
      }
    })
  },
  goGame:function(){
    wx.navigateTo({
      url: '../game/game',
    })
  },
})
