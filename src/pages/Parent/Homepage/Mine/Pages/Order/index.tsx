/* eslint-disable array-callback-return */
import React from 'react';
import { message, Tabs } from 'antd';
import styles from './index.less';
import { Link, useModel, } from 'umi';
import { useState } from 'react';
import { useEffect } from 'react';
import { deleteKHXSDD, getAllKHXSDD, payKHXSDD } from '@/services/after-class/khxsdd';
import { getQueryString } from '@/utils/utils';
import noData from '@/assets/noData.png';

const { TabPane } = Tabs;

const OrderList = (props: { data?: any[], children: any[], currentUser?: API.CurrentUser, triggerEvt: (param: any[]) => Promise<any> }) => {
    const { data, children, currentUser, triggerEvt } = props;
    const handlePay = async (d: any) => {
        const res = await payKHXSDD({
            ddIds: [d.id],
            bjId: d.KHBJSJ.id,
            returnUrl: '/parent/home',
            xsId: '23' || children && children[0].student_userid,
            kcmc: d.KHBJSJ.KHKCSJ.KCMC,
            amount: d.DDFY,
        });
        if (res.status === 'ok') {
            window.open(res.data);
        }
    };
    const handleCancle = async (d: any) => {
        const res = await deleteKHXSDD({ id: d.id });
        const { DDZT } = d;
        if (res.status === 'ok') {
            message.success(`订单${DDZT === '已过期' ? '删除' : '取消'}成功`);
            triggerEvt(children);
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
                    <p className={styles.orderNumber}>
                        <span>订单编号：{item.DDBH}</span>
                        {
                            item.DDZT==='已付款'?<span style={{ color: '#45C977' }}>{item.DDZT}</span>:(item.DDZT==='待付款'?<span style={{ color: 'red' }}>{item.DDZT}</span>:<span style={{ color: '#eee' }}>{item.DDZT}</span>)
                        }
                        
                    </p>
                    <div className={styles.KCMC}>
                        <p>{item.KHBJSJ.KHKCSJ.KCMC}</p>
                        <span>￥{item.KHBJSJ.FY}</span>
                    </div>
                    {item.DDZT === '已付款' ? <p className={styles.price}>实付: <span>￥{item.DDFY}</span></p> : ''}
                </Link>
                {item.DDZT === '待付款' ? <div className={styles.btns}>
                    <button onClick={() => handleCancle(item)}>取消订单</button>
                    <button onClick={() => handlePay(item)}>去支付</button>
                </div> : ''}
                {item.DDZT === '已过期' ? <div className={styles.btns}>
                    <button onClick={() => handleCancle(item)}>删除订单</button>
                </div> : ''}
            </div>
        })
            : <></>}
    </>
};
const Order: React.FC = () => {
    const [valueKey, setValueKey] = useState<string>('toPay');
    const [orderInfo, setOrderInfo] = useState<API.KHXSDD[]>([]);
    const { initialState } = useModel('@@initialState');
    const { currentUser } = initialState || {};
    const children = currentUser?.subscriber_info?.children || [{
        student_userid: currentUser?.userId,
        njId: '1'
    }];
    const fetch = async (param: any[]) => {
        const res = await getAllKHXSDD({
            XSId: param[0].student_userid,
            njId: param[0].njId,
            DDZT: ''
        });
        if (res.status === 'ok') {
            if (res.data) {
                setOrderInfo(res.data);
            }
        } else {
            message.warning(res.message)
        }
    };
    useEffect(() => {
        fetch(children);
        const type = getQueryString("type");
        if (type) {
            setValueKey(type);
        }
    }, []);

    return (
        <div className={styles.orderList}>
            <Tabs type="card" defaultActiveKey={valueKey}>
                <TabPane tab="全部" key="total">
                    {!(orderInfo.length === 0) ? <OrderList data={orderInfo} children={children} currentUser={currentUser} triggerEvt={fetch} /> :
                        <div style={{ textAlign: 'center', background: "#eee", borderRadius: '8px', paddingBottom: '10px', width: '100%' }}>
                            <img src={noData} alt="暂无数据" />
                            <h4 style={{ color: '#999' }}>暂无订单</h4>
                        </div>}
                </TabPane>
                <TabPane tab="待付款" key="toPay">
                    {
                        !((orderInfo?.filter((item: API.KHXSDD) => item.DDZT === '待付款')).length === 0) ? <OrderList data={orderInfo?.filter((item: API.KHXSDD) => item.DDZT === '待付款')} children={children} currentUser={currentUser} triggerEvt={fetch} /> :
                            <div style={{ textAlign: 'center', background: "#eee", borderRadius: '8px', paddingBottom: '10px', width: '100%' }}>
                                <img src={noData} alt="暂无数据" />
                                <h4 style={{ color: '#999' }}>暂无待付款</h4>
                            </div>
                    }
                </TabPane>
                <TabPane tab="已付款" key="paid">
                    {
                        !((orderInfo?.filter((item: API.KHXSDD) => item.DDZT === '已付款')).length === 0) ? <OrderList data={orderInfo?.filter((item: API.KHXSDD) => item.DDZT === '已付款')} children={children} currentUser={currentUser} triggerEvt={fetch} /> :
                            <div style={{ textAlign: 'center', background: "#eee", borderRadius: '8px', paddingBottom: '10px', width: '100%' }}>
                                <img src={noData} alt="暂无数据" />
                                <h4 style={{ color: '#999' }}>暂无已付款</h4>
                            </div>
                    }

                </TabPane>
            </Tabs>
        </div>
    )
};


export default Order;
