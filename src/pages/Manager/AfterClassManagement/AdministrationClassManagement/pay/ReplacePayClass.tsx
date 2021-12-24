import { Button, Checkbox, message, Modal, Result, Steps } from 'antd';
import QRCode from 'qrcode.react';
import {
  createKHXSDD,
  deleteKHXSDD,
  getKHXSDD,
  overdueKHXSDD,
  payKHXSDD,
} from '@/services/after-class/khxsdd';
import styles from './index.less';
import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import { enHenceMsg } from '@/utils/utils';
import Countdown from 'antd/lib/statistic/Countdown';

import moment from 'moment';

const { Step } = Steps;
const ReplacePayClass = (props: {
  key: string,
  XSFWBJ: any;
  XSJBSJId: string,
  XM: string,
  XSFWKHBJs: any
}) => {
  // const { BjDetails, JFTotalost, setModalVisible, modalVisible, DJFXS } = props;

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [BmCurrent, setBmCurrent] = useState(0);
  // const [XGJF, setXGJF] = useState(false);
  const [FkHref, setFkHref] = useState<any>();
  const [OrderId, setOrderId] = useState<string>();
  const [Times, setTimes] = useState<any>();
  const [PaymentCG, setPaymentCG] = useState('待支付');
  const [OrderDetails, setOrderDetails] = useState<any>();
  // const [BJMC, setBJMC] = useState<any>();
  // const [XSMC, setXSMC] = useState<any>();

  const { key, XSFWBJ, XSJBSJId, XM, XSFWKHBJs } = props;
  const newDDFY = XSFWBJ.KHFWBJ.FWFY;
  const XSFWBJId = XSFWBJ.id;
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const getOrder = async () => {
    // 付费
    const data: API.CreateKHXSDD = {
      XDSJ: new Date().toISOString(),
      ZFFS: '线上支付',
      DDZT: '待付款',
      DDFY: newDDFY,
      XSJBSJId: XSJBSJId,
      XSFWBJId: XSFWBJId,
      DDLX: 2,
    };
    const res = await createKHXSDD(data);

    if (res.status === 'ok') {
      setOrderId(res.data!.id!);
      if (Number(newDDFY) > 0) {
        const orderTime = new Date(moment(res.data!.XDSJ).format('YYYY/MM/DD HH:mm:ss')).getTime();
        setTimes(orderTime + 1000 * 60 * 30);
        const result = await payKHXSDD({
          ddIds: [res.data!.id!],
          // bjId: BjDetails?.id,
          xsId: XSJBSJId,
          kcmc: XSFWBJ?.KHFWBJ?.FWMC,
          amount: newDDFY,
          XXJBSJId: currentUser?.xxId,
          returnUrl: `${window.location.origin}`,
        });
        if (result.status === 'ok') {
          setFkHref(result.data);
        } else {
          enHenceMsg(result.message);
        }
      }
    } else {
      message.error(res.message);
    }
  };


  useEffect(() => {
    if (OrderId) {
      (async () => {
        const res = await getKHXSDD({
          id: OrderId!,
        });
        if (res.status === 'ok') {
          setOrderDetails(res.data);
        }
      })();
    }
  }, [OrderId, BmCurrent]);

  // const onChanges = (e: any) => {
  //   setXGJF(e.target.checked);
  // };
  // 付款完成接口
  const onClickFK = async () => {
    const res = await getKHXSDD({
      id: OrderId!,
    });
    if (res.status === 'ok') {
      if (res.data?.DDZT === '待付款') {
        message.warning('您暂未付款，请先扫码支付');
      } else if (res.data?.DDZT === '已付款') {
        setPaymentCG('已付款');
      }
    }
  };




  const onOkChange = async () => {
    // setBJMC('');
    // setXSMC('');
    // setXGJF(false);
    // setXZBXSId(undefined);
    // setXZBXSDatas([]);
    setBmCurrent(0);
    setModalVisible(false);

    if (PaymentCG !== '待付款') {
      await deleteKHXSDD({ id: OrderId! });
    }
  };
  const handleFinish = async () => {
    setPaymentCG('已过期');
    await overdueKHXSDD({ id: OrderId! });
  };


  // 付款
  const FKDIV = () => {
    if (PaymentCG === '待支付') {
      return (
        <>
          <p>
            请在
            <Countdown
              className={styles.countdown}
              value={Times}
              format="HH:mm:ss"
              onFinish={handleFinish}
            />
            内，用微信扫码支付，逾期订单将自动取消
          </p>
          <div className={styles.wraps}>
            {FkHref ? (
              <div>
                <QRCode className={styles.QRCodeQrCode} value={FkHref} size={140} />
              </div>
            ) : (
              <></>
            )}
          </div>{' '}
          <Button type="primary" onClick={onClickFK} className={styles.ZFWC}>
            支付完成
          </Button>
        </>
      );
    } else if (PaymentCG === '已付款') {
      return (
        <div>
          <Result status="success" title="支付成功" />
          <Button type="primary" className={styles.ZFCG}>
            下一步
          </Button>
        </div>
      );
    } else if (PaymentCG === '已过期') {
      return (
        <div>
          <Result
            title="支付超时，订单已自动取消，请重新报名"
            extra={
              <Button type="primary" key="console" onClick={onOkChange} className={styles.ZFCG}>
                关闭
              </Button>
            }
          />
        </div>
      );
    }
    return ''
  };
  const WCDIV = () => {
    return (
      <>
        <div className={styles.details}>
          <div className={styles.wraps}>
            <div>
              <p>
                <span>服务名称</span>
                <span>{XSFWBJ?.KHFWBJ?.FWMC}</span>{' '}
              </p>
              <p>
                <span>课程班</span>
                <span>{XSFWKHBJs?.filter(
                  (item: any) => item?.KHBJSJ?.KCFWBJs?.[0]?.LX === 0,
                ).map((item: any) => {
                  return <span key={item?.KHBJSJ?.id
                  }> {item?.KHBJSJ?.BJMC}</span>;
                })}</span>{' '}
              </p>
              <p>
                <span>辅导班</span>
                <span>{XSFWKHBJs?.filter(
                  (item: any) => item?.KHBJSJ?.KCFWBJs?.[0]?.LX === 1,
                ).map((item: any) => {
                  return <span key={item?.KHBJSJ?.id
                  }> {item?.KHBJSJ?.BJMC}</span>;
                })}</span>{' '}
              </p>
              <p>
                <span>上课地点</span>
                <span>本校</span>{' '}
              </p>
              <p>
                <span>总课时</span>
                {/* <span>{BjDetails?.KSS}</span>{' '} */}
              </p>
              <div className={styles.line} />
              {/* <p>
                <span>行政班级</span> <span>{BJMC}</span>
              </p> */}
              <p>
                <span>学生</span> <span>{XM}</span>
              </p>
            </div>
            <div>
              <p>
                <span>订单编号</span>
                <span>{OrderDetails?.DDBH}</span>{' '}
              </p>
              <p>
                <span>下单时间</span>
                <span>{OrderDetails?.XDSJ}</span>{' '}
              </p>
              <p>
                <span>支付方式</span>
                <span>{OrderDetails?.ZFFS}</span>{' '}
              </p>
              <p>
                <span>支付时间</span>
                <span>{OrderDetails?.ZFSJ || '-'}</span>{' '}
              </p>
              <div className={styles.line} />
              <p>
                <span>课后服务费用</span> <span>{newDDFY}</span>
              </p>

              <p>
                <span>实付：</span> <span>￥{OrderDetails?.DDFY}</span>
              </p>
            </div>
          </div>
          <Button type="primary" onClick={onOkChange}>
            确定
          </Button>
        </div>
      </>
    );
  };
  const getDiv = () => {

    if (BmCurrent === 0) {
      //付费
      return <div className={styles.PaymentCode}>{FKDIV()}</div>;
    }
    if (BmCurrent === 1) {
      // 完成
      return WCDIV();
    }
    return ''

  };
  useEffect(() => {
    if (modalVisible && XSJBSJId && XSFWBJ) {
      getOrder()
    }
  }, [modalVisible])
  return (
    <>
      <a onClick={() => { setModalVisible(true) }}>代缴费</a>
      <Modal
        key={key}
        title="代缴费"
        visible={modalVisible}
        className={styles.BmModel}
        onOk={() => {
          setModalVisible(false);
        }}
        footer={null}
        onCancel={onOkChange}
        maskClosable={false}
        destroyOnClose
      >
        <>
          <Steps current={BmCurrent}>
            <Step key="付款缴费" title="付款缴费" />
            <Step key="完成报名" title="完成报名" />
          </Steps>
          {getDiv()}

          {/* <div className={styles.stepsAction}>
            {BjDetails?.KHKCJCs?.length > 0 && BmCurrent === 1 && PaymentCG === '未付款' ? (
              <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                上一步
              </Button>
            ) : (
              <></>
            )}
            {BjDetails?.KHKCJCs?.length > 0 && BmCurrent === 0 && (
              <Button type="primary" onClick={() => next()}>
                下一步
              </Button>
            )}
          </div> */}
        </>
      </Modal>
    </>
  );
};
export default ReplacePayClass;
