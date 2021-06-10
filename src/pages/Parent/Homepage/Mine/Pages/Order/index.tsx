/* eslint-disable array-callback-return */
import React from 'react';
import { Tabs } from 'antd';
import styles from './index.less';
import { Link } from 'umi';

const { TabPane } = Tabs;



const Order: React.FC = () => {
    const valueKey = window.location.href.split('id=')[1];
    return (
        <div className={styles.orderList}>
        <Tabs type="card" defaultActiveKey={valueKey}>
          <TabPane tab="全部" key="4">
            <div className={styles.Information}>
                <p className={styles.orderNumber}><span>订单编号：TY20210910000001</span><span style={{color:'#45C977'}}>已完成</span></p>
                <div className={styles.KCMC}>
                    <p>青少年足球兴趣培训课程青少年足球兴趣培训课程</p>
                    <span>￥50.00</span>
                </div>
                <p className={styles.price}>实付: <span>￥50.00</span></p>
                <div className={styles.buttons}>
                <Link to="/parent/mine/orderDetails?id=true">  <span>更多</span></Link>
                    <div>
                        <button>退课退款</button>
                        <button>课程评价</button>
                        <button>申请开票</button>
                    </div>
                </div>
            </div>
            <div className={styles.Information}>
                <p className={styles.orderNumber}><span>订单编号：TY2021542000001</span><span style={{color:'#FF6600'}}>待付款</span></p>
                <div className={styles.KCMC}>
                    <p>青少年足球兴趣培训课程青少年足球兴趣培训课程</p>
                    <span>￥50.00</span>
                </div>
                <div className={styles.btns}>
                        <button>取消订单</button>
                        <button>去支付</button>
                </div>
            </div>
            <div className={styles.Information}>
                <p className={styles.orderNumber}><span>订单编号：TY20210910000001</span><span>已取消</span></p>
                <div className={styles.KCMC}>
                    <p>青少年足球兴趣培训课程青少年足球兴趣培训课程</p>
                    <span>￥50.00</span>
                </div>
                <div className={styles.btns}>
                        <button>删除订单</button>
                </div>
            </div>
            <div className={styles.Information}>
                <p className={styles.orderNumber}><span>订单编号：TY20210910000001</span><span>退款成功</span></p>
                <div className={styles.KCMC}>
                    <p>青少年足球兴趣培训课程青少年足球兴趣培训课程</p>
                    <span>￥50.00</span>
                </div>
                <div className={styles.btns}>
                        <button>删除订单</button>
                        <button>退款详情</button>
                </div>
            </div>
            <div className={styles.Information}>
                <p className={styles.orderNumber}><span>订单编号：TY20210910000001</span><span>退款中</span></p>
                <div className={styles.KCMC}>
                    <p>青少年足球兴趣培训课程青少年足球兴趣培训课程</p>
                    <span>￥50.00</span>
                </div>
                <div className={styles.btns}>
                        <button>退款详情</button>
                </div>
            </div>
          </TabPane>
          <TabPane tab="待付款" key="1">
          <div className={styles.Information}>
                <p className={styles.orderNumber}><span>订单编号：TY2021542000001</span><span style={{color:'#FF6600'}}>待付款</span></p>
                <div className={styles.KCMC}>
                    <p>青少年足球兴趣培训课程青少年足球兴趣培训课程</p>
                    <span>￥50.00</span>
                </div>
                <div className={styles.btns}>
                        <button>取消订单</button>
                        <Link to="/parent/mine/orderDetails?id=false">  <button>去支付</button></Link>
                        
                </div>
            </div>
          </TabPane>
          <TabPane tab="已完成" key="2">
          <div className={styles.Information}>
                <p className={styles.orderNumber}><span>订单编号：TY20210910000001</span><span>已完成</span></p>
                <div className={styles.KCMC}>
                    <p>青少年足球兴趣培训课程青少年足球兴趣培训课程</p>
                    <span>￥50.00</span>
                </div>
                <p className={styles.price}>实付: <span>￥50.00</span></p>
                <div className={styles.buttons}>
                <Link to="/parent/mine/orderDetails?id=true">  <span>更多</span></Link>
                    <div>
                        <button>退课退款</button>
                        <button>课程评价</button>
                        <button>申请开票</button>
                    </div>
                </div>
            </div>
          </TabPane>
          <TabPane tab="退课退款" key="3">
          <div className={styles.Information}>
                <p className={styles.orderNumber}><span>订单编号：TY20210910000001</span><span>退款成功</span></p>
                <div className={styles.KCMC}>
                    <p>青少年足球兴趣培训课程青少年足球兴趣培训课程</p>
                    <span>￥50.00</span>
                </div>
                <div className={styles.btns}>
                        <button>删除订单</button>
                        <button>退款详情</button>
                </div>
            </div>
          <div className={styles.Information}>
                <p className={styles.orderNumber}><span>订单编号：TY20210910000001</span><span>退款中</span></p>
                <div className={styles.KCMC}>
                    <p>青少年足球兴趣培训课程青少年足球兴趣培训课程</p>
                    <span>￥50.00</span>
                </div>
                <div className={styles.btns}>
                        <button>退款详情</button>
                </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    )
};


export default Order;
