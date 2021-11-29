import { Button, Checkbox, message, Modal, Result, Steps } from 'antd';
import QRCode from 'qrcode.react';
import {
  createKHXSDD,
  deleteKHXSDD,
  getKHXSDD,
  overdueKHXSDD,
  payKHXSDD,
} from '@/services/after-class/khxsdd';
import styles from '../index.less';
import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import { enHenceMsg } from '@/utils/utils';
import Countdown from 'antd/lib/statistic/Countdown';

import moment from 'moment';

const { Step } = Steps;
const ReplacePay = (props: {
  BjDetails: any;
  JFTotalost: any;
  ModalVisible: any;
  setModalVisible: any;
  DJFXS?: string;
  onsetKHXSBJs: any;
}) => {
  const { BjDetails, JFTotalost, setModalVisible, ModalVisible, DJFXS } = props;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [BmCurrent, setBmCurrent] = useState(0);
  const [XGJF, setXGJF] = useState(false);
  const [FkHref, setFkHref] = useState<any>();
  const [OrderId, setOrderId] = useState<string>();
  const [Times, setTimes] = useState<any>();
  const [PaymentCG, setPaymentCG] = useState('待支付');
  const [OrderDetails, setOrderDetails] = useState<any>();
  const [BJMC, setBJMC] = useState<any>();
  const [XSMC, setXSMC] = useState<any>();

  const getOrder = async () => {
    let newDDFY;
    if (XGJF) {
      newDDFY = Number(JFTotalost) + Number(BjDetails?.FY);     
    } else {
      newDDFY = Number(BjDetails?.FY);     
    }

    // 付费
    const data: API.CreateKHXSDD = {
      XDSJ: new Date().toISOString(),
      ZFFS: '线上支付',
      DDZT: '待付款',
      DDFY: newDDFY,
      XSJBSJId: DJFXS,
      KHBJSJId: BjDetails?.id,
      DDLX: 0,
    };
    const res = await createKHXSDD(data);

    if (res.status === 'ok') {
      setOrderId(res.data!.id!);
      if (Number(newDDFY) > 0) {
        const orderTime = new Date(moment(res.data!.XDSJ).format('YYYY/MM/DD HH:mm:ss')).getTime();
        setTimes(orderTime + 1000 * 60 * 30);
        const result = await payKHXSDD({
          ddIds: [res.data!.id!],
          bjId: BjDetails?.id,
          xsId: DJFXS,
          kcmc: BjDetails?.KHKCSJ?.KCMC,
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
    // 没有教辅直接生成缴费二维码
    if (BjDetails?.KHKCJCs?.length === 0 && DJFXS) {
      getOrder();
    }
  }, [DJFXS]);

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

  const onChanges = (e: any) => {
    setXGJF(e.target.checked);
  };
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

  const next = async () => {
    setBmCurrent(BmCurrent + 1);
    if (BmCurrent === 0 && BjDetails?.KHKCJCs?.length > 0) {
      getOrder();
    }
  };

  const prev = () => {
    setBmCurrent(BmCurrent - 1);
  };
  const onOkChange = async () => {
    setBJMC('');
    setXSMC('');
    setXGJF(false);
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

  //教辅
  const JFDIV = () => {
    return (
      <>
        <div className={styles.JF}>
          <div className={styles.checkbox}>
            <div>
              <Checkbox onChange={onChanges}>选购教辅？</Checkbox>
            </div>
            <div>
              费用总计：<span>￥{JFTotalost}</span>{' '}
            </div>
          </div>
          <div>
            <div>
              <div>名称</div>
              <div>费用</div>
            </div>
            {BjDetails?.KHKCJCs?.map((value: any) => {
              return (
                <div className={styles.JFXX}>
                  <div>{value?.JCMC}</div>
                  <div>￥{value?.JCFY}</div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
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
          <Button type="primary" onClick={() => next()} className={styles.ZFCG}>
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
  };
  const WCDIV = () => {
    return (
      <>
        <div className={styles.details}>
          <div className={styles.wraps}>
            <div>
              <p>
                <span>课程名称</span>
                <span>{BjDetails?.KHKCSJ?.KCMC}</span>{' '}
              </p>
              <p>
                <span>上课班级</span>
                <span>{BjDetails?.BJMC}</span>{' '}
              </p>
              <p>
                <span>上课时段</span>
                <span>
                  {BjDetails?.KKRQ}~{BjDetails?.JKRQ}
                </span>{' '}
              </p>
              <p>
                <span>上课地点</span>
                <span>本校</span>{' '}
              </p>
              <p>
                <span>总课时</span>
                <span>{BjDetails?.KSS}</span>{' '}
              </p>
              <div className={styles.line} />
              <p>
                <span>行政班级</span> <span>{BJMC}</span>
              </p>
              <p>
                <span>学生</span> <span>{XSMC}</span>
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
                <span>课程费用</span> <span>{BjDetails?.FY}</span>
              </p>
              <p>
                <span>教辅费用</span>{' '}
                <span>{(Number(OrderDetails?.DDFY) - Number(BjDetails?.FY)).toFixed(2)}</span>
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
    if (BjDetails?.KHKCJCs?.length !== 0) {
      // 存在教辅
      if (BmCurrent === 0) {
        //选择教辅
        return JFDIV();
      }
      if (BmCurrent === 1) {
        // 付费
        return <div className={styles.PaymentCode}>{FKDIV()}</div>;
      }
      if (BmCurrent === 2) {
        // 完成
        return WCDIV();
      }
    } else {
      // 不存在教辅
      if (BmCurrent === 0) {
        //付费
        return <div className={styles.PaymentCode}>{FKDIV()}</div>;
      }
      if (BmCurrent === 1) {
        // 完成
        return WCDIV();
      }
    }
  };
  return (
    <>
      <Modal
        title="代缴费"
        visible={ModalVisible}
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
            {BjDetails?.KHKCJCs?.length !== 0 && <Step key="选购教辅" title="选购教辅" />}
            {Number(BjDetails?.FY) <= 0 && Number(JFTotalost) <= 0 ? (
              <></>
            ) : (
              <>
                <Step key="付款缴费" title="付款缴费" />
              </>
            )}
            <Step key="完成报名" title="完成报名" />
          </Steps>
          {getDiv()}

          <div className={styles.stepsAction}>
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
          </div>
        </>
      </Modal>
    </>
  );
};
export default ReplacePay;
