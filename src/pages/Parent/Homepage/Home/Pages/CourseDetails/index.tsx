/* eslint-disable no-plusplus */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Checkbox, Collapse, Divider, message, Modal, Radio } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { useModel, Link, history } from 'umi';
import { enHenceMsg, getQueryObj } from '@/utils/utils';
import moment from 'moment';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import noPic from '@/assets/noPic.png';
import GoBack from '@/components/GoBack';
import ShowName from '@/components/ShowName';
import styles from './index.less';
import { signClass } from '@/services/after-class/xsjbsj';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getXXTZGG } from '@/services/after-class/xxtzgg';
import { getClassesByCourse } from '@/services/after-class/khkcsj';
import { getKHBJSJ, studentRegistration } from '@/services/after-class/khbjsj';
import { createKHXSDD } from '@/services/after-class/khxsdd';
import { RightOutlined } from '@ant-design/icons';
import { ParentHomeData } from '@/services/local-services/mobileHome';
import noOrder from '@/assets/noOrder.png';
import GroupS from '@/assets/GroupS.png';
import MobileCon from '@/components/MobileCon';

const { Panel } = Collapse;

const CourseDetails: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { student } = currentUser || {};
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const StorageXSId =
    localStorage.getItem('studentId') || (student && student[0].XSJBSJId) || testStudentId;
  const StorageNjId =
    localStorage.getItem('studentNjId') || (student && student[0].NJSJId) || testStudentNJId;
  const StorageXQSJId =
    localStorage.getItem('studentXQSJId') || currentUser?.student?.[0].XQSJId || testStudentXQSJId;
  const [BJ, setBJ] = useState<string>();
  const [FY, setFY] = useState<number>(0);
  const [state, setstate] = useState(false);
  const [KcDetail, setKcDetail] = useState<any>();
  const [orderInfo, setOrderInfo] = useState<any>();
  const [classDetail, setClassDetail] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ModalVisible, setModalVisible] = useState(false);
  const [Xystate, setXystate] = useState(false);
  const [JFstate, setJFstate] = useState(false);
  const [JFData, setJFData] = useState([]);
  const [JFTotalost, setJFTotalost] = useState<number>(0);
  const [KHFUXY, setKHFUXY] = useState<any>();
  const [BjDetails, setBjDetails] = useState<any>();
  const [KBClass, setKBClass] = useState<any>([]);
  const { courseid, index } = getQueryObj();
  // const curDate: Date = new Date();
  // const myDate: Date = new Date(moment(curDate).format('YYYY/MM/DD'));

  const changeStatus = (ind: number, data?: any) => {
    const detail = data || KBClass;
    const current = detail[ind];
    setFY(current.FY);
    setBJ(current.id);
  };
  const getWxData = async () => {
    if (/MicroMessenger/i.test(navigator.userAgent)) {
      await initWXConfig(['checkJsApi']);
    }
    await initWXAgentConfig(['checkJsApi']);
    setIsLoading(true);
  };
  useEffect(() => {
    getWxData();
  }, [isLoading]);
  const XSbjId =
    localStorage.getItem('studentBJId') || currentUser?.student?.[0].BJSJId || testStudentBJId;
  useEffect(() => {
    if (courseid) {
      getWxData();
      (async () => {
        const res = await queryXNXQList(currentUser?.xxId);
        if (res.current) {
          const results = await getClassesByCourse({
            KHKCSJId: courseid,
            XNXQId: res.current.id,
          });
          if (results.status === 'ok') {
            if (results.data) {
              const newArr = results.data.KHBJSJs.filter((value: any) => {
                if (
                  value.BJZT === '?????????' &&
                  value.BJLX === 1 &&
                  value.XQSJId === StorageXQSJId &&
                  value?.ISFW === 0 &&
                  value?.BMZT === 1
                ) {
                  const newBjIds = value.BJSJs.filter((items: any) => {
                    return items.id === XSbjId;
                  });
                  if (newBjIds.length) {
                    return value;
                  }
                }
                return (
                  value.BJZT === '?????????' &&
                  value.BJLX === 0 &&
                  value.XQSJId === StorageXQSJId &&
                  value?.ISFW === 0 &&
                  value?.BMZT === 1
                );
              });
              setKBClass(newArr);
              setKcDetail(results.data);
              changeStatus(0, newArr);
              const resgetKHBJSJ = await getKHBJSJ({ id: newArr?.[0].id });
              if (resgetKHBJSJ.status === 'ok') {
                setBjDetails(resgetKHBJSJ.data);
                let num = 0;
                for (let i = 0; i < resgetKHBJSJ.data?.KHKCJCs?.length; i++) {
                  num += Number(resgetKHBJSJ.data?.KHKCJCs[i].JCFY);
                }
                setJFData(resgetKHBJSJ.data?.KHKCJCs);
                setJFTotalost(num);
              }
            } else {
              enHenceMsg(results.message);
            }
          }
        }
      })();
    }
  }, [courseid]);
  useEffect(() => {
    (async () => {
      const res = await getXXTZGG({
        BT: '',
        LX: ['??????????????????'],
        XXJBSJId: currentUser?.xxId,
        ZT: ['?????????'],
        page: 0,
        pageSize: 0,
      });
      if (res.status === 'ok') {
        setKHFUXY(res.data?.rows);
      }
    })();
  }, []);

  useEffect(() => {
    if (orderInfo) linkRef.current?.click();
  }, [orderInfo]);
  const onBJChange = (e: any) => {
    const bjId = e.target.value.split('+')[0];
    setBJ(bjId);
    setFY(e.target.value.split('+')[1]);
  };
  const onchanges = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
  };
  const submit = async () => {
    if (BjDetails?.BMLX === 0) {
      const res = await studentRegistration({
        ZT: 3,
        XSJBSJIds: [StorageXSId],
        KHBJSJId: BjDetails?.id,
      });
      if (res.status === 'ok') {
        const repeat = res.data?.find((v: { flag: number }) => {
          return v.flag === 0;
        });
        const wrong = res.data?.find((v: { flag: number }) => {
          return v.flag === 1;
        });
        const different = res.data?.find((v: { flag: number }) => {
          return v.flag === 2;
        });
        if (repeat) {
          message.warning('???????????????????????????????????????');
        } else if (wrong) {
          message.warning('????????????????????????????????????');
        } else if (different) {
          message.warning('???????????????????????????????????????');
        } else {
          const bjId =
            localStorage.getItem('studentBJId') ||
            currentUser?.student?.[0].BJSJId ||
            testStudentBJId;
          await ParentHomeData(
            'student',
            currentUser?.xxId,
            StorageXSId,
            StorageNjId,
            bjId,
            StorageXQSJId,
            true,
          );
          setTimeout(() => {
            message.success('??????????????????????????????');
          }, 500);
          setTimeout(() => {
            history.push('/parent/home?index=index');
          }, 1000);
        }
      }
    } else {
      const bjInfo = KBClass.find((item: any) => {
        return item.id === BJ;
      });
      await setClassDetail(bjInfo);
      const Money = JFstate === true ? JFTotalost! + Number(FY)! : Number(FY)!;
      if (Money > 0) {
        const data: API.CreateKHXSDD = {
          XDSJ: new Date().toISOString(),
          ZFFS: '????????????',
          DDZT: '?????????',
          DDFY: Money,
          XSJBSJId:
            localStorage.getItem('studentId') ||
            currentUser?.student?.[0].XSJBSJId ||
            testStudentId,
          KHBJSJId: BJ!,
          DDLX: 0,
        };
        const res = await createKHXSDD(data);
        if (res.status === 'ok') {
          if (data.DDFY > 0) {
            setOrderInfo(res.data);
          } else {
            const bjId =
              localStorage.getItem('studentBJId') ||
              currentUser?.student?.[0].BJSJId ||
              testStudentBJId;
            await ParentHomeData(
              'student',
              currentUser?.xxId,
              StorageXSId,
              StorageNjId,
              bjId,
              StorageXQSJId,
              true,
            );
            setModalVisible(true);
          }
        } else {
          enHenceMsg(res.message);
        }
      } else {
        const result = await signClass({
          XSJBSJId:
            localStorage.getItem('studentId') ||
            currentUser?.student?.[0].XSJBSJId ||
            testStudentId,
          KHBJSJId: BJ!,
          ZT: 0,
        });
        if (result.status === 'ok') {
          const bjId =
            localStorage.getItem('studentBJId') ||
            currentUser?.student?.[0].BJSJId ||
            testStudentBJId;
          await ParentHomeData(
            'student',
            currentUser?.xxId,
            StorageXSId,
            StorageNjId,
            bjId,
            StorageXQSJId,
            true,
          );
          setModalVisible(true);
        } else {
          enHenceMsg(result.message);
        }
      }
    }
  };
  const butonclick = async (value: any, ind: number) => {
    const res = await getKHBJSJ({ id: value?.id });
    if (res.status === 'ok') {
      setBjDetails(res.data);
      let num = 0;
      for (let i = 0; i < res.data?.KHKCJCs?.length; i++) {
        num += Number(res.data?.KHKCJCs[i].JCFY);
      }
      setJFData(res.data?.KHKCJCs);
      setJFTotalost(num);
      changeStatus(ind);
    }
  };

  /** ?????????????????????????????? */
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
    setXystate(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onFxChange = (e: { target: { checked: any } }) => {
    setXystate(e.target.checked);
  };
  const onJFChange = (e: { target: { checked: any } }) => {
    setJFstate(e.target.checked);
  };
  const callback = async (key: any) => {
    if (key) {
      const res = await getKHBJSJ({ id: key });
      setBjDetails(res.data);
    }
  };

  console.log(KBClass, 'KBClass');
  return (
    <MobileCon>
      <div className={styles.CourseDetails}>
        {index === 'all' ? (
          <GoBack title={'????????????'} />
        ) : (
          <GoBack title={'????????????'} onclick="/parent/home?index=index" />
        )}
        <div className={styles.wrap}>
          {KcDetail?.KCTP && KcDetail?.KCTP.indexOf('http') > -1 ? (
            <img src={KcDetail?.KCTP} alt="" style={{ marginBottom: '18px', height: '200px' }} />
          ) : (
            <div
              style={{
                padding: '10px',
                border: '1px solid #F7F7F7',
                textAlign: 'center',
                marginBottom: '18px',
              }}
            >
              <img style={{ width: '180px', height: 'auto', marginBottom: 0 }} src={noPic} />
            </div>
          )}
          <p className={styles.title}>{KcDetail?.KCMC}</p>

          <ul>
            <li>?????????????????????</li>
          </ul>
          <p className={styles.title}>????????????</p>
          <p className={styles.content}>{KcDetail?.KCMS}</p>
          <Divider />
          <p className={styles.title}>????????????</p>
          {KcDetail ? (
            <Collapse
              defaultActiveKey={KBClass?.[0].id}
              onChange={callback}
              ghost
              className={styles.classInformation}
              accordion
              expandIcon={({ isActive }) => (
                <span>
                  {isActive ? '??????' : '??????'}
                  <RightOutlined rotate={isActive ? 90 : 0} />
                </span>
              )}
              expandIconPosition="right"
            >
              {KBClass?.map((value: any) => {
                if (value?.BJZT === '?????????') {
                  return (
                    <Panel header={value?.BJMC} key={value?.id}>
                      <p>
                        ???????????????{moment(value.KKRQ).format('YYYY.MM.DD')}-
                        {moment(value.JKRQ).format('YYYY.MM.DD')}
                      </p>
                      <p>????????????{value.KSS}??????</p>
                      <p>????????????{value.BJRS}???</p>
                      {BjDetails?.KHBJJs?.find((item: any) => item.JSLX === '?????????') ? (
                        <p>
                          ?????????
                          {BjDetails?.KHBJJs?.map((item: any) => {
                            if (item.JSLX.indexOf('???') === -1) {
                              return (
                                <span style={{ marginRight: '1em' }}>
                                  <ShowName
                                    type="userName"
                                    openid={item?.JZGJBSJ?.WechatUserId}
                                    XM={item?.JZGJBSJ?.XM}
                                  />
                                </span>
                              );
                            }
                            return '';
                          })}
                        </p>
                      ) : (
                        ''
                      )}
                      {BjDetails?.KHBJJs?.find((item: any) => item.JSLX === '?????????') ? (
                        <p>
                          ?????????
                          {BjDetails?.KHBJJs?.map((item: any) => {
                            if (item.JSLX.indexOf('???') === -1) {
                              return (
                                <span style={{ marginRight: '1em' }}>
                                  <ShowName
                                    type="userName"
                                    openid={item?.JZGJBSJ?.WechatUserId}
                                    XM={item.JZGJBSJ?.XM}
                                  />
                                </span>
                              );
                            }
                            return '';
                          })}
                        </p>
                      ) : (
                        ''
                      )}

                      <p>????????????{value.FY}???</p>
                      <p>
                        ???????????????
                        {BjDetails?.BMLX === 0 ? (
                          '??????????????????'
                        ) : (
                          <>{BjDetails?.BMLX === 1 ? '???????????????' : '??????'}</>
                        )}
                      </p>

                      {/* <table>
                      <thead>
                        <tr>
                          <th>????????????</th>
                          <th>????????????</th>
                          <th>?????????</th>
                          <th>?????????</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: '2px 0' }}>
                            {BjDetails?.KHPKSJs?.map(
                              (val: { FJSJ: any; XXSJPZ: any; WEEKDAY: number }) => {
                                const weeks = `??????${'?????????????????????'.charAt(val.WEEKDAY)}`;
                                return (
                                  <p>
                                    {weeks}
                                    {val.XXSJPZ.KSSJ.substring(0, 5)}-
                                    {val.XXSJPZ.JSSJ.substring(0, 5)}
                                  </p>
                                );
                              },
                            )}
                          </td>
                          <td style={{ padding: '2px 0' }}>
                            {BjDetails?.KHPKSJs?.map(
                              (val: { FJSJ: any; XXSJPZ: any; WEEKDAY: number }) => {
                                return <p>{val.FJSJ.FJMC}</p>;
                              },
                            )}
                          </td>
                          <td>{value.KSS}</td>
                          <td>{value.BJRS}</td>
                        </tr>
                      </tbody>
                    </table> */}
                      <p style={{ fontWeight: 'bold' }}>????????????</p>
                      <p className={styles.content}>{BjDetails?.BJMS}</p>
                    </Panel>
                  );
                }
                return <></>;
              })}
            </Collapse>
          ) : (
            <></>
          )}
        </div>
        <MobileCon>
          <div className={styles.footer}>
            <button className={styles.btn} onClick={() => setstate(true)}>
              ????????????
            </button>
          </div>
        </MobileCon>
        {state === true ? (
          <div className={styles.payment} onClick={() => setstate(false)}>
            <div onClick={onchanges}>
              <div className={styles.wraps}>
                <p className={styles.title} style={{ fontSize: 18, marginBottom: 12 }}>
                  {KcDetail?.KCMC}
                </p>
                <p className={styles.title}>????????????</p>
                <Radio.Group onChange={onBJChange} value={`${BJ}+${FY}`}>
                  {KBClass?.map(
                    (
                      value: {
                        BJMC: string;
                        id: string;
                        FY: string;
                        BJRS: number;
                        KHXSBJs: any[];
                        BJZT: string;
                        xs_count?: number;
                        ISFW: number;
                      },
                      ind: number,
                    ) => {
                      const valueName = `${value.id}+${value.FY}`;
                      if (value.BJZT === '?????????' && value?.ISFW === 0) {
                        return (
                          <Radio.Button
                            value={valueName}
                            style={{ marginRight: '14px' }}
                            onClick={() => butonclick(value, ind)}
                          >
                            {value.BJMC}
                          </Radio.Button>
                        );
                      }
                      return '';
                    },
                  )}
                </Radio.Group>
                <p className={styles.title}>????????????</p>
                <p className={styles.price}>
                  {FY <= 0 ? (
                    <>
                      <span>??????</span>
                      <span style={{ color: '#666', marginLeft: 10 }}>
                        ???{BjDetails?.BJRS - BjDetails?.KHXSBJs?.length}?????????
                      </span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontWeight: 'bold', fontSize: '22px' }}>???{FY}</span>
                      <span>/??????</span>
                      <span style={{ color: '#666', marginLeft: 10 }}>
                        ???{BjDetails?.BJRS - BjDetails?.KHXSBJs?.length}?????????
                      </span>
                    </>
                  )}
                </p>
                <p className={styles.title}>????????????</p>
                <span style={{ color: '#666' }}>
                  {BjDetails?.BMLX === 0 ? (
                    '??????????????????'
                  ) : (
                    <>{BjDetails?.BMLX === 1 ? '???????????????' : '??????'}</>
                  )}
                </span>
                <div className={styles.Teachingaterial}>
                  {!JFData?.length ? (
                    <></>
                  ) : (
                    <>
                      <p className={styles.title}>????????????</p>
                      <div
                        className={styles.box}
                        style={{ borderRadius: JFstate === true ? '8px 8px 0 0' : '8px' }}
                      >
                        <Checkbox onChange={onJFChange} checked={JFstate}>
                          <span>????????????</span>
                        </Checkbox>
                        {JFTotalost <= 0 ? <div>??????</div> : <div>???{JFTotalost?.toFixed(2)}</div>}
                      </div>
                    </>
                  )}
                  <div className={styles.tables}>
                    {JFstate === true ? (
                      <>
                        {JFData ? (
                          <>
                            {JFData?.map((value: any) => {
                              return (
                                <div key={value.JCMC}>
                                  <div>{value.JCMC}</div>
                                  {value.JCFY <= 0 ? <div>??????</div> : <div>???{value.JCFY}</div>}
                                </div>
                              );
                            })}
                          </>
                        ) : (
                          <>
                            {KBClass?.[0].KHKCJCs?.map((value: any) => {
                              return (
                                <div key={value.JCMC}>
                                  <div>{value.JCMC}</div>
                                  {value.JCFY <= 0 ? <div>??????</div> : <div>???{value.JCFY}</div>}
                                </div>
                              );
                            })}
                          </>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.agreement}>
                <Checkbox onChange={onFxChange} checked={Xystate}>
                  <span>?????????????????????</span>
                </Checkbox>
                <a onClick={showModal}>????????????????????????</a>
              </div>
              <Button className={styles.submit} disabled={!Xystate} onClick={submit}>
                {JFTotalost! + Number(FY) <= 0 || BjDetails?.BMLX !== 1 ? '??????' : '???????????????'}
              </Button>

              <Link
                style={{ visibility: 'hidden' }}
                ref={linkRef}
                to={{
                  pathname: '/parent/mine/orderDetails',
                  state: {
                    title: KcDetail?.KCMC,
                    detail: classDetail,
                    payOrder: orderInfo,
                    user: currentUser,
                    KKRQ: KcDetail?.KCRQ,
                    JKRO: KcDetail?.KCRQ,
                  },
                }}
              />
            </div>
          </div>
        ) : (
          ''
        )}
        <Modal
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          closable={false}
          bodyStyle={{
            width: 200,
          }}
          className={styles.showagreement}
          footer={[
            <Button shape="round" key="submit" type="primary" onClick={handleOk}>
              ??????
            </Button>,
          ]}
        >
          {KHFUXY?.length !== 0 ? (
            <>
              <p className={styles.title}>?????????????????????</p>
              <div dangerouslySetInnerHTML={{ __html: KHFUXY?.[0].NR }} />
            </>
          ) : (
            <div className={styles.ZWSJ}>
              <img src={noOrder} alt="" />
              <p>????????????????????????</p>
            </div>
          )}
        </Modal>
        <Modal className={styles.SignIn} visible={ModalVisible} footer={null} closable={false}>
          <img src={GroupS} alt="" />
          <h3>????????????</h3>
          <Button
            type="primary"
            onClick={() => {
              history.push('/parent/home?index=index&reload=true');
            }}
          >
            ????????????
          </Button>
        </Modal>
      </div>
    </MobileCon>
  );
};

export default CourseDetails;
