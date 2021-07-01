/* eslint-disable array-callback-return */
import React from 'react';
import { message, Tabs } from 'antd';
import styles from './index.less';
import { Link, useModel, } from 'umi';
import { useState } from 'react';
import { useEffect } from 'react';
import { deleteKHXSDD, payKHXSDD } from '@/services/after-class/khxsdd';

const { TabPane } = Tabs;

const OrderList = (props: { data?: any[] }) => {
    const { data } = props;
    const { initialState } = useModel('@@initialState');
    const { currentUser } = initialState || {};
    const children = currentUser?.subscriber_info?.children || [{
        student_userid: currentUser?.userId,
        njId: '1'
      }];
    const handlePay = async (d: any) => {
        const res = await payKHXSDD({
          ddIds: [d.id],
          bjId: d.KHBJSJ.id,
          returnUrl: '/parent/home',
          xsId: '23' || children[0].student_userid,
          kcmc: d.KHBJSJ.KHKCSJ.KCMC,
          amount: d.DDFY,
        });
        console.log(res);
    
      };
      const handleCancle = async (d: any) => {
        const res = await deleteKHXSDD({ id: d.id });
        const { DDZT } = d;
        if (res.status === 'ok') {
          message.success(`订单${DDZT === '已过期' ? '删除' : '取消'}成功`);
        } else {
          message.error(res.message);
        }
      };
    return <>
        {data && data.length ? data.map((item) => {
            const { KHBJSJ, ...rest } = item;
            return <div className={styles.Information}>
                <Link to={{
                    pathname: '/parent/mine/orderDetails', state: {
                        title: KHBJSJ.KHKCSJ.KCMC,
                        detail: KHBJSJ,
                        payOrder: { ...rest },
                        user: currentUser
                    }
                }} >
                    <p className={styles.orderNumber}><span>订单编号：{item.DDBH}</span><span style={{ color: '#45C977' }}>{item.DDZT}</span></p>
                    <div className={styles.KCMC}>
                        <p>{item.KHBJSJ.KHKCSJ.KCMC}</p>
                        <span>￥{item.KHBJSJ.FY}</span>
                    </div>
                    {item.DDZT === '已付款' ? <p className={styles.price}>实付: <span>￥{item.DDFY}</span></p> : ''}
                </Link>
                {item.DDZT === '待付款' ? <div className={styles.btns}>
                    <button onClick={()=>handleCancle(item)}>取消订单</button>
                    <button onClick={()=>handlePay(item)}>去支付</button>
                </div> : ''}
                {item.DDZT === '已过期' ? <div className={styles.btns}>
                    <button onClick={()=>handleCancle(item)}>删除订单</button>
                </div> : ''}
            </div>
        })
            : <></>}
    </>
};
const Order: React.FC = (props: any) => {
    const { orderInfo, key } = props.location && props.location.state;
    const [valueKey, setValueKey] = useState<string>('toPay');
    useEffect(() => {
        if (key)
            setValueKey(key);
    }, [key])
    return (
        <div className={styles.orderList}>
            <Tabs type="card" defaultActiveKey={valueKey}>
                <TabPane tab="全部" key="total">
                    <OrderList data={orderInfo} />
                </TabPane>
                <TabPane tab="待付款" key="toPay">
                    <OrderList data={orderInfo?.filter((item: { DDZT: string; }) => item.DDZT === '待付款')} />
                </TabPane>
                <TabPane tab="已付款" key="paid">
                    <OrderList data={orderInfo?.filter((item: { DDZT: string; }) => item.DDZT === '已付款')} />
                </TabPane>
            </Tabs>
        </div>
    )
};


export default Order;
