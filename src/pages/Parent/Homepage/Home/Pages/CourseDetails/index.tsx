/* eslint-disable no-plusplus */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Checkbox, Divider, message, Modal, Popconfirm, Radio } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { useModel, Link, history } from 'umi';
import styles from './index.less';
import { getKHKCSJ } from '@/services/after-class/khkcsj';
import { enHenceMsg, getQueryString } from '@/utils/utils';
import moment from 'moment';
import { createKHXSDD } from '@/services/after-class/khxsdd';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import noPic from '@/assets/noPic.png';
import GoBack from '@/components/GoBack';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getXXTZGG } from '@/services/after-class/xxtzgg';

const CourseDetails: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [BJ, setBJ] = useState<string>();
  const [FY, setFY] = useState<number>(0);
  const [state, setstate] = useState(false);
  const [KcDetail, setKcDetail] = useState<any>();
  const [orderInfo, setOrderInfo] = useState<any>();
  const [classDetail, setClassDetail] = useState<any>();
  const [kaiguan, setKaiguan] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const courseid = getQueryString('courseid');
  const index = getQueryString('index');
  const curDate: Date = new Date();
  const myDate: Date = new Date(moment(curDate).format('YYYY/MM/DD'));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [Xystate, setXystate] = useState(false);
  const [JFstate, setJFstate] = useState(false);
  const [JFData, setJFData] = useState([]);
  const [JFTotalost, setJFTotalost] = useState<number>(0);
  const [KHFUXY, setKHFUXY] = useState<any>();

  const changeStatus = (ind: number, data?: any) => {
    const detail = data || KcDetail;
    const current = detail.KHBJSJs![ind];
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
  useEffect(() => {
    if (courseid) {
      getWxData();
      (async () => {
        const res = await queryXNXQList(currentUser?.xxId);
        if (res.current) {
          const result = await getKHKCSJ({
            kcId: courseid,
            XXJBSJId: currentUser?.xxId,
            XNXQId: res.current.id,
          });
          if (result.status === 'ok') {
            if (result.data) {
              setKcDetail(result.data);
              changeStatus(0, result.data);
              const kcstart = moment(result.data.BMKSSJ).format('YYYY/MM/DD');
              const kcend = moment(result.data.BMJSSJ).format('YYYY/MM/DD');
              const btnEnable = myDate >= new Date(kcstart) && myDate <= new Date(kcend);
              setKaiguan(btnEnable);
              const NewArr: any[] = [];
              result.data.KHBJSJs.forEach((value: any) => {
                if (value.BJZT === '已开班') {
                  NewArr.push(value);
                }
              });
              let num = 0;
              for (let i = 0; i < NewArr?.[0].KHKCJCs.length; i++) {
                num += Number(NewArr?.[0].KHKCJCs[i].JCFY);
              }
              setJFTotalost(num);
              setJFData(NewArr[0].KHKCJCs);
            }
          } else {
            enHenceMsg(result.message);
          }
        }
      })();
    }
  }, [courseid]);
  useEffect(() => {
    (async () => {
      const res = await getXXTZGG({
        BT: '',
        LX: ['课后服务协议'],
        XXJBSJId: currentUser?.xxId,
        ZT: ['已发布'],
        page: 0,
        pageSize: 0,
      });
      if (res.status === 'ok') {
        const { rows = [] } = res.data || {};
        setKHFUXY(rows[0]?.NR || '');
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
    const bjInfo = KcDetail.KHBJSJs.find((item: any) => {
      return item.id === BJ;
    });
    await setClassDetail(bjInfo);
    const data: API.CreateKHXSDD = {
      XDSJ: new Date().toISOString(),
      ZFFS: '线上支付',
      DDZT: '待付款',
      DDFY: JFstate === true ? JFTotalost! + Number(FY)! : Number(FY)!,
      XSId: localStorage.getItem('studentId') || currentUser?.student[0].student_userid || '20210901',
      XSXM: localStorage.getItem('studentName') || currentUser?.student[0].name || '张三',
      KHBJSJId: BJ!,
      XXJBSJId: currentUser?.xxId,
      DDLX: 0,
    };
    const res = await createKHXSDD(data);
    if (res.status === 'ok') {
      if (data.DDFY > 0) {
        setOrderInfo(res.data);
      } else {
        message.success('报名成功');
        history.push('/parent/home?index=index');
      }
    } else {
      enHenceMsg(res.message);
    }
  };
  const butonclick = (value: any, ind: number) => {
    setJFData(value.KHKCJCs);
    let num = 0;
    for (let i = 0; i < value.KHKCJCs.length; i++) {
      num += Number(value.KHKCJCs[i].JCFY);
    }
    setJFTotalost(num);
    changeStatus(ind);
  };

  /** 课后帮服务协议弹出框 */
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
    // eslint-disable-next-line no-console
    setXystate(e.target.checked);
  };
  const onJFChange = (e: { target: { checked: any } }) => {
    setJFstate(e.target.checked);
  };
  return (
    <div className={styles.CourseDetails}>
      {index === 'all' ? (
        <GoBack title={'课程简介'} />
      ) : (
        <GoBack title={'课程简介'} onclick="/parent/home?index=index" />
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
          <li>上课地点：本校</li>
        </ul>
        <p className={styles.title}>课程简介</p>
        <p className={styles.content}>{KcDetail?.KCMS}</p>
        <Divider />
        <p className={styles.content}>开设班级：</p>
        <ul className={styles.classInformation}>
          {KcDetail?.KHBJSJs &&
            KcDetail?.KHBJSJs.map((value: any) => {
              if (value.BJZT === '已开班') {
                return (
                  <li>
                    <div style={{ paddingBottom: '10px' }}>
                      <p className={styles.bjname}>
                        <span>{value.BJMC}</span>
                      </p>
                      <p className={styles.bzrname}>
                        班主任：
                        {value?.KHBJJs?.map((item: any) => {
                          if (item.JSLX.indexOf('副') === -1) {
                            return <span style={{ marginRight: '1em' }}>{item.KHJSSJ?.XM}</span>;
                          }
                          return '';
                        })}
                      </p>
                      <p className={styles.bzrname}>
                        副班：
                        {value?.KHBJJs?.map((item: any) => {
                          if (item.JSLX.indexOf('主') === -1) {
                            return <span style={{ marginRight: '1em' }}>{item.KHJSSJ?.XM}</span>;
                          }
                          return '';
                        })}
                      </p>
                      <p>
                        {' '}
                        报名时段：{moment(value.BMKSSJ).format('YYYY.MM.DD')}-
                        {moment(value.BMJSSJ).format('YYYY.MM.DD')}
                      </p>
                      <p>
                        {' '}
                        上课时段：{moment(value.KKRQ).format('YYYY.MM.DD')}-
                        {moment(value.JKRQ).format('YYYY.MM.DD')}
                      </p>
                      <table>
                        <thead>
                          <tr>
                            <th>课时数</th>
                            <th>总人数</th>
                            <th>报名费</th>
                            <th>上课时间</th>
                            <th>上课地点</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{value.KSS}课时</td>
                            <td>{value.BJRS}人</td>
                            <td>{value.FY}元</td>
                            <td style={{ padding: '2px 0' }}>
                              {value?.KHPKSJs?.map(
                                (val: { FJSJ: any; XXSJPZ: any; WEEKDAY: number }) => {
                                  const weeks = `每周${'日一二三四五六'.charAt(val.WEEKDAY)}`;
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
                              {value?.KHPKSJs?.map(
                                (val: { FJSJ: any; XXSJPZ: any; WEEKDAY: number }) => {
                                  return <p>{val.FJSJ.FJMC}</p>;
                                },
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </li>
                );
              }
              return '';
            })}
        </ul>
      </div>
      <div className={styles.footer}>
        {kaiguan ? (
          <button className={styles.btn} onClick={() => setstate(true)}>
            立即报名
          </button>
        ) : (
          <button className={styles.btnes}>课程不在报名时间范围内</button>
        )}
      </div>
      {state === true ? (
        <div className={styles.payment} onClick={() => setstate(false)}>
          <div onClick={onchanges}>
            <p className={styles.title}>{KcDetail?.KCMC}</p>
            <p className={styles.price}>
              {FY <= 0 ? (
                <>
                  <span>￥{FY}</span>
                  <span>/学期</span>
                </>
              ) : (
                <span>免费</span>
              )}
            </p>
            <p className={styles.title} style={{ fontSize: '14px' }}>
              班级
            </p>
            <Radio.Group onChange={onBJChange} value={`${BJ}+${FY}`}>
              {KcDetail?.KHBJSJs?.map(
                (
                  value: {
                    BJMC: string;
                    id: string;
                    FJS: string;
                    FY: string;
                    BMKSSJ: Date;
                    BMJSSJ: Date;
                    BJRS: number;
                    KHXSBJs: any[];
                    BJZT: string;
                  },
                  ind: number,
                ) => {
                  const text = `${value.BJMC}已有${value.KHXSBJs.length}人报名，共${value.BJRS}个名额`;
                  const valueName = `${value.id}+${value.FY}`;
                  const start = value.BMKSSJ ? value.BMKSSJ : KcDetail.BMKSSJ;
                  const end = value.BMKSSJ ? value.BMJSSJ : KcDetail.BMJSSJ;
                  const enAble =
                    myDate >= new Date(moment(start).format('YYYY/MM/DD')) &&
                    myDate <= new Date(moment(end).format('YYYY/MM/DD'));
                  if (value.BJZT === '已开班') {
                    return (
                      <Popconfirm
                        overlayClassName={styles.confirmStyles}
                        placement="bottom"
                        title={text}
                        defaultVisible={BJ === value.id}
                      >
                        <Radio.Button
                          value={valueName}
                          style={{ marginRight: '14px' }}
                          disabled={!enAble}
                          onClick={() => butonclick(value, ind)}
                        >
                          {value.BJMC}
                        </Radio.Button>
                      </Popconfirm>
                    );
                  }
                  return '';
                },
              )}
            </Radio.Group>
            <div className={styles.Teachingaterial}>
              {!JFData?.length ? (
                <></>
              ) : (
                <div
                  className={styles.box}
                  style={{ borderRadius: JFstate === true ? '8px 8px 0 0' : '8px' }}
                >
                  <Checkbox onChange={onJFChange} checked={JFstate}>
                    <span>选购教辅</span>
                  </Checkbox>
                  {JFTotalost <= 0 ? <div>免费</div> : <div>￥{JFTotalost?.toFixed(2)}</div>}
                </div>
              )}
              <div className={styles.tables}>
                {JFstate === true ? (
                  <>
                    {JFData ? (
                      <>
                        {JFData?.map((value: any) => {
                          return (
                            <div>
                              <div>{value.JCMC}</div>
                              {value.JCFY <= 0 ? <div>免费</div> : <div>￥{value.JCFY}</div>}
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        {KcDetail?.KHBJSJs?.[0].KHKCJCs?.map((value: any) => {
                          return (
                            <div>
                              <div>{value.JCMC}</div>
                              {value.JCFY <= 0 ? <div>免费</div> : <div>￥{value.JCFY}</div>}
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
            <div className={styles.agreement}>
              <Checkbox onChange={onFxChange} checked={Xystate}>
                <span>我已阅读并同意</span>
              </Checkbox>
              <a onClick={showModal}>《课后服务协议》</a>
            </div>
            <Button className={styles.submit} disabled={!Xystate} onClick={submit}>
              {JFTotalost! + Number(FY) <= 0 ? '提交' : '提交并付款'}
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
          <Button key="submit" type="primary" onClick={handleOk}>
            确定
          </Button>,
        ]}
      >
        <p>课后服务协议书</p>
        <div dangerouslySetInnerHTML={{ __html: KHFUXY }} />
      </Modal>
    </div>
  );
};

export default CourseDetails;
