// miniprogram/pages/unlock/unlock.js
var openId = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: true,
    userInfo: '',
    passwordBox: [
      {
        number: '',
        active: 0
      },
      {
        number: '',
        active: 0
      },
      {
        number: '',
        active: 0
      },
      {
        number: '',
        active: 0
      }
    ],
    passwordBoxIndex: 0,
    userPassword: '',
    confimUserPassword:'',
    wrongTimes: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    openId = wx.getStorageSync("openId");
    this.getUserInfo();
    wx.setNavigationBarTitle({
      title: '设置密码',
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff8c63',
    })
  },
  // 获取个人信息
  getUserInfo: function () {
    var that = this;
    const db = wx.cloud.database();
    db.collection("user").where({
      openId: openId
    }).get({
      success: function (res) {
        that.setData({
          userInfo: res.data[0],
          showLoading: false
        })
      }
    })
  },
  // 输入密码
  inputPassword: function (e) {
    var number = e.currentTarget.dataset.number;
    var passwordBox = this.data.passwordBox;
    var passwordBoxIndex = this.data.passwordBoxIndex;
    if (number == 10) {
      wx.navigateBack({
        
      })
    } else if (number == 11) {
      if (passwordBoxIndex > 0) {
        passwordBox[parseInt(passwordBoxIndex - 1)].active = 0;
        passwordBox[parseInt(passwordBoxIndex - 1)].number = '';
        this.setData({
          passwordBox: passwordBox,
          passwordBoxIndex: parseInt(passwordBoxIndex) - 1
        })
      }
    } else {
      if (passwordBoxIndex > 3) {

      } else {
        passwordBox[parseInt(passwordBoxIndex)].active = 1;
        passwordBox[parseInt(passwordBoxIndex)].number = number;
        this.setData({
          passwordBox: passwordBox,
          passwordBoxIndex: parseInt(passwordBoxIndex) + 1
        })
        if (passwordBoxIndex == 3) {
          var userPassword = this.data.userPassword;
          var confirmUserPassword = this.data.confirmUserPassword;
          console.log(userPassword)
          if(userPassword == ''){
            var userPassword = '';
            for (var i = 0; i < passwordBox.length; i++) {
              userPassword += passwordBox[i].number;
            }
            for (var i = 0; i < passwordBox.length; i++) {
              passwordBox[i].number = "";
              passwordBox[i].active = 0;
            }
            this.setData({
              wrongTimes:"请再次输入密码",
              showWrongTimes: true,
              passwordBox: passwordBox,
              passwordBoxIndex: 0,
              userPassword:userPassword
            })
          } else{
            var confirmUserPassword = '';
            for (var i = 0; i < passwordBox.length; i++) {
              confirmUserPassword += passwordBox[i].number;
            }
            if(userPassword!=confirmUserPassword){
              for (var i = 0; i < passwordBox.length; i++) {
                passwordBox[i].number = "";
                passwordBox[i].active = 0;
              }
              this.setData({
                wrongTimes: "两次密码不一致，请重新输入！",
                showWrongTimes: true,
                passwordBox: passwordBox,
                passwordBoxIndex: 0,
                userPassword: "",
                confirmUserPassword:""
              })
            }else{
              console.log(userPassword,confirmUserPassword)
              var that= this;
              const db = wx.cloud.database();
              console.log(that.data.userInfo._id)
              db.collection("user").doc(that.data.userInfo._id).update({
                data:{
                  password:confirmUserPassword
                },
                success:function(res){
                  wx.showToast({
                    title: '密码设置成功！',
                    icon:"none"
                  })
                  setTimeout(function(){
                    wx.navigateBack({
                      
                    })
                  },1000)
                },
                fail: err => {
                  icon: 'none',
                    console.error('[数据库] [更新记录] 失败：', err)
                }
                
              })
            }
           
          }
          
        }
      }

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