/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Badge, Modal } from 'antd';
import { getQueryString } from '@/utils/utils';
import moment from 'moment';
import Nodata from '@/components/Nodata';
import GoBack from '@/components/GoBack';
import ShowName from '@/components/ShowName';
import { getAllKHJSCQ } from '@/services/after-class/khjscq';
import { convertTimeTable, ParentHomeData } from '@/services/local-services/mobileHome';
import { getKHBJSJ, getTeachersByBJId } from '@/services/after-class/khbjsj';
import noData from '@/assets/noCourse.png';

import styles from './index.less';
import { getKCBSKSJ } from '@/services/after-class/kcbsksj';

const CourseDetails: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [KcDetail, setKcDetail] = useState<any>();
  const [timetableList, setTimetableList] = useState<any[]>();
  const [mainTeacher, setMainTeacher] = useState<any>();
  const [teacherList, setTeacherList] = useState<any[]>([]);
  const classid = getQueryString('classid');
  const claim = getQueryString('status');
  const path = getQueryString('path');
  const date = getQueryString('date');
  const userId = currentUser.JSId || testTeacherId;
  useEffect(() => {
    async function fetchData() {
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
        if (classInfo) {
          setKcDetail(classInfo.detail[0]);
        } else {
          const res = await getKHBJSJ({
            id: classid,
          });
          if (res.status === 'ok') {
            const { data } = res;
            setKcDetail({
              title: data.KHKCSJ.KCMC,
              xq: '本校',
              address: data.KHPKSJs?.[0]?.FJSJ?.FJMC,
              ...data,
            });
          }
        }
        const result = await getTeachersByBJId({ KHBJSJId: classid });
        if (result.status === 'ok') {
          const list = result.data?.rows;
          if (list?.length) {
            const main = list?.find((item: { JSLX: string }) => item.JSLX === '主教师');
            setMainTeacher(main);
            const otherTeacher = list?.filter((item: { JSLX: string }) => item.JSLX === '副教师');
            setTeacherList(otherTeacher);
          }
        }

        if (claim && claim === '自选课' && classid) {
          const resulta = await getKCBSKSJ({
            KHBJSJId: [classid],
          });
          if (resulta.status === 'ok' && resulta.data) {
            const { rows } = resulta.data;
            let days: any[] = [];
            if (rows?.length) {
              days = [].map.call(rows, (v: { XXSJPZId: string; SKRQ: string }, index) => {
                return {
                  index: index + 1,
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
    fetchData();
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
          content: ` ${
            val.reason ? `由于${val.reason},` : ''
          }本节课程安排取消，之后课程顺延,请知悉.`,
        };
      } else {
        content = {
          title: '调课说明',
          content: `由于${val.reason},本节课临时调整到${val.realDate}日${val.start?.substring(
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
    <div className={styles.CourseDetails2}>
      <GoBack
        title={'课程详情'}
        onclick={`/teacher/home?index=${path || 'index'}&date=${date}`}
        teacher
      />
      <div className={styles.KCXX}>
        {/* 上课时段 */}
        <p className={styles.title}>{KcDetail?.title}</p>
        <ul>
          <ul>
            <li>
              <span>上课时段：</span>
              {moment(KcDetail?.KKRQ).format('YYYY.MM.DD')}~
              {moment(KcDetail?.JKRQ).format('YYYY.MM.DD')}
            </li>
            <li>
              <span>上课地点：</span>
              {KcDetail?.xq} | {KcDetail?.address}
            </li>
            {KcDetail?.KSS ? (
              <li>
                <span>总课时：</span>
                {KcDetail?.KSS}课时
              </li>
            ) : (
              ''
            )}
            <li>
              <span>授课班级：</span>
              {KcDetail?.BJMC}
            </li>
            {mainTeacher ? (
              <li>
                <span>班主任：</span>
                <span className={styles.teacherName}>
                  <ShowName
                    XM={mainTeacher?.JZGJBSJ?.XM}
                    type="userName"
                    openid={mainTeacher?.JZGJBSJ?.WechatUserId}
                  />
                </span>
              </li>
            ) : (
              ''
            )}
            {teacherList && teacherList?.length ? (
              <li>
                <span>副班：</span>
                {teacherList.map((ele) => {
                  return (
                    <span className={styles.teacherName}>
                      <ShowName
                        XM={ele?.JZGJBSJ?.XM}
                        type="userName"
                        openid={ele?.JZGJBSJ?.WechatUserId}
                      />
                    </span>
                  );
                })}
              </li>
            ) : (
              ''
            )}
          </ul>
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
                <div className={styles.card} style={style} onClick={() => handleModal(value)}>
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
  );
};

export default CourseDetails;
