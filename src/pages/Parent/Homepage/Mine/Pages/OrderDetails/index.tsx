/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable array-callback-return */
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import {culturedata,artdata,techdata,sportsdata,learndata} from '../../../listData'

const OrderDetails: React.FC = () => {
  const valueKey = window.location.href.split('type=')[1];
  const id = window.location.href.split('id=')[1].split('&')[0];
  const [KcData, setKcData] = useState<any>();
  const [countdown, setCountdown] = useState('24:00:00');


  useEffect(() => {
    let h=23;
    let m=59;
    let s=59;
    setInterval(() => {
      --s;
      if(s<0){
          --m;
          s=59;
      }
      if(m<0){
          --h;
          m=59
      }
      if(h<0){
          s=0;
          m=0;
      }
      setCountdown(`${h}:${m}:${s}`);
  }, 1000);
    culturedata.list.map((value)=>{
      if(value.id === id){
        setKcData(value)
      }
    })
    artdata.list.map((value)=>{
      if(value.id === id){
        setKcData(value)
      }
    })
    techdata.list.map((value)=>{
      if(value.id === id){
        setKcData(value)
      }
    })
    sportsdata.list.map((value)=>{
      if(value.id === id){
        setKcData(value)
      }
    })
    learndata.list.map((value)=>{
      if(value.id === id){
        setKcData(value)
      }
    })
   
  }, [id]);
  const onclick = ()=>{ 
   
  }
  return <div className={styles.OrderDetails}>
    {
      valueKey === 'true' ? 
      <div className={styles.hender}><CheckCircleOutlined />已完成</div>
      :
      <div className={styles.hender}>
        <ExclamationCircleOutlined />待付款
        <p>请在{countdown}内支付，逾期订单将自动取消</p>
        </div>
    }
    
    <div className={styles.content} style={{marginTop: valueKey === 'true' ? '-38px' : '-20px'}}>
    <div className={styles.KCXX}>
        <p className={styles.title}>{KcData?.title}</p>
        <ul>
          <li>上课时段：{KcData?.desc[0].left[0].split('：')[1]}</li>
          <li>上课地点：本校</li>
          <li>总课时：{KcData?.desc[1].left[0]}</li>
          <li>班级：A班</li>
          <li>学生：刘大大</li>
        </ul>
    </div>
    <div className={styles.KCZE}>
        <p><span>课程总额</span> <span>￥{KcData?.price}</span></p>
        <p>实付<span>￥{KcData?.price}</span></p>
    </div>
    <div className={styles.DDXX}>
      <ul>
        <li><span>订单编号</span><span>TY20210910000001</span></li>
        <li><span>下单时间</span><span>2021-09-10 12:01:20</span></li>
        <li><span>支付方式</span><span>在线支付</span></li>
        {
          valueKey === 'true' ?
          <><li><span>支付时间</span><span>2021-09-10 12:02:11</span></li>
          <li><span>电子发票</span><span>电子发票(商品明细-个人)</span></li></>:""
        }
      </ul>
    </div>
    {
      valueKey === 'true' ?
      <div className={styles.buttons}>
      <button>申请开票</button>
      <button style={{marginRight:'10px'}}>退课退款</button>
    </div>
      :
      <div className={styles.buttons}><button>取消订单</button></div>
    }
    </div>
    {
      valueKey === 'true' ? "":
      <div className={styles.footer}>
      <span>实付:</span><span>￥{KcData?.price}</span>
      <button className={styles.btn} onClick={onclick}>去支付</button>
    </div>
    }
  </div>
};

export default OrderDetails;
