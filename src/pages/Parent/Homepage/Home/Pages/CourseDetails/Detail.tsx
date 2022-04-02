import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { Checkbox } from 'antd';
import { enHenceMsg, getQueryString } from '@/utils/utils';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import noPic from '@/assets/noPic.png';
import GoBack from '@/components/GoBack';
import ShowName from '@/components/ShowName';
import { getKHBJSJ } from '@/services/after-class/khbjsj';
import { getKHPKSJByBJID } from '@/services/after-class/khpksj';
import styles from './index.less';
import { useModel, Link } from 'umi';
import { createKHXSDD } from '@/services/after-class/khxsdd';

const Detail: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { student } = currentUser || {};
  const [classDetail, setClassDetail] = useState<any>();
  const [extra, setExtra] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [FKstate, setFKstate] = useState<any>();
  const [orderInfo, setOrderInfo] = useState<any>();
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const [JFTotalost, setJFTotalost] = useState<number>(0);
  const [JFData, setJFData] = useState([]);
  const [JFstate, setJFstate] = useState(false);
  const classid = getQueryString('classid');
  const index = getQueryString('index');
  const StorageXSId =
    localStorage.getItem('studentId') || (student && student[0].XSJBSJId) || testStudentId;
  const fetchData = async (bjid: string) => {
    const res = await getKHBJSJ({ id: bjid });
    if (res.status === 'ok') {
      if (res.data) {
        setClassDetail(res.data);
        setJFData(res.data?.KHKCJCs);
        let num = 0;
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < res.data?.KHKCJCs?.length; i++) {
          num += Number(res.data?.KHKCJCs[i].JCFY);
        }
        setJFData(res.data?.KHKCJCs);
        setJFTotalost(num);
        const FKZT = res.data.KHXSBJs.find((value: any) => {
          return value.XSJBSJId === StorageXSId;
        });
        setFKstate(FKZT);
      }
    } else {
      enHenceMsg(res.message);
    }
    const res1 = await getKHPKSJByBJID({ id: bjid });
    if (res1.status === 'ok') {
      if (res1.data && res1.data.length) {
        const extraInfo = [].map.call(res1.data, (item: any) => {
          return {
            FJSJ: item.FJSJ,
            XXSJPZ: item.XXSJPZ,
            WEEKDAY: item.WEEKDAY,
          };
        });
        setExtra(extraInfo);
      }
    } else {
      enHenceMsg(res1.message);
    }
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
    if (orderInfo) linkRef.current?.click();
  }, [orderInfo]);
  useEffect(() => {
    if (classid) {
      getWxData();
      fetchData(classid);
    }
    if (FKstate?.ZT !== 3) {
      setJFstate(true);
    }
  }, [classid]);
  const submit = async () => {
    const data: API.CreateKHXSDD = {
      XDSJ: new Date().toISOString(),
      ZFFS: '线上支付',
      DDZT: '待付款',
      DDFY: JFstate === true ? JFTotalost! + Number(classDetail?.FY)! : Number(classDetail?.FY)!,
      XSJBSJId:
        localStorage.getItem('studentId') || currentUser?.student?.[0].XSJBSJId || testStudentId,
      KHBJSJId: classDetail?.id,
      DDLX: 0,
    };
    const res = await createKHXSDD(data);
    if (res.status === 'ok') {
      setOrderInfo(res.data);
    } else {
      enHenceMsg(res.message);
    }
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
        {classDetail?.KHKCSJ?.KCTP && classDetail?.KHKCSJ?.KCTP.indexOf('http') > -1 ? (
          <img
            src={classDetail?.KHKCSJ?.KCTP}
            alt=""
            style={{ marginBottom: '18px', height: '200px' }}
          />
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
        <p className={styles.title}>{classDetail?.KHKCSJ?.KCMC}</p>

        {
          classDetail ? <>   <ul>
            <li>
              上课时段：{moment(classDetail?.KKRQ).format('YYYY.MM.DD')}~
              {moment(classDetail?.JKRQ).format('YYYY.MM.DD')}
            </li>
            <li>上课地点：本校</li>
          </ul>
            <p className={styles.title}>课程简介</p>
            <p className={styles.content}>{classDetail?.KHKCSJ?.KCMS}</p>
            <p className={styles.title}>班级信息</p>
            <ul className={styles.classInformation}>
              <li>所在班级：{classDetail?.BJMC}</li>
              <li>{classDetail?.ISFW === 1 ? '周课时：' : '总课时：'} {classDetail?.KSS}课时</li>
              {
                classDetail?.BJRS !== 0 ? <li>总人数：{classDetail?.BJRS}人</li> : ''
              }
              {
                classDetail?.KHBJJs?.find((items: any) => items.JSLX === '主教师') ?
                  <li className={styles.bzrname}>
                    主班：
                    {classDetail?.KHBJJs.map((item: any) => {
                      if (item.JSLX.indexOf('副') === -1) {
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
                  </li> : <></>
              }
              {
                classDetail?.KHBJJs?.find((items: any) => items.JSLX === '副教师') ?
                  <li className={styles.bzrname}>
                    副班：
                    {classDetail?.KHBJJs.map((item: any) => {
                      if (item.JSLX.indexOf('主') === -1) {
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
                  </li> : <></>
              }
              {
                classDetail?.BJMS === '' ? <></> : <li>班级简介：{classDetail?.BJMS}</li>
              }

              {FKstate?.ZT === 3 ? (
                <li className={styles.bzrname}>报名费：{classDetail?.FY}元</li>
              ) : (
                <></>
              )}
              <li>
                <div className={styles.Teachingaterial}>
                  {!JFData?.length ? (
                    <></>
                  ) : (
                    <div
                      className={styles.box}
                      style={{
                        borderRadius: JFstate === true ? '8px 8px 0 0' : '8px',
                      }}
                    >
                      {FKstate?.ZT === 3 ? (
                        <Checkbox onChange={onJFChange} checked={JFstate}>
                          <span>选购教辅</span>
                        </Checkbox>
                      ) : (
                        <span style={{ fontWeight: 'bold', fontSize: 16 }}>教辅材料</span>
                      )}
                      {JFTotalost <= 0 ? <div>免费</div> : <div>￥{JFTotalost?.toFixed(2)}</div>}
                    </div>
                  )}
                  <div
                    className={styles.tables}
                    style={{
                      maxHeight: FKstate?.ZT !== 3 ? 'initial' : '70px',
                    }}
                  >
                    {JFstate === true ? (
                      <>
                        {JFData ? (
                          <>
                            {JFData?.map((value: any) => {
                              return (
                                <div>
                                  <div className={styles.JCMC}>{value.JCMC}</div>
                                  {value.JCFY <= 0 ? <div>免费</div> : <div>￥{value.JCFY}</div>}
                                </div>
                              );
                            })}
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </li>
            </ul></> : <></>
        }

      </div>
      {FKstate?.ZT === 3 ? (
        <div className={styles.footer}>
          <button className={styles.btn} onClick={submit}>
            付款
          </button>
        </div>
      ) : (
        <></>
      )}
      <Link
        style={{ visibility: 'hidden' }}
        ref={linkRef}
        to={{
          pathname: '/parent/mine/orderDetails',
          state: {
            title: classDetail?.KHKCSJ?.KCMC,
            detail: classDetail,
            payOrder: orderInfo,
            user: currentUser,
            KKRQ: classDetail?.KKRQ,
            JKRO: classDetail?.JKRQ,
          },
        }}
      />
    </div>
  );
};

export default Detail;
