// miniprogram/pages/my/my.js
var openId = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:"",
    hasOpenId:false,
    operation:[
      {
        imageUrl: 'cloud://hua-7e98f2.6875-hua-7e98f2/addAccount.png',
        text: '添加账号',
        url:"../addCount/addCount"
      },
      {
        imageUrl: 'cloud://hua-7e98f2.6875-hua-7e98f2/modifyAccount.png',
        text: '修改账号',
        url: ""
      },
      {
        imageUrl: 'cloud://hua-7e98f2.6875-hua-7e98f2/deleteAccount.png',
        text: '删除账号',
        url: ""
      },
      {
        imageUrl: 'cloud://hua-7e98f2.6875-hua-7e98f2/addCate.png',
        text: '添加类别',
        url: "../addCategory/addCategory"
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var hasOpenId = wx.getStorageSync("openId");
    if (hasOpenId!=''&&hasOpenId!=null) {
      openId = hasOpenId
      this.setData({
        hasOpenId:true
      })
      this.getUserInfo();
      this.getCategory();
    }
  },
  goChild:function(e){
    var index = e.currentTarget.dataset.index;
    var operation = this.data.operation;
    var hasOpenId = wx.getStorageSync("openId");
    if (hasOpenId != '' && hasOpenId != null){
      wx.navigateTo({
        url: operation[index].url,
      })
    }else{
      wx.navigateTo({
        url: '../start/start',
      })
    }
  },
  getCategory: function () {
    var that = this;
    const db = wx.cloud.database();
    db.collection("category").where({
      openId: openId
    }).get({
      success: function (res) {
        console.log(res.data)
        var pickerData = that.data.pickerData;
        for (var i = 0; i < res.data.length; i++) {
          pickerData.push(res.data[i].category)
        }
        that.setData({
          pickerData: pickerData
        })
      }
    })
  },  
  // 获取个人信息
  getUserInfo:function(){
    var that = this;
    const db = wx.cloud.database();
    db.collection("user").where({
      openId: openId
    }).get({
      success:function(res){
        console.log(res)
        that.setData({
          userInfo:res.data[0]
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})