/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable array-callback-return */
import React, { useEffect, useRef, useState } from 'react';
import { Link, history } from 'umi';
import { message, Statistic } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { overdueKHXSDD, deleteKHXSDD, payKHXSDD } from '@/services/after-class/khxsdd';
import moment from 'moment';
import styles from './index.less';

const { Countdown } = Statistic;
const OrderDetails: React.FC = (props: any) => {
  const [deadline, setDeadline] = useState<number>();
  const [orderInfo, setOrderInfo] = useState<any>();
  const [urlPath, setUrlPath] = useState<any>();
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const { title, detail, payOrder, user } = props.location.state;
  const children = user?.subscriber_info?.children || [{
    student_userid: user?.userId,
    njId: '1'
  }];
  useEffect(() => {
    const orderTime = new Date(payOrder.XDSJ).getTime();
    setOrderInfo(payOrder);
    setDeadline(orderTime + 1000 * 60 * 30);
  }, [payOrder]);
  useEffect(()=>{
    linkRef.current?.click();
  },[urlPath]);
  const onchanges = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation()
  };
  const handlePay = async () => {
    const res = await payKHXSDD({
      ddIds: [orderInfo.id],
      bjId: detail.id,
      returnUrl: '/parent/home',
      xsId: children[0].student_userid,
      kcmc: title,
      amount: orderInfo.DDFY,
    });
    if (res.status === 'ok') {
      setUrlPath(res.data);
    }
  };
  const handleCancle = async () => {
    const res = await deleteKHXSDD({ id: orderInfo.id });
    const { DDZT } = orderInfo;
    if (res.status === 'ok') {
      message.success(`订单${DDZT === '已过期' ? '删除' : '取消'}成功`);
      history.go(-1);
    } else {
      message.error(res.message);
    }
  };
  const handleFinish = async () => {
    const res = await overdueKHXSDD({ id: orderInfo.id });
    if (res.status === 'ok') {
      const { DDZT, ...rest } = orderInfo;
      setOrderInfo({
        DDZT: '已过期',
        ...rest,
      });
    } else {
      message.error(res.message);
    }
  };
  if (orderInfo) {
    return <div className={styles.OrderDetails}>
      <div className={styles.hender}>
        {orderInfo.DDZT === '待付款' || orderInfo.DDZT === '已过期' ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />}
        {orderInfo.DDZT}
        {orderInfo.DDZT === '待付款' ? <p>请在<Countdown className={styles.countdown} value={deadline} onFinish={handleFinish} />内支付，逾期订单将自动取消</p> : ''}
      </div>
      <div className={styles.content} style={{ marginTop: orderInfo.DDZT === '已付款' ? '-38px' : '-20px' }}>
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
          <p>实付<span>￥{orderInfo.DDFY}</span></p>
        </div>
        <div className={styles.DDXX}>
          <ul>
            <li><span>订单编号</span><span>{orderInfo.DDBH}</span></li>
            <li><span>下单时间</span><span>{moment(orderInfo.XDSJ).format('YYYY-MM-DD hh:mm:ss')}</span></li>
            <li><span>支付方式</span><span>{orderInfo.ZFFS}</span></li>
            {
              orderInfo.DDZT === '已付款' ?
                <><li><span>支付时间</span><span>2021-09-10 12:02:11</span></li>
                </> : ""
            }
          </ul>
        </div>
        {
          orderInfo.DDZT === '待付款' || orderInfo.DDZT === '已过期' ? <div className={styles.buttons}><button onClick={handleCancle}>{orderInfo.DDZT === '待付款' ? '取消' : '删除'}订单</button></div> : ''
        }
      </div>
      {
        orderInfo.DDZT === '待付款' ? <div className={styles.footer}>
          <span>实付:</span><span>￥{orderInfo.DDFY}</span>
          <button className={styles.btn} onClick={handlePay}>去支付</button>
          <Link style={{ visibility: 'hidden' }} ref={linkRef} to={{ pathname: urlPath }}></Link>
        </div> : ''
      }
      {orderInfo.DDZT === '已付款' ?
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
