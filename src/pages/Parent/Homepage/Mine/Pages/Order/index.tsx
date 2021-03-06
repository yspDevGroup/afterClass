/* eslint-disable array-callback-return */
import React from 'react';
import { message, Tabs } from 'antd';
import styles from './index.less';
import { Link, useModel } from 'umi';
import { useState } from 'react';
import { useEffect } from 'react';
import { deleteKHXSDD, getStudentOrders } from '@/services/after-class/khxsdd';
import { enHenceMsg, getQueryObj } from '@/utils/utils';
import noOrder from '@/assets/noOrder.png';
import Nodata from '@/components/Nodata';
import GoBack from '@/components/GoBack';
import MobileCon from '@/components/MobileCon';

const { TabPane } = Tabs;

const OrderList = (props: {
  data?: any[];
  children: any[];
  currentUser?: CurrentUser;
  triggerEvt: (param: any[]) => Promise<any>;
}) => {
  const { data, children, currentUser, triggerEvt } = props;
  const handlePay = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const par = (e.target as HTMLButtonElement).closest('div[class*="Information"]');
    (par?.children[0] as HTMLElement)?.click();
  };
  const handleCancle = async (d: any) => {
    const res = await deleteKHXSDD({ id: d.id });
    const { DDZT } = d;
    if (res.status === 'ok') {
      message.success(`订单${DDZT === '已过期' ? '删除' : '取消'}成功`);
      triggerEvt(children);
    } else {
      enHenceMsg(res.message);
    }
  };
  return (
    <>
      {data && data.length ? (
        data.map((item) => {
          const { KHBJSJ, KHXXZZFW, ...rest } = item;
          const color = item.DDZT === '已付款' ? '#15B628' : '#888';
          return (
            <div key={item.id} className={styles.Information}>
              <Link
                to={{
                  pathname: '/parent/mine/orderDetails',
                  state: {
                    title: KHBJSJ?.KHKCSJ.KCMC || item?.XSFWBJ?.KHFWBJ?.FWMC,
                    detail: KHBJSJ,
                    payOrder: { ...rest },
                    user: currentUser,
                    KKRQ: KHBJSJ?.KHKCSJ.KKRQ,
                    JKRQ: KHBJSJ?.KHKCSJ.JKRQ,
                    fwdetail: KHXXZZFW || item?.XSFWBJ,
                  },
                }}
              >
                <p className={styles.orderNumber}>
                  <span>订单编号：{item.DDBH}</span>
                  <span style={{ color: item.DDZT === '待付款' ? '#f00' : color }}>
                    {item.DDZT}
                  </span>
                </p>
                <div className={styles.KCMC}>
                  <p>
                    {item.KHBJSJ?.KHKCSJ?.KCMC || item.KHXXZZFW?.FWMC || item?.XSFWBJ?.KHFWBJ?.FWMC}
                  </p>
                  <span>￥{item?.DDFY || item.KHXXZZFW?.FY}</span>
                </div>
                <p className={styles.orderNumber}>
                  <span>
                    订单类型：
                    {item.DDLX === 0 ? '缤纷课堂' : item.DDLX === 1 ? '订餐&托管' : '课后服务'}
                  </span>
                </p>
                <p className={styles.orderNumber}>
                  <span>下单时间：{item.XDSJ}</span>
                </p>
                {item.DDZT === '已付款' ? (
                  <p className={styles.price}>
                    实付: <span>￥{Number(item.DDFY).toFixed(2)}</span>
                  </p>
                ) : (
                  ''
                )}
              </Link>
              {item.DDZT === '待付款' ? (
                <div className={styles.btns}>
                  <button onClick={() => handleCancle(item)}>取消订单</button>
                  <button onClick={(e) => handlePay(e)}>去支付</button>
                </div>
              ) : (
                ''
              )}
              {item.DDZT === '已过期' ? (
                <div className={styles.btns}>
                  <button onClick={() => handleCancle(item)}>删除订单</button>
                </div>
              ) : (
                ''
              )}
            </div>
          );
        })
      ) : (
        <Nodata imgSrc={noOrder} desc="暂无订单" />
      )}
    </>
  );
};
const Order: React.FC = () => {
  const [orderInfo, setOrderInfo] = useState<any>([]);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { type } = getQueryObj();
  const studentId =
    localStorage.getItem('studentId') ||
    (currentUser?.student && currentUser.student[0].XSJBSJId) ||
    testStudentId;
  const children = [
    {
      student_userid: studentId,
    },
  ];
  const fetch = async () => {
    const res = await getStudentOrders({
      XSJBSJId:
        localStorage.getItem('studentId') || currentUser?.student?.[0].XSJBSJId || testStudentId,
    });
    if (res.status === 'ok') {
      setOrderInfo(res.data);
    }
  };
  useEffect(() => {
    fetch();
  }, []);

  return (
    <MobileCon>
      <GoBack title={'订单'} onclick="/parent/home?index=mine" showReFund />
      <div className={styles.orderList}>
        <Tabs type="card" defaultActiveKey={type}>
          <TabPane tab="全部" key="total">
            <OrderList data={orderInfo} currentUser={currentUser} triggerEvt={fetch}>
              {children}
            </OrderList>
          </TabPane>
          <TabPane tab="待付款" key="toPay">
            <OrderList
              data={orderInfo?.filter((item: API.KHXSDD) => item.DDZT === '待付款')}
              currentUser={currentUser}
              triggerEvt={fetch}
            >
              {children}
            </OrderList>
          </TabPane>
          <TabPane tab="已完成" key="paid">
            <OrderList
              data={orderInfo?.filter((item: API.KHXSDD) => item.DDZT === '已付款')}
              currentUser={currentUser}
              triggerEvt={fetch}
            >
              {children}
            </OrderList>
          </TabPane>
        </Tabs>
      </div>
    </MobileCon>
  );
};

export default Order;
