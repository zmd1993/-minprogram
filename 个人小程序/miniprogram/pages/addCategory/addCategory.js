// miniprogram/pages/addCategory/addCategory.js
var openId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    forbidden:false,
    category:'',
    imageList:[],
    imageListIndex:1000,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    openId = wx.getStorageSync("openId");
    this.getImageList();
  },
  // 获取图标
  getImageList:function(){
    var that = this;
    const db = wx.cloud.database();
    db.collection("accountIcon").get({
      success:function(res){
        that.setData({
          imageList:res.data
        })
        console.log(res.data)
      }
    })
  },
  // 选择图标
  choseThis:function(e){
    var index = e.currentTarget.dataset.index;
    var imageList = this.data.imageList;
    for(var i=0;i<imageList.length;i++){
      imageList[i].active = false
    }
    imageList[index].active = true;
    this.setData({
      imageList:imageList,
      imageListIndex:index
    })
  },
  inputCategory:function(e){
    this.setData({
      category:e.detail.value
    })
  },  
  submit:function(){
    var that = this;
    var category = that.data.category;
    var imageList = that.data.imageList;
    var imageListIndex = that.data.imageListIndex;
    console.log(imageListIndex)
    if(category==''){
      wx.showToast({
        title: '请输入账号类别',
        icon:"none"
      })
    } else if (imageListIndex == 1000){
      wx.showToast({
        title: '请选择图标',
        icon: "none"
      })
    }else{
      that.setData({
        forbidden:true
      })
      const db = wx.cloud.database();
      db.collection("category").add({
        data:{
          category:category,
          openId:openId,
          icon: imageList[imageListIndex].imageUrl
        },
        success:function(res){
          wx.showToast({
            title: '添加成功！',
            icon:"none"
          })
          that.setData({
            forbidden:false,
            category:'',
            imageListIndex:1000
          })
        }
      })
    }
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