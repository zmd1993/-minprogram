// miniprogram/pages/addCount/addCount.js
var openId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pickerData: ["请选择类型"],
    pickerDataIndex:0,
    showPicker:false,
    bindData:[],
    bindAccount:'',
    bindRegion:'',
    remarkValue:'',
    account:'',
    password:'',
    showAdd1:true,
    showConfirm:true,
    cate:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    openId = wx.getStorageSync("openId");
    this.getCategory();
  },
  getCategory:function(){
    var that = this;
    const db = wx.cloud.database();
    db.collection("category").where({
      openId:openId
    }).get({
      success:function(res){
        console.log(res.data)
        var pickerData = that.data.pickerData;
        for(var i=0;i<res.data.length;i++){
          pickerData.push(res.data[i].category)
        }
        that.setData({
          pickerData:pickerData,
          cate: res.data
        })
      }
    })
  },
  pickerChange:function(e){
    var pickerData = this.data.pickerData;
    this.setData({
      showPicker:true
    })
  },
  chosePicker:function(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      showPicker:false,
      pickerDataIndex:index
      
    })
  },
  // 输入账号
  inputAccount:function(e){
    this.setData({
      account:e.detail.value
    })
  },
  // 输入密码
  inputPassword:function(e){
    this.setData({
      password:e.detail.value
    })
  },
  // 输入绑定账号
  inputBindAccount:function(e){
    this.setData({
      bindAccount:e.detail.value
    })
  },
  // 输入绑定大区
  inputBindRegion: function (e) {
    this.setData({
      bindRegion: e.detail.value
    })
  },
  // 输入备注
  inputRemark:function(e){
    this.setData({
      remarkValue: e.detail.value
    })
  },
  // 添加备注
  addBindAccount:function(){
    var that = this;
    that.setData({
      showAdd1:false
    })
    var arr ={
      bindAccount: that.data.bindAccount,
      bindRegion: that.data.bindRegion,
      remarkValue: that.data.remarkValue
    }
    var bindData = that.data.bindData;
    console.log(arr)
    if (arr.bindAccount == '' && arr.bindRegion == '' && arr.remarkValue == ''){
      wx.showToast({
        title: '请至少添加一项',
        icon:'none'
      })
      that.setData({
        showAdd1:true
      })
    }else{
      bindData.push(arr);
      setTimeout(function () {
        that.setData({
          bindData: bindData,
          showAdd1: true,
          bindAccount: '',
          bindRegion: '',
          remarkValue: '',
        })
      }, 1000)
    }
  },
  // 提交
  submit:function(){
    var that = this;
    var account = that.data.account;
    var password = that.data.password;
    var bindData = that.data.bindData;
    var pickerData = that.data.pickerData;
    var pickerDataIndex = that.data.pickerDataIndex;
    var cate = that.data.cate;
    if (pickerData[pickerDataIndex] == '请选择类型'){
      wx.showToast({
        title: '请选择账号类型',
        icon: 'none'
      })
    }else if(account == ''){
      wx.showToast({
        title: '请输入账号',
        icon:'none'
      })
    }else if (password == ""){
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
    }else{
      const db = wx.cloud.database();
      db.collection("account").add({
        data:{
          accountType: pickerData[pickerDataIndex],
          account:account,
          password:password,
          bindData: bindData,
          openId:openId,
          showPassword: false,
          accountIcon: cate[pickerDataIndex-1].icon,
          cate_id:cate[pickerDataIndex-1]._id,
          showMore: false,
        },
        success:function(res){
          wx.showToast({
            title: '添加成功',
            icon:"none"
          })
          setTimeout(function(){
            wx.navigateBack({
              
            })
          },500)
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