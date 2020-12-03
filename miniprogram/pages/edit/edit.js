//index.js
const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog';

Page({
  data: {
    remindId:'',
    checked: false,
    remindName:'',
    importantValue:0,
    date: '请选择日期',
    realdate: new Date().getTime(),
    show: false,
    minDate: new Date().getTime(),
    maxDate:new Date(new Date().getFullYear(),new Date().getMonth()+1,new Date().getDate()).getTime(),
    index:0,
    arrayRemind: ['日常', '生日', '还款', '购物','爱情','节日','娱乐','学习','工作'],
    arrayRemindIcon: ['rc', 'sr', 'hk', 'gw','zq','jr','yl','xx','gg'],
    loopIndex:0,
    arrayLoop: ['不循环', '每天','每周','每月','每年'],
    arrayLoopIcon: ['', 'r','z','y','n'],

  },

  onChangeImportant(event) {
    this.setData({
      importantValue: event.detail,
    });
  },
  onChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ checked: detail });
  },
  remindChange: function(event) {
    this.setData({
      remindName: event.detail.value
    });
  },
  onDisplay() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  },
  onConfirm(event) {
    this.setData({
      show: false,
      realdate: new Date(event.detail),
      date: this.formatDate(event.detail),
    });
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
  bindLoopChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      loopIndex: e.detail.value
    })
  },

  saveRemind: function(event) {
    if (!this.data.remindName){
      wx.showToast({
        title: '日程名称未填写',
        image: '../../images/jinzhi.png',
        icon: 'none',
        mask:true 
      })
      return
    }
    if (this.data.date=='请选择日期'){
      wx.showToast({
        title: '日期未选择',
        image: '../../images/jinzhi.png',
        icon: 'none',
        mask:true 
      })
      return
    }
    if (!this.data.remindId) {

      this.addRemind();
    } else {
      this.updateRemind();
    }
    
  },
  addRemind: function() {
    this.onGetOpenid();
    const db = wx.cloud.database()
    db.collection('tb_timer_info').add({
      data: {
        title: this.data.remindName,
        date: this.data.date,
        realdate: this.data.realdate,

        type: this.data.index,
        typeName:this.data.arrayRemind[this.data.index], 
        typeIcon:this.data.arrayRemindIcon[this.data.index], 
        cover: this.data.checked,

        loop: this.data.loopIndex,
        loopName:this.data.arrayLoopIcon[this.data.loopIndex], 
        loopIcon:this.data.arrayLoopIcon[this.data.loopIndex], 
        importantValue:this.data.importantValue,

        openid: this.data.openid,
      },
      success: res => {
        wx.showToast({
          title: '添加成功',
        })
        this.setData({
          remindName:'',
          date:'请选择日期',
          index:0,
          checked:false,
          loopIndex:0,
          importantValue:0
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
})
