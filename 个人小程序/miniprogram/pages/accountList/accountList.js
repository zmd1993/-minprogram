// miniprogram/pages/accountList/accountList.js
var id = 0;
var openId = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    id = options.id;
    openId = wx.getStorageSync("openId")
    this.getAccount();
  },
  // 获取数据
  getAccount:function(){
    var that = this;
    const db = wx.cloud.database();
    db.collection("account").where({
      cate_id:id,
      openId:openId
    }).get({
      success:function(res){
        that.setData({
          dataList:res.data
        })
        console.log(res.data)
      }
    })
  },
  // 切换密码显隐
  switchPassword:function(e){
    var index = e.currentTarget.dataset.index;
    var dataList = this.data.dataList;
    dataList[index].showPassword = !dataList[index].showPassword;
    this.setData({
      dataList:dataList
    }) 
  },
  // 显示更多隐藏更多
  showMore:function(e){
    var index = e.currentTarget.dataset.index;
    var dataList = this.data.dataList;
    dataList[index].showMore = !dataList[index].showMore;
    this.setData({
      dataList: dataList
    }) 
  },
  copy:function(e){
    var text = e.currentTarget.dataset.text;
    text = text.replace("Appid:",'');
    text = text.replace("Appid：", '');
    console.log(text)
    wx.setClipboardData({
      data: text,
      success: function (res) {
        wx.getClipboardData({
          success: function(res) {
            console.log(res.data)
          }
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