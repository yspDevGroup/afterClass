import React, { useEffect, useState } from 'react';
import { Badge, Divider, Modal } from 'antd';
import moment from 'moment';
import { enHenceMsg, getQueryObj } from '@/utils/utils';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import GoBack from '@/components/GoBack';
import ShowName from '@/components/ShowName';
import { getKHBJSJ } from '@/services/after-class/khbjsj';
import noPic from '@/assets/noPic1.png';
import noData from '@/assets/noCourse1.png';

import styles from './index.less';
import { getKCBSKSJ } from '@/services/after-class/kcbsksj';
import { convertTimeTable, ParentHomeData } from '@/services/local-services/mobileHome';
import { getAllKHJSCQ } from '@/services/after-class/khjscq';
import { useModel } from 'umi';
import Nodata from '@/components/Nodata';
import MobileCon from '@/components/MobileCon';

const Detail: React.FC = () => {
  const [classDetail, setClassDetail] = useState<any>();
  const [timetableList, setTimetableList] = useState<any[]>();
  const [isLoading, setIsLoading] = useState(false);
  const { classid, index } = getQueryObj('classid');
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const claim = getQueryObj().status;
  const userId = currentUser.JSId || testTeacherId;

  const fetchData = async (bjid: string) => {
    const res = await getKHBJSJ({ id: bjid });
    if (res.status === 'ok') {
      if (res.data) {
        setClassDetail(res.data);
      }
    } else {
      enHenceMsg(res.message);
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
    getWxData();
    if (classid) {
      fetchData(classid);
    }
  }, [classid]);

  useEffect(() => {
    async function fetchDatas() {
      if (classid) {
        const oriData = await ParentHomeData(
          'teacher',
          currentUser?.xxId,
          currentUser.JSId || testTeacherId,
        );
        const { courseSchedule } = oriData;
        const classInfo = courseSchedule.find((item: { KHBJSJId: string }) => {
          return item.KHBJSJId === classid;
        });

        if (claim && claim === '自选课' && classid) {
          const resulta = await getKCBSKSJ({
            KHBJSJId: [classid],
          });
          if (resulta.status === 'ok' && resulta.data) {
            const { rows } = resulta.data;
            let days: any[] = [];
            if (rows?.length) {
              days = [].map.call(rows, (v: { XXSJPZId: string; SKRQ: string }, i) => {
                return {
                  index: i + 1,
                  jcId: v.XXSJPZId,
                  day: v.SKRQ,
                };
              });
            }
            // 获取课程班教师出勤数据
            const res = await getAllKHJSCQ({
              KHBJSJId: classid,
            });
            if (res.status === 'ok' && res.data) {
              const newTime = await convertTimeTable(
                userId,
                classid,
                res.data,
                days,
                currentUser?.xxId,
              );
              setTimetableList(newTime);
            }
          }
        } else {
          // 获取课程班教师出勤数据
          const res = await getAllKHJSCQ({
            KHBJSJId: classid,
            JZGJBSJId: userId,
          });
          if (res.status === 'ok' && res.data) {
            const xxId = currentUser?.xxId;
            const newTime = await convertTimeTable(
              userId,
              classid,
              res.data,
              classInfo?.days,
              xxId,
            );
            setTimetableList(newTime);
          }
        }
      }
    }
    fetchDatas();
  }, [classid, claim]);
  const handleModal = (val: any) => {
    let content = {};
    if (val.otherInfo) {
      const { LX, TKJC, TKRQ, SKJS, DKJS, BZ } = val.otherInfo;
      if (LX === 1) {
        content = {
          title: '代课说明',
          content: `由于${SKJS.XM}${BZ},本节课临时调整为${DKJS.XM}老师上课,请知悉.`,
        };
      } else {
        content = {
          title: '调课说明',
          content: `由于${BZ},本节课临时调整到${TKRQ}日${TKJC?.KSSJ?.substring(
            0,
            5,
          )}-${TKJC?.JSSJ?.substring(0, 5)}上课,请知悉.`,
        };
      }
      Modal.info({
        width: '90vw',
        ...content,
      });
    } else if (val.tag) {
      if (val.tag === '假') {
        content = {
          title: '请假说明',
          content: ` 教师请假，本节课程安排取消，之后课程顺延,请知悉.`,
        };
      } else {
        content = {
          title: '调课说明',
          content: `本节课临时调整到${val.realDate}日${val.start?.substring(
            0,
            5,
          )}-${val.end?.substring(0, 5)}上课,请知悉.`,
        };
      }
      Modal.info({
        width: '90vw',
        ...content,
      });
    }
  };

  return (
    <MobileCon>
      <div className={styles.CourseDetails}>
        {index === 'all' ? (
          <GoBack title={'课程简介'} teacher />
        ) : (
          <GoBack title={'课程简介'} onclick="/teacher/home?index=index" teacher />
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

          <ul>
            <li>
              上课时段：{moment(classDetail?.KKRQ).format('YYYY.MM.DD')}~
              {moment(classDetail?.JKRQ).format('YYYY.MM.DD')}
            </li>
            <li>上课地点：{classDetail?.XQName || '本校'}</li>
          </ul>
          <p className={styles.title}>课程简介</p>
          <p className={styles.content}>{classDetail?.KHKCSJ?.KCMS || '—'}</p>
          <Divider />
          <ul className={styles.classInformation}>
            <li>授课班级：{classDetail?.BJMC}</li>
            {classDetail?.KHBJJs?.find((items: any) => items?.JSLX === '主教师') ? (
              <li className={styles.bzrname}>
                主班：
                {classDetail?.KHBJJs.map((item: any) => {
                  if (item.JSLX.indexOf('副') === -1) {
                    return (
                      <span style={{ marginRight: '1em' }}>
                        <ShowName
                          XM={item.JZGJBSJ.XM}
                          type="userName"
                          openid={item.JZGJBSJ?.WechatUserId}
                        />
                      </span>
                    );
                  }
                  return '';
                })}
              </li>
            ) : (
              <></>
            )}
            {classDetail?.KHBJJs?.find((items: any) => items?.JSLX === '副教师') ? (
              <li className={styles.bzrname}>
                副班：
                {classDetail?.KHBJJs.map((item: any) => {
                  if (item.JSLX.indexOf('主') === -1) {
                    return (
                      <span style={{ marginRight: '1em' }}>
                        <ShowName
                          type="userName"
                          openid={item.JZGJBSJ?.WechatUserId}
                          XM={item.JZGJBSJ.XM}
                        />
                      </span>
                    );
                  }
                  return '';
                })}
              </li>
            ) : (
              <></>
            )}
          </ul>
        </div>
        <div className={styles.Timetable}>
          <p className={styles.title}>
            <span>课程表</span>
            <span style={{ textAlign: 'right' }}>
              <Badge className={`${styles.legend} ${styles.legend1}`} color="#FFF" text="出勤" />
              <Badge className={styles.legend} color="#2196F3" text="今日" />
              <Badge className={styles.legend} color="#89DA8C" text="待上" />
              <br />
              <Badge className={styles.legend} color="#F48A82" text="缺勤" />
              <Badge className={styles.legend} color="#AC90FB" text="调课" />
              <Badge className={styles.legend} color="#7A8990" text="代课" />
              <Badge className={styles.legend} color="#F2C862" text="请假" />
            </span>
          </p>
          <div className={styles.cards}>
            {!(timetableList?.length === 0) ? (
              timetableList?.map((value) => {
                let style: any;
                switch (value.status) {
                  case '缺席':
                    style = {
                      background: 'rgba(244, 138, 130, 0.2)',
                      color: '#666',
                    };
                    break;
                  case '调课':
                  case '已调课':
                    style = {
                      background: 'rgba(172, 144, 251, 0.2)',
                      color: '#666',
                    };
                    break;
                  case '代课':
                    style = {
                      background: 'rgba(122, 137, 144, 0.2)',
                      color: '#666',
                    };
                    break;
                  case '请假':
                  case '已请假':
                    style = {
                      background: 'rgba(242, 200, 98, 0.2)',
                      color: '#666',
                    };
                    break;
                  case '今日':
                    style = {
                      background: '#2196F3',
                      color: '#fff',
                    };
                    break;
                  case '出勤':
                    style = {
                      background: '#fff',
                      color: '#999',
                    };
                    break;
                  default:
                    break;
                }
                return (
                  <div
                    key={value.index}
                    className={styles.card}
                    style={style}
                    onClick={() => handleModal(value)}
                  >
                    <p>
                      {value.tag && value.tag === '假'
                        ? `【${value.tag}】`
                        : `第${value.index + 1}节`}
                    </p>
                    <p>{moment(value.day).format('MM/DD')}</p>
                  </div>
                );
              })
            ) : (
              <Nodata imgSrc={noData} desc="暂无课表" />
            )}
          </div>
        </div>
      </div>
    </MobileCon>
  );
};

export default Detail;
