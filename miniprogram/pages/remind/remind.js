//index.js
import Dialog from '@vant/weapp/dialog/dialog';

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialogShow: false,
    remindName: '',
    remindId: '',
    reminds: [],
    //remindDate: '',
    date: '',
    show: false,
    arrayRemind: ['普通事件', '生日', '还款', '爱情','节日','娱乐','学习','工作'],
    index: -1,
    arrayCover: ['不设为封面', '设为封面'],
    arrayLoop: ['不循环', '每天','每周','每月','每年'],
    customItem: '全部',
    openid :'',
    // 拖拽参数
    writePosition: [80, 90], //默认定位参数
    writesize: [0, 0],// X Y 定位
    window: [0, 0], //屏幕尺寸
    write: [60, 60], //定位参数
    scrolltop: 0,//据顶部距离

  },

 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadData();
    let that = this;
    that.getSysdata();
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
  // 拖拽事件
  //计算默认定位值
  getSysdata: function () {
    var that = this;
    wx.getSystemInfo({
        success: function (e) {
            that.data.window = [e.windowWidth, e.windowHeight];
            var write = [];
            write[0] = that.data.window[0] * that.data.writePosition[0] / 100;
            write[1] = that.data.window[1] * that.data.writePosition[1] / 100;
            console.log(write,45)
            that.setData({
                write: write
            }, function () {
                // 获取元素宽高
                wx.createSelectorQuery().select('.collectBox').boundingClientRect(function (res) {
                    console.log(res.width)
                    that.data.writesize = [res.width, res.height];
                }).exec();
            })
        },
    });
},
 //开始拖拽   
 touchmove: function (e) {
  var that = this;
  var position = [e.touches[0].pageX - that.data.writesize[0] / 2, e.touches[0].pageY - that.data.writesize[1] / 2 - this.data.scrolltop];
  that.setData({
      write: position
  });
},
onPageScroll(e) {
  this.data.scrolltop = e.scrollTop;
},

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
    this.setData({
      remindName: event.target.dataset.remindName ? event.target.dataset.remindName : "",
      remindId: event.target.dataset.remindId ? event.target.dataset.remindId : "",
      remindDate:event.target.dataset.remindDate ? event.target.dataset.remindDate : "",
      index:event.target.dataset.type ? event.target.dataset.type : "",
      // coverIndex:event.target.dataset.arrayCover[coverIndex] ? event.target.dataset.arrayCover[coverIndex] : "",
      // loopIndex:event.target.dataset.arrayLoop[loopIndex] ? event.target.dataset.arrayLoop[loopIndex] : "",
      dialogShow: true
    });
  },

  remindDialogClose: function() {
    this.setData({
      dialogShow: false
    });
  },

  remindChange: function(event) {
    this.setData({
      remindName: event.detail
    });
  },

  // 保存专题
  saveRemind: function(event) {
    if (!this.data.remindName || !this.data.remindDate ||!this.data.index ||!this.data.coverIndex ||!this.data.loopIndex) {
      wx.showToast({
        title: '所有信息不能为空',
        image: '../../images/jinzhi.png',
        icon: 'none',
        mask:true 
      })
      this.setData({
        dialogShow: false
      });
    }else{
      if (!this.data.remindId) {
        
        this.addRemind();
      } else {
        this.updateRemind();
      }
    }
  },
  addRemind: function() {
    this.onGetOpenid();
    const db = wx.cloud.database()
    db.collection('tb_timer_info').add({
      data: {
        title: this.data.remindName,
        date: this.data.remindDate,
        type: this.data.index,
        cover: this.data.coverIndex,
        loop: this.data.loopIndex,
        
        openid: this.data.openid,
        status: this.data.remindName,
      },
      success: res => {
        this.remindDialogClose();
        this.loadData();
        wx.showToast({
          title: '添加成功',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '添加失败'
        })
      }
    })
  },
  onPageScroll(e) {
    this.data.scrolltop = e.scrollTop;
},

  updateRemind: function() {
    const db = wx.cloud.database()
    db.collection('tb_timer_info').doc(this.data.remindId).update({
      data: {
        name: this.data.remindName
      },
      success: res => {
        this.remindDialogClose();
        this.loadData();
        this.setData({
          remindId: ""
        })
        wx.showToast({
          title: '更新成功',
        })
      },
      fail: err => {
        icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },
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
  },

  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      remindDate: e.detail.value
    })
  },
  bindTypeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindCoverChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      coverIndex: e.detail.value
    })
  },
  bindLoopChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      loopIndex: e.detail.value
    })
  },
  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        this.data.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  onDisplay() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },
  onConfirm(event) {
    this.setData({
      show: false,
      date: this.formatDate(event.detail),
    });
  },
})