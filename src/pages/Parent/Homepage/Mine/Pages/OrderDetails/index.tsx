/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable array-callback-return */
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Statistic } from 'antd';
import { Link } from 'umi';

const { Countdown } = Statistic;
const OrderDetails: React.FC = () => {
  const [state, setstate] = useState(false);
  const valueKey = window.location.href.split('type=')[1];
  const id = window.location.href.split('id=')[1].split('&')[0];
  const [KcData, setKcData] = useState<any>();

  useEffect(() => {
  }, [id]);
  const onclick = ()=>{ 
    setstate(true)
  }
  const onclose = () => {
    setstate(false);
  }
  const onchanges = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation()
  }
  const deadline = Date.now() + 1000 * 60 * 60 * 24 * 1 + 1000 ;
  const onFinish=()=> {
    // eslint-disable-next-line no-console
    console.log('倒计时结束!');
  }
  return <div className={styles.OrderDetails}>
    {
      valueKey === 'true' ? 
      <div className={styles.hender}><CheckCircleOutlined />已完成</div>
      :
      <div className={styles.hender}>
        <ExclamationCircleOutlined />待付款
        <p>请在<Countdown className={styles.countdown}  value={deadline} onFinish={onFinish} />内支付，逾期订单将自动取消</p>
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
    {state === true ?
      <div className={styles.payment} onClick={onclose}>
        <div onClick={onchanges}>
        <p>支付成功</p>
        <p><CheckCircleOutlined /></p>
        <Link to='/parent/mine/order?id=4'> <button>已完成支付</button></Link>
        </div>
      </div>:''
  }
  </div>
};

export default OrderDetails;
