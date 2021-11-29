import { Button, Checkbox, message, Modal, Result, Select, Steps } from 'antd';
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
import { getClassStudents, getSchoolClasses } from '@/services/after-class/bjsj';
import WWOpenDataCom from '@/components/WWOpenDataCom';
import Countdown from 'antd/lib/statistic/Countdown';
import moment from 'moment';

const { Option } = Select;
const { Step } = Steps;
const AgentRegistration = (props: {
  curXNXQId: any;
  BjDetails: any;
  JFTotalost: any;
  ModalVisible: any;
  setModalVisible: any;

  onsetKHXSBJs: any;
}) => {
  const { curXNXQId, BjDetails, JFTotalost, setModalVisible, ModalVisible, onsetKHXSBJs } = props;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [BmCurrent, setBmCurrent] = useState(0);
  const [XZBDatas, setXZBDatas] = useState<any>();
  const [XZBXSId, setXZBXSId] = useState<any>();
  const [XZBXSDatas, setXZBXSDatas] = useState<any>();
  const [XGJF, setXGJF] = useState(false);
  const [FkHref, setFkHref] = useState<any>();
  const [OrderId, setOrderId] = useState<string>();
  const [Times, setTimes] = useState<any>();
  const [PaymentCG, setPaymentCG] = useState('待支付');
  const [OrderDetails, setOrderDetails] = useState<any>();
  const [BJMC, setBJMC] = useState<any>();
  const [XSMC, setXSMC] = useState<any>();
  const [DDZFY, setDDZFY] = useState<any>();
  const [Message, setMessage] = useState<any>();

  useEffect(() => {
    (async () => {
      if (curXNXQId) {
        const res = await getSchoolClasses({
          XXJBSJId: currentUser?.xxId,
          XNXQId: curXNXQId,
          XQSJId: BjDetails?.XQSJId,
          njId: '',
          page: 0,
          pageSize: 0,
        });
        if (res.status === 'ok') {
          setXZBDatas(res.data.rows);
        } else {
          message.error(res.message);
        }
      }
    })();
  }, [curXNXQId]);

  useEffect(() => {
    if (OrderId) {
      (async () => {
        if (
          (BmCurrent === 3 && BjDetails?.KHKCJCs?.length !== 0) ||
          (BmCurrent === 2 && BjDetails?.KHKCJCs?.length === 0) ||
          (Number(DDZFY) <= 0 && BmCurrent === 1) ||
          (BjDetails?.KHKCJCs?.length === 0 && BmCurrent === 2) ||
          (Number(BjDetails?.FY) <= 0 && BmCurrent === 2 && Number(JFTotalost) > 0)
        ) {
          const res = await getKHXSDD({
            id: OrderId!,
          });
          if (res.status === 'ok') {
            setOrderDetails(res.data);
          }
        }
      })();
    }
  }, [OrderId, BmCurrent]);
  const handleChange = async (value: any, key: any) => {
    setBJMC(key?.children);
    setXSMC('');
    setXZBXSId(undefined);
    const res = await getClassStudents({
      BJSJId: value,
      XNXQId: curXNXQId,
    });
    if (res.status === 'ok') {
      setXZBXSDatas(res.data.rows);
    }
  };
  const handleChanges = (value: any, key: any) => {
    setXSMC(key.children?.props?.children?.[0].props?.children);
    setXZBXSId(key?.key);
  };
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
    if (typeof XZBXSId !== 'undefined') {
      setBmCurrent(BmCurrent + 1);
      if (Number(BjDetails?.FY) <= 0 && BmCurrent === 1 && Number(JFTotalost) > 0) {
        if (XGJF === true) {
          setBmCurrent(BmCurrent + 1);
        } else {
          setBmCurrent(BmCurrent + 2);
        }
      }
      let DDFY;
      if (XGJF === true) {
        DDFY = Number(JFTotalost) + Number(BjDetails?.FY);
        setDDZFY(DDFY);
      } else {
        DDFY = Number(BjDetails?.FY);
        setDDZFY(DDFY);
      }
      if (
        (BjDetails?.KHKCJCs?.length === 0 && BmCurrent === 0) ||
        (BjDetails?.KHKCJCs?.length !== 0 && BmCurrent === 1) ||
        (Number(DDZFY) <= 0 && BmCurrent === 1) ||
        (BjDetails?.KHKCJCs?.length === 0 && BmCurrent === 2) ||
        (Number(BjDetails?.FY) <= 0 && BmCurrent === 2 && Number(JFTotalost) > 0)
      ) {
        const data: API.CreateKHXSDD = {
          XDSJ: new Date().toISOString(),
          ZFFS: '线上支付',
          DDZT: '待付款',
          DDFY,
          XSJBSJId: XZBXSId,
          KHBJSJId: BjDetails?.id,
          DDLX: 0,
        };
        const res = await createKHXSDD(data);

        if (res.status === 'ok') {
          setOrderId(res.data!.id!);
          if (Number(DDFY) > 0) {
            const orderTime = new Date(
              moment(res.data!.XDSJ).format('YYYY/MM/DD HH:mm:ss'),
            ).getTime();
            setTimes(orderTime + 1000 * 60 * 30);
            const result = await payKHXSDD({
              ddIds: [res.data!.id!],
              bjId: BjDetails?.id,
              xsId: XZBXSId,
              kcmc: BjDetails?.KHKCSJ?.KCMC,
              amount: DDFY,
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
          setMessage(res.message);
        }
      }
    } else {
      message.warning('请选择学生');
    }
  };
  const prev = () => {
    setBmCurrent(BmCurrent - 1);
  };
  const onOkChange = async () => {
    setBJMC('');
    setXSMC('');
    setXGJF(false);
    setXZBXSId(undefined);
    setXZBXSDatas([]);
    setBmCurrent(0);
    setModalVisible(false);
    onsetKHXSBJs();
    if (PaymentCG !== '待付款') {
      await deleteKHXSDD({ id: OrderId! });
    }
  };
  const handleFinish = async () => {
    setPaymentCG('已过期');
    await overdueKHXSDD({ id: OrderId! });
  };
  return (
    <>
      <Modal
        title="代报名"
        visible={ModalVisible}
        className={styles.BmModel}
        onOk={() => {
          setModalVisible(false);
        }}
        footer={null}
        onCancel={onOkChange}
        maskClosable={false}
      >
        <>
          <Steps current={BmCurrent}>
            <Step key="选择学生" title="选择学生" />
            {BjDetails?.KHKCJCs?.length === 0 ? <></> : <Step key="选购教辅" title="选购教辅" />}
            {Number(BjDetails?.FY) <= 0 && Number(JFTotalost) <= 0 ? (
              <></>
            ) : (
              <>
                <Step key="付款缴费" title="付款缴费" />
              </>
            )}
            <Step key="完成报名" title="完成报名" />
          </Steps>
          {BmCurrent === 0 ? (
            <div className={styles.stepsContent}>
              <div className={styles.select}>
                <span>所属行政班：</span>
                <Select showSearch onChange={handleChange} placeholder="请选择" value={BJMC || ''}>
                  {XZBDatas?.map((value: any) => {
                    return (
                      <Option
                        value={`${value?.id}`}
                        key={value?.id}
                        data-value={`${value?.NJSJ?.NJMC}${value?.BJ}`}
                      >{`${value?.NJSJ?.NJMC}${value?.BJ}`}</Option>
                    );
                  })}
                </Select>
              </div>
              <div className={styles.select}>
                <span>学生姓名：</span>
                <Select
                  showSearch
                  onChange={handleChanges}
                  placeholder="搜索姓名或学号"
                  value={XSMC || ''}
                >
                  {XZBXSDatas?.map((value: any) => {
                    const showWXName = value?.XM === '未知' && value?.WechatUserId;
                    return (
                      <Option value={value?.XM + value?.XH} key={value?.id}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>
                            {showWXName ? (
                              <WWOpenDataCom type="userName" openid={value?.WechatUserId} />
                            ) : (
                              value?.XM
                            )}
                          </span>
                          <span>{value?.XH}</span>
                        </div>
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </div>
          ) : (
            <></>
          )}
          {BjDetails?.KHKCJCs?.length !== 0 && BmCurrent === 1 ? (
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
          ) : (
            <></>
          )}
          {BjDetails && Number(DDZFY) <= 0 ? (
            <></>
          ) : (
            <>
              {(BjDetails?.KHKCJCs?.length === 0 && BmCurrent === 1) ||
              (BjDetails?.KHKCJCs?.length !== 0 && BmCurrent === 2) ? (
                <div className={styles.PaymentCode}>
                  {Message === '您已经报名成功，请勿重复报名!' ? (
                    <Result
                      title="您已经报名成功，请勿重复报名!"
                      extra={
                        <Button
                          type="primary"
                          key="console"
                          onClick={onOkChange}
                          className={styles.ZFCG}
                        >
                          关闭
                        </Button>
                      }
                    />
                  ) : (
                    <></>
                  )}
                  {PaymentCG === '待支付' && Message !== '您已经报名成功，请勿重复报名!' ? (
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
                  ) : (
                    <></>
                  )}
                  {PaymentCG === '已付款' ? (
                    <div>
                      <Result status="success" title="支付成功" />
                      <Button type="primary" onClick={() => next()} className={styles.ZFCG}>
                        下一步
                      </Button>
                    </div>
                  ) : (
                    <></>
                  )}
                  {PaymentCG === '已过期' ? (
                    <div>
                      <Result
                        title="支付超时，订单已自动取消，请重新报名"
                        extra={
                          <Button
                            type="primary"
                            key="console"
                            onClick={onOkChange}
                            className={styles.ZFCG}
                          >
                            关闭
                          </Button>
                        }
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <></>
              )}
            </>
          )}
          {(Number(DDZFY) <= 0 && BmCurrent === 1 && Number(JFTotalost) <= 0) ||
          (BjDetails?.KHKCJCs?.length !== 0 && BmCurrent === 3) ||
          (BjDetails?.KHKCJCs?.length === 0 && BmCurrent === 2) ||
          (Number(BjDetails?.FY) <= 0 && BmCurrent === 3 && Number(JFTotalost) > 0) ? (
            <div className={styles.details}>
              {Message === '您已经报名成功，请勿重复报名!' ? (
                <Result
                  title="您已经报名成功，请勿重复报名!"
                  extra={
                    <Button
                      type="primary"
                      key="console"
                      onClick={onOkChange}
                      className={styles.ZFCG}
                    >
                      关闭
                    </Button>
                  }
                />
              ) : (
                <>
                  {' '}
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
                        <span>
                          {(Number(OrderDetails?.DDFY) - Number(BjDetails?.FY)).toFixed(2)}
                        </span>
                      </p>
                      <p>
                        <span>实付：</span> <span>￥{OrderDetails?.DDFY}</span>
                      </p>
                    </div>
                  </div>
                  <Button type="primary" onClick={onOkChange}>
                    确定
                  </Button>
                </>
              )}
            </div>
          ) : (
            <></>
          )}

          <div className={styles.stepsAction}>
            {BjDetails?.KHKCJCs?.length !== 0 && BmCurrent === 1 ? (
              <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                上一步
              </Button>
            ) : (
              <></>
            )}
            {BmCurrent < (BjDetails?.KHKCJCs?.length === 0 ? 1 : 2) && (
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
export default AgentRegistration;
