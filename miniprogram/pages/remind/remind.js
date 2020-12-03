//index.js
import Dialog from '@vant/weapp/dialog/dialog';

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    remindId: '',
    reminds:[],
    // maxDate:new Date(new Date().getFullYear(),new Date().getMonth()+1,new Date().getDate()).getTime(),
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadData();
  },

  // 加载专题列表
  loadData: function() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 reminds
    db.collection('tb_timer_info').get({
      success: res => {
        this.setData({
          reminds: res.data
        });
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    })
  },
  
// onPageScroll(e) {
//   this.data.scrolltop = e.scrollTop;
// },

  remindDelConfirm: function(event) {
    this.setData({
      remindId: event.target.dataset.remindId ? event.target.dataset.remindId : ""
    });
    Dialog.confirm({
      message: '确定删除吗？'
    }).then(() => {
      this.removeRemind();
    }).catch(() => {
      // on cancel
    });
  },

  
  remindDialogShow: function(event) {
    // this.setData({
    //   remindName: event.target.dataset.remindName ? event.target.dataset.remindName : "",
    //   remindId: event.target.dataset.remindId ? event.target.dataset.remindId : "",
    //   remindDate:event.target.dataset.remindDate ? event.target.dataset.remindDate : "",
    //   index:event.target.dataset.type ? event.target.dataset.type : "",
    //   // coverIndex:event.target.dataset.arrayCover[coverIndex] ? event.target.dataset.arrayCover[coverIndex] : "",
    //   // loopIndex:event.target.dataset.arrayLoop[loopIndex] ? event.target.dataset.arrayLoop[loopIndex] : "",
    //   dialogShow: true
    // });
  },

  // remindDialogClose: function() {
  //   this.setData({
  //     dialogShow: false
  //   });
  // },

  // remindChange: function(event) {
  //   this.setData({
  //     remindName: event.detail
  //   });
  // },

  // toAdd: function(event){
  //   wx.navigateTo({
  //     url: '../edit/edit'
  //   })
  // },

  
//   onPageScroll(e) {
//     this.data.scrolltop = e.scrollTop;
// },

  // updateRemind: function() {
  //   const db = wx.cloud.database()
  //   db.collection('tb_timer_info').doc(this.data.remindId).update({
  //     data: {
  //       name: this.data.remindName
  //     },
  //     success: res => {
  //       this.remindDialogClose();
  //       this.loadData();
  //       this.setData({
  //         remindId: ""
  //       })
  //       wx.showToast({
  //         title: '更新成功',
  //       })
  //     },
  //     fail: err => {
  //       icon: 'none',
  //       console.error('[数据库] [更新记录] 失败：', err)
  //     }
  //   })
  // },
  removeRemind: function() {
    if (this.data.remindId) {
      const db = wx.cloud.database()
      db.collection('categories').doc(this.data.remindId).remove({
        success: res => {
          this.loadData();
          this.setData({
            remindId: ''
          })
          wx.showToast({
            title: '删除成功',
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '删除失败',
          })
        }
      })
    } else {
      wx.showToast({
        title: '无记录可删，请见创建一个记录',
      })
    }
  }
})


