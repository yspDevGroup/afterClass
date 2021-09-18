/* eslint-disable array-callback-return */
import React from 'react';
import { message, Tabs } from 'antd';
import styles from './index.less';
import { Link, useModel } from 'umi';
import { useState } from 'react';
import { useEffect } from 'react';
import { deleteKHXSDD, getAllKHXSDD } from '@/services/after-class/khxsdd';
import { enHenceMsg, getQueryString } from '@/utils/utils';
import noOrder from '@/assets/noOrder.png';
import Nodata from '@/components/Nodata';
import GoBack from '@/components/GoBack';

const { TabPane } = Tabs;

const OrderList = (props: {
  data?: any[];
  children: any[];
  currentUser?: API.CurrentUser;
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
          const { KHBJSJ, ...rest } = item;
          const color = item.DDZT === '已付款' ? '#45C977' : '#888';
          return (
            <div className={styles.Information}>
              <Link
                to={{
                  pathname: '/parent/mine/orderDetails',
                  state: {
                    title: KHBJSJ.KHKCSJ.KCMC,
                    detail: KHBJSJ,
                    payOrder: { ...rest },
                    user: currentUser,
                    KKRQ: KHBJSJ.KHKCSJ.KKRQ,
                    JKRQ: KHBJSJ.KHKCSJ.JKRQ,
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
                  <p>{item.KHBJSJ.KHKCSJ.KCMC}</p>
                  <span>￥{item.KHBJSJ.FY}</span>
                </div>
                <p className={styles.orderNumber}>
                  <span>下单时间：{item.XDSJ}</span>
                </p>
                {item.DDZT === '已付款' ? (
                  <p className={styles.price}>
                    实付: <span>￥{item.DDFY}</span>
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
  const [orderInfo, setOrderInfo] = useState<API.KHXSDD[]>([]);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const type = getQueryString('type') || undefined;
  const children = [
    {
      student_userid: currentUser?.student?.student_userid,
    },
  ];
  const fetch = async (param: any[]) => {
    const res = await getAllKHXSDD({
      XSId: param[0].student_userid,
      DDZT: '',
    });
    if (res.status === 'ok') {
      if (res.data) {
        setOrderInfo(res.data);
      }
    } else {
      enHenceMsg(res.message);
    }
  };
  useEffect(() => {
    fetch(children);
  }, []);
  return (
    <>
      <GoBack title={'订单'} onclick="/parent/home?index=mine" />
      <div className={styles.orderList}>
        <Tabs type="card" defaultActiveKey={type}>
          <TabPane tab="全部" key="total">
            <OrderList
              data={orderInfo}
              children={children}
              currentUser={currentUser}
              triggerEvt={fetch}
            />
          </TabPane>
          <TabPane tab="待付款" key="toPay">
            <OrderList
              data={orderInfo?.filter((item: API.KHXSDD) => item.DDZT === '待付款')}
              children={children}
              currentUser={currentUser}
              triggerEvt={fetch}
            />
          </TabPane>
          <TabPane tab="已完成" key="paid">
            <OrderList
              data={orderInfo?.filter((item: API.KHXSDD) => item.DDZT === '已付款')}
              children={children}
              currentUser={currentUser}
              triggerEvt={fetch}
            />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default Order;
