// miniprogram/pages/start/start.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onGetOpenid();
  },
  onGetOpenid: function () {
    var that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        wx.setStorageSync("openId", res.result.openid);
        const db = wx.cloud.database();
        db.collection('user').where({
          openId:res.result.openid
        }).get({
          success:function(res){
            if(res.data.length!=0){
              wx.reLaunch({
                url: '../unlock/unlock',
              })
            }else{
              that.setData({
                showLoading:false
              })
            }
          }
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  onGotUserInfo:function(e){
    var userInfo = e.detail.userInfo;
    const db = wx.cloud.database();
    db.collection('user').add({
      data:{
        nickName: userInfo.nickName,
        avatarUrl:userInfo.avatarUrl,
        province:userInfo.province,
        country:userInfo.country,
        city:userInfo.city,
        openId:wx.getStorageSync("openId")
      },
      success:function(res){
        console.log(res)
        wx.navigateTo({
          url: '../unlock/unlock',
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