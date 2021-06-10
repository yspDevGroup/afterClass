import React, { useState } from 'react';
import styles from './index.less';

const OrderDetails: React.FC = () => {
  const [state, setstate] = useState(false);
  const onclick = ()=>{ 
  }
  return <div className={styles.OrderDetails}>
    {
      state === true ? 
      <div className={styles.hender}>已完成</div>
      :
      <div className={styles.hender}>
        待付款
        <p>请在23:57:00内支付，逾期订单将自动取消</p>
        </div>
    }
    
    <div className={styles.content} style={{marginTop: state === true ? '-38px' : '-20px'}}>
    <div className={styles.KCXX}>
        <p className={styles.title}>青少年足球兴趣培训课程</p>
        <ul>
          <li>上课时段：2021.09.12—2021.11.20</li>
          <li>上课地点：本校</li>
          <li>总课时：16节</li>
          <li>班级：A班</li>
          <li>学生：刘大大</li>
        </ul>
    </div>
    <div className={styles.KCZE}>
        <p><span>课程总额</span> <span>￥50.00</span></p>
        <p>实付<span>￥50.00</span></p>
    </div>
    <div className={styles.DDXX}>
      <ul>
        <li><span>订单编号</span><span>TY20210910000001</span></li>
        <li><span>下单时间</span><span>2021-09-10 12:01:20</span></li>
        <li><span>支付方式</span><span>在线支付</span></li>
        {
          state === true ?
          <><li><span>支付时间</span><span>2021-09-10 12:02:11</span></li>
          <li><span>电子发票</span><span>电子发票(商品明细-个人)</span></li></>:""
        }
      </ul>
    </div>
    {
      state === true ?
      <div className={styles.buttons}>
      <button>申请开票</button>
      <button style={{marginRight:'10px'}}>退课退款</button>
    </div>
      :
      <div className={styles.buttons}><button>取消订单</button></div>
    }
    </div>
    {
      state === true ? "":
      <div className={styles.footer}>
      <span>实付:</span><span>￥50</span>
      <button className={styles.btn} onClick={onclick}>去支付</button>
    </div>
    }
  </div>
};

export default OrderDetails;
