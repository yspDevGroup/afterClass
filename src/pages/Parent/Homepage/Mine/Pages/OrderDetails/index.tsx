/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable array-callback-return */
import React, { useEffect, useRef, useState } from 'react';
import { history, useModel } from 'umi';
import QRCode from 'qrcode.react';
import { Button, message, Modal, Statistic } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { overdueKHXSDD, deleteKHXSDD, payKHXSDD, getKHXSDD } from '@/services/after-class/khxsdd';
import moment from 'moment';
import styles from './index.less';
import { enHenceMsg, envjudge } from '@/utils/utils';
import GoBack from '@/components/GoBack';
import MobileCon from '@/components/MobileCon';

const { Countdown } = Statistic;
const OrderDetails: React.FC = (props: any) => {
  const [orderInfo, setOrderInfo] = useState<any>();
  const [urlPath, setUrlPath] = useState<any>();
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { title, detail, payOrder, user, KKRQ, JKRQ, fwdetail } = props.location.state;
  const name = user?.subscriber_info?.remark || user?.username;
  const [visible, setVisible] = useState<boolean>(false);
  const isWepay = envjudge() === 'wx-mobile' || envjudge() === 'com-wx-mobile';
  useEffect(() => {
    setOrderInfo(payOrder);
  }, [payOrder]);
  useEffect(() => {
    if (urlPath) {
      if (isWepay) {
        linkRef.current?.click();
      } else {
        setVisible(true);
      }
    }
  }, [urlPath]);

  const handlePay = async () => {
    const res = await payKHXSDD({
      ddIds: [orderInfo.id],
      bjId: detail.id,
      xsId:
        localStorage.getItem('studentId') || currentUser?.student?.[0]?.XSJBSJId || testStudentId,
      kcmc: title,
      amount: orderInfo.DDFY,
      XXJBSJId: currentUser?.xxId,
      returnUrl: `${window.location.origin}/parent/home?index=index`,
    });
    if (res.status === 'ok') {
      setUrlPath(res.data);
    } else {
      enHenceMsg(res.message);
    }
  };
  const handleFWPay = async () => {
    const result = await payKHXSDD({
      returnUrl: `${window.location.origin}/parent/home?index=index`,
      kcmc: fwdetail?.FWMC || fwdetail?.KHFWBJ.FWMC,
      ddIds: [orderInfo.id],
      xsId:
        localStorage.getItem('studentId') || currentUser?.student?.[0]?.XSJBSJId || testStudentId,
      amount: orderInfo?.DDFY,
      XXJBSJId: currentUser?.xxId,
    });
    if (result.status === 'ok') {
      setUrlPath(result.data);
    } else {
      enHenceMsg(result.message);
    }
  };
  const handleCancle = async () => {
    const res = await deleteKHXSDD({ id: orderInfo.id });
    const { DDZT } = orderInfo;
    if (res.status === 'ok') {
      message.success(`订单${DDZT === '已过期' ? '删除' : '取消'}成功`);
      history.go(-1);
    } else {
      enHenceMsg(res.message);
    }
  };

  // // 付款完成接口
  const onClickFK = async () => {
    if (orderInfo?.id) {
      const res = await getKHXSDD({
        id: orderInfo.id,
      });
      if (res.status === 'ok') {
        if (res.data?.DDZT === '待付款') {
          message.warning('您暂未付款，请先扫码支付');
        } else if (res.data?.DDZT === '已付款') {
          history.push('/parent/home?index=index');
        }
      }
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
      enHenceMsg(res.message);
    }
  };

  if (orderInfo) {
    const orderTime = new Date(moment(orderInfo?.XDSJ).format('YYYY/MM/DD HH:mm:ss')).getTime();
    const deadline = orderTime + 1000 * 60 * 30;
    const JFJG = Number(orderInfo?.DDFY) - Number(detail?.FY);
    return (
      <MobileCon>
        <GoBack title={'订单详情'} />
        <div className={styles.OrderDetails}>
          <div className={styles.hender}>
            {orderInfo.DDZT === '待付款' || orderInfo.DDZT === '已过期' ? (
              <ExclamationCircleOutlined />
            ) : (
              <CheckCircleOutlined />
            )}
            {orderInfo.DDZT}
            {orderInfo.DDZT === '待付款' ? (
              <p>
                请在
                <Countdown
                  className={styles.countdown}
                  value={deadline}
                  format="HH:mm:ss"
                  onFinish={handleFinish}
                />
                内支付，逾期订单将自动取消
              </p>
            ) : (
              ''
            )}
          </div>
          <div
            className={styles.content}
            style={{ marginTop: orderInfo.DDZT === '已付款' ? '-38px' : '-20px' }}
          >
            {detail ? (
              <div className={styles.KCXX}>
                <p className={styles.title}>{title}</p>
                <ul>
                  <li>
                    上课时段：
                    {detail.KKRQ
                      ? moment(detail.KKRQ).format('YYYY.MM.DD')
                      : moment(KKRQ).format('YYYY.MM.DD')}
                    ~
                    {detail.JKRQ
                      ? moment(detail.JKRQ).format('YYYY.MM.DD')
                      : moment(JKRQ).format('YYYY.MM.DD')}
                  </li>
                  <li>上课地点：本校</li>
                  <li>总课时：{detail.KSS}</li>
                  <li>班级：{detail.BJMC}</li>

                  <li>
                    学生：
                    <span className={styles.xx}>
                      {localStorage.getItem('studentName') || currentUser?.student?.[0].name}
                    </span>
                  </li>
                </ul>
              </div>
            ) : (
              <div className={styles.FWXX}>
                <ul>
                  <p className={styles.title}>{fwdetail?.FWMC || fwdetail?.KHFWBJ?.FWMC}</p>
                  <li>
                    服务时段：
                    {moment(fwdetail?.KSRQ || fwdetail?.KHFWSJPZ?.KSRQ).format('YYYY.MM.DD')}~
                    {moment(fwdetail?.JSRQ || fwdetail?.KHFWSJPZ?.JSRQ).format('YYYY.MM.DD')}
                  </li>
                  <li>
                    学生：
                    <span className={styles.xx}>
                      {localStorage.getItem('studentName') || currentUser?.student?.[0].name}
                    </span>
                  </li>
                </ul>
              </div>
            )}

            {detail ? (
              <div className={styles.KCZE}>
                <p>
                  <span>课程总额</span> <span>￥{Number(detail?.FY).toFixed(2)}</span>
                </p>
                {Number(orderInfo.DDFY) === Number(detail?.FY) ? (
                  <></>
                ) : (
                  <p className={styles.JFFY}>
                    <span>教辅费用</span> <span>￥{JFJG.toFixed(2)}</span>
                  </p>
                )}

                <p>
                  实付<span>￥{Number(orderInfo.DDFY).toFixed(2)}</span>
                </p>
              </div>
            ) : (
              <div className={styles.KCZE}>
                <p>
                  <span>服务总额</span>{' '}
                  <span>
                    ￥{Number(fwdetail?.FY || fwdetail?.FWFY || fwdetail?.KHFWBJ?.FWFY).toFixed(2)}
                  </span>
                </p>
                <p>
                  实付<span>￥{Number(orderInfo.DDFY).toFixed(2)}</span>
                </p>
              </div>
            )}

            <div className={styles.DDXX}>
              <ul>
                <li>
                  <span>订单编号</span>
                  <span>{orderInfo.DDBH}</span>
                </li>
                <li>
                  <span>下单时间</span>
                  <span>{moment(orderInfo.XDSJ).format('YYYY.MM.DD HH:mm:ss')}</span>
                </li>
                <li>
                  <span>支付方式</span>
                  <span>{orderInfo.ZFFS}</span>
                </li>
                {orderInfo.DDZT === '已付款' ? (
                  <>
                    <li>
                      <span>支付时间</span>
                      <span>{moment(orderInfo.ZFSJ).format('YYYY.MM.DD HH:mm:ss')}</span>
                    </li>
                  </>
                ) : (
                  ''
                )}
              </ul>
            </div>
            {orderInfo.DDZT === '待付款' || orderInfo.DDZT === '已过期' ? (
              <div className={styles.buttons}>
                <button onClick={handleCancle}>
                  {orderInfo.DDZT === '待付款' ? '取消' : '删除'}订单
                </button>
              </div>
            ) : (
              ''
            )}
          </div>
          {orderInfo.DDZT === '待付款' ? (
            <div className={styles.footer}>
              <span>实付:</span>
              <span>￥{Number(orderInfo.DDFY).toFixed(2)}</span>
              {detail ? (
                <button className={styles.btn} onClick={handlePay}>
                  去支付
                </button>
              ) : (
                <button className={styles.btn} onClick={handleFWPay}>
                  去支付
                </button>
              )}

              <a style={{ visibility: 'hidden' }} ref={linkRef} href={urlPath} />
            </div>
          ) : (
            ''
          )}
        </div>

        {/* 弹出支付二维码 */}
        <Modal
          visible={visible}
          // onOk={handleOk}
          onCancel={() => {
            setVisible(false);
          }}
          bodyStyle={{
            height: '250px',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexDirection: 'column',
          }}
          closable={false}
          className={styles.showagreement}
          footer={[
            <Button
              shape="round"
              key="submit"
              onClick={() => {
                setVisible(false);
              }}
            >
              取消支付
            </Button>,
            <Button shape="round" key="submit" type="primary" onClick={onClickFK}>
              支付完成
            </Button>,
          ]}
        >
          <h3> 用微信扫码支付，逾期订单将自动取消</h3>
          {urlPath && (
            <div>
              <QRCode className={styles.QRCodeQrCode} value={urlPath} size={140} />
            </div>
          )}
        </Modal>
      </MobileCon>
    );
  }
  return <></>;
};

export default OrderDetails;
