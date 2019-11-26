//index.js
const app = getApp()
var LEVEL = 0; 
const db = wx.cloud.database();
const _ = db.command;
var util = require("../../utils/util.js");
var openId = 0;
var _id='';
var configId = 0;
Page({
  data: {
    dataList: '',
    rightAnwserIndex:0,
    currentQuestion:'',
    modalState:0,
    finalLevel:false, //是否为最后一关
    countDonw:999,
    showIndex:1,
    showLoading:true
  },

  onLoad: function () {
    openId = wx.getStorageSync("openId")||0;
    configId = wx.getStorageSync("configId");
    this.getConfig();
    this.getUserAnswer();
    this.getUserIntegral();
  },
  // 获取配置信息
  getConfig:function(){
    console.log("------配置内容------")
    db.collection("config").doc(configId).get({
      success:res=>{
        console.log(res)
        this.setData({
          config:res.data,
          countDonw:res.data.waitOpenTime
        })
      }
    })
  },
  // 获取用户数据
  getUserAnswer:function(){
    db.collection("userAnswer").where({
      openId:openId
    }).get({
      success:res=>{
        console.log(res)
        if(res.data.length==0){
          LEVEL=1
          this.createUserAnswer()
        }else{
          LEVEL = res.data[0].level+1;
          _id = res.data[0]._id
          this.setData({
            userAnswerList:res.data[0].answer
          })
        }
        this.getDataList()
      }
    })
  },
  // 获取关卡数据
  getDataList:function(){
    
    db.collection("question").where({
      level:LEVEL
    }).get({
      success:res=>{
        console.log(res)
        if(res.data.length==0){
          this.getUserIntegral()
          this.setData({
            finalLevel:true,
            showLoading: false
          })
        }else{
          wx.setNavigationBarTitle({
            title: "第" + LEVEL + "关",
          })
          var answer = res.data[0].answer;
          db.collection("tips").where({
            number:answer
          }).get({
            success:res=>{
              console.log(res.data)
              var random = this.getRandomNumber(res.data);
              console.log(random)
              var randRightIndex;
              if (res.data[random].type==1){
                randRightIndex = parseInt(Math.random() * 25);
              }else{
                randRightIndex = answer
              }
              this.setData({
                currentQuestion: res.data[random],
                currentRightIndex: randRightIndex
              })
              if (res.data[random].descript.length>1){
                this.countDonw();
              }
              console.log(randRightIndex)
              var dataList = this.getBlockData(25, randRightIndex);
              this.setData({
                dataList: dataList,
                showLoading:false
              })
            }
          })
          
        }
      }
    })
  },
  // 判断该题目用户是否做过
  getRandomNumber:function(arr){
    var list = this.data.userAnswerList;
    console.log(list)
    console.log(arr)
    var newArray = new Array();
    for(var i=0;i<arr.length;i++){
      for(var k=0;k<list.length;k++){
        if(arr[i]._id==list[k].answerId){
          arr[i]._id=1
        }
      }
    }
    console.log(arr)
    var randomNumber;
    for(var i=0;i<100;i++){
      randomNumber = parseInt(Math.random() * arr.length);
      if(arr[randomNumber]._id!=1){
        break;
      }
    }
    return randomNumber;
  },
  // 新建用户数据
  createUserAnswer:function(){
    db.collection("userAnswer").add({
      data:{
        openId:openId,
        level:0,
        answer:[]
      },
      success:res=>{
        console.log(res)
        _id = res._id
        this.getUserAnswer();
      }
    })
  },
  getBlockData: function (num, answerIndex) {
    var arr = new Array();
    for (var i = 0; i < num; i++) {
      var json;
      if (i == answerIndex-1) {
        json = {
          state: 0,
          rightAnwser: 1
        }
      } else {
        json = {
          state: 0,
          rightAnwser: 0
        }
      }
      arr.push(json)
    }
    return arr;
  },
  choseThis: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)

    var dataList = this.data.dataList;
    console.log(dataList[index])
    if (dataList[index].rightAnwser == 1) {
      dataList[index].state = 1
      console.log(dataList[index])
      this.setData({
        dataList: dataList,
        modalState:1
      })
      // 用户正确答案
      var time = new Date();
      var newTime = util.formatTime(time)
      var parameter = {
        answerId: this.data.currentQuestion._id,
        rightAnswer: index+1,
        time: newTime,
        answer: this.data.currentQuestion
      }
      const _ = db.command;
      db.collection("userAnswer").doc(_id).update({
        data:{
          level:LEVEL,
          answer: _.push(parameter)
        },
        success:res=>{
          LEVEL++;
          console.log(this.data.config.successIntegral+'配置积分')
          this.updateUserIntegral(this.data.config.successIntegral);
        }
      })
    }else{
      this.updateUserIntegral(this.data.config.failIntegral);
      this.setData({
        modalState: 2
      })
      
    }
  },
  // 获取用户积分
  getUserIntegral:function(){
    db.collection("user").where({
      openId:openId
    }).get({
      success:res=>{
        this.setData({
          userInfo:res.data[0]
        })
        console.log(res)
      }
    })
  },
  // 更新用户积分
  updateUserIntegral:function(integral){
    console.log(this.data.userInfo._id)
    db.collection("user").doc(this.data.userInfo._id).update({
      data:{
        integral: _.inc(parseInt(integral))
      },
      success:function(res){
        console.log("------积分更新成功------")
      },
      fail:function(res){
        console.log("------积分更新失败------")
        console.log(res)
      }
    })
  },
  levelFail:function(){
    this.getUserAnswer();
    this.setData({
      modalState: 0,
      showLoading:true
    })
  },
  levelSuccess:function(){
    this.getUserAnswer();
    this.setData({
      modalState:0,
      showLoading: true
    })
  },
  // 倒计时
  countDonw:function(){
    var time = this.data.countDonw;
    var timer = setInterval(()=>{
      if(time<=0){
        this.setData({
          showIndex:5
        })
        clearInterval(timer)
      }else{
        time--;
        this.setData({
          countDonw:time
        })
      }
    },1000)
  },
  preventTouchMove:function(){
    
  },
  onShareAppMessage:function(e){
    console.log(e)
  }
})
