/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable array-callback-return */
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { message, Statistic } from 'antd';
import { Link, history } from 'umi';
import { getQueryString } from '@/utils/utils';
import moment from 'moment';
import { overdueKHXSDD, deleteKHXSDD, payKHXSDD } from '@/services/after-class/khxsdd';

const { Countdown } = Statistic;
const OrderDetails: React.FC = (props: any) => {
  const [deadline, setDeadline] = useState<number>();
  const [orderInfo, setOrderInfo] = useState<any>();
  const { title, detail, payOrder, user } = props.location.state;
  useEffect(() => {
    const orderTime = new Date(payOrder.XDSJ).getTime();
    setOrderInfo(payOrder);
    setDeadline(orderTime + 1000 * 60);
  }, [payOrder]);
  const onchanges = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation()
  };
  const handlePay = async () => {
    const res = await payKHXSDD({
      ddIds: [orderInfo.id],
      bjId: detail.id,
      returnUrl: '/parent/home',
      xsId: user.id,
      kcmc: title,
      amount: orderInfo.FY
    });
    console.log(res);

  };
  const handleCancle = async () => {
    const res = await deleteKHXSDD({ id: orderInfo.id });
    if (res.status === 'ok') {
      message.success('订单取消成功');
      history.go(-1);
    } else {
      message.error(res.message);
    }
  };
  const handleFinish = async () => {
    const res = await overdueKHXSDD({ id: orderInfo.id });
    if (res.status === 'ok') {
      console.log(res.data);
      setOrderInfo(res.data);
    } else {
      message.error(res.message);
    }
  };
  if (orderInfo) {
    return <div className={styles.OrderDetails}>
      <div className={styles.hender}>
        {orderInfo.DDZT === '待付款' ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />}
        {orderInfo.DDZT}
        {orderInfo.DDZT === '待付款' ? <p>请在<Countdown className={styles.countdown} value={deadline} onFinish={handleFinish} />内支付，逾期订单将自动取消</p> : ''}
      </div>
      <div className={styles.content} style={{ marginTop: orderInfo && orderInfo.DDZT === '已付款' ? '-38px' : '-20px' }}>
        <div className={styles.KCXX}>
          <p className={styles.title}>{title}</p>
          <ul>
            <li>上课时段：{detail.KKRQ}~{detail.JKRQ}</li>
            <li>上课地点：本校</li>
            <li>总课时：{detail.KSS}</li>
            <li>班级：{detail.BJMC}</li>
            <li>学生：{user.username}</li>
          </ul>
        </div>
        <div className={styles.KCZE}>
          <p><span>课程总额</span> <span>￥{detail.FY}</span></p>
          <p>实付<span>￥{detail.FY}</span></p>
        </div>
        <div className={styles.DDXX}>
          <ul>
            <li><span>订单编号</span><span>{orderInfo.DDBH}</span></li>
            <li><span>下单时间</span><span>{moment(orderInfo.XDSJ).format('YYYY-MM-DD hh:mm:ss')}</span></li>
            <li><span>支付方式</span><span>{orderInfo.ZFFS}</span></li>
            {
              orderInfo && orderInfo.DDZT === '已付款' ?
                <><li><span>支付时间</span><span>2021-09-10 12:02:11</span></li>
                </> : ""
            }
          </ul>
        </div>
        {
          orderInfo && orderInfo.DDZT === '待付款' ? <div className={styles.buttons}><button onClick={handleCancle}>取消订单</button></div> : ''
        }
      </div>
      {
        orderInfo && orderInfo.DDZT === '待付款' ? <div className={styles.footer}>
          <span>实付:</span><span>￥{detail.FY}</span>
          <button className={styles.btn} onClick={handlePay}>去支付</button>
        </div> : ''
      }
      {orderInfo && orderInfo.DDZT === '已付款' ?
        <div className={styles.payment}>
          <div onClick={onchanges}>
            <p>支付成功</p>
            <p><CheckCircleOutlined /></p>
            <Link to='/parent/mine/order?id=4'> <button>已完成支付</button></Link>
          </div>
        </div> : ''
      }
    </div>
  }
  return <></>
};

export default OrderDetails;
