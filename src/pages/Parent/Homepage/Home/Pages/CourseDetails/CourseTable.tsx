/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Badge, Modal } from 'antd';
import { getQueryString } from '@/utils/utils';
import moment from 'moment';
import styles from './index.less';
import noData from '@/assets/noCourse.png';
import Nodata from '@/components/Nodata';
import GoBack from '@/components/GoBack';
import { ParentHomeData } from '@/services/local-services/mobileHome';
import { getAllKHXSCQ } from '@/services/after-class/khxscq';
import { getTeachersByBJId } from '@/services/after-class/khbjsj';
import ShowName from '@/components/ShowName';
import { getKCBSKSJ } from '@/services/after-class/kcbsksj';

const CourseTable: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { student } = currentUser || {};
  const [KcDetail, setKcDetail] = useState<any>();
  const [mainTeacher, setMainTeacher] = useState<any>();
  const [teacherList, setTeacherList] = useState<any[]>([]);
  const [timetableList, setTimetableList] = useState<any[]>();
  const classid = getQueryString('classid');
  const path = getQueryString('path');
  const myDate: Date = new Date();
  const currentDate = moment(myDate).format('YYYY-MM-DD');
  const StorageXSId =
    localStorage.getItem('studentId') || (student && student[0].XSJBSJId) || testStudentId;
  const StorageNjId =
    localStorage.getItem('studentNjId') || (student && student[0].NJSJId) || testStudentNJId;
  const StorageXQSJId =
    localStorage.getItem('studentXQSJId') || currentUser?.student?.[0].XQSJId || testStudentXQSJId;

  useEffect(() => {
    async function fetchData() {
      if (classid) {
        const bjId =
          localStorage.getItem('studentBJId') ||
          currentUser?.student?.[0].BJSJId ||
          testStudentBJId;
        const oriData = await ParentHomeData(
          'student',
          currentUser?.xxId,
          StorageXSId,
          StorageNjId,
          bjId,
          StorageXQSJId,
        );
        const { courseSchedule } = oriData;
        const classInfo = courseSchedule.find((item: { KHBJSJId: string }) => {
          return item.KHBJSJId === classid;
        });
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
        // 获取课程班学生出勤数据
        const res = await getAllKHXSCQ({
          bjId: classid,
          xsId: StorageXSId,
        });
        if (classInfo) {
          setKcDetail(classInfo.detail?.[0]);
        }
        if (res.status === 'ok' && res.data) {
          let totalDays = classInfo?.days || [];
          const results = await getKCBSKSJ({
            KHBJSJId: [classid],
          });
          // console.log(result,'result---');
          if (results.status === 'ok' && results.data) {
            const { rows } = results.data;
            if (rows?.length) {
              totalDays = [].map.call(rows, (v: { XXSJPZId: string, SKRQ: string }, index) => {
                return {
                  index,
                  jcId: v.XXSJPZId,
                  day: v.SKRQ,
                }
              })
            }
          }
          // if (classInfo?.days?.length === 0 && classInfo.detail?.[0]?.KSS === 0) {
          //   const result = await getKCBSKSJ({
          //     KHBJSJId: [classid],
          //   });
          //   if (result.status === 'ok' && result.data) {
          //     const { rows } = result.data;
          //     if (rows?.length) {
          //       totalDays = [].map.call(rows, (v: { XXSJPZId: string, SKRQ: string }, index) => {
          //         return {
          //           index: index + 1,
          //           jcId: v.XXSJPZId,
          //           day: v.SKRQ,
          //         }
          //       })
          //     }
          //   }
          // }
          const dataTable = totalDays?.map((ele: any) => {
            const { day, status, ...rest } = ele;
            let stuStatus: string = '';
            let style: any = {};
            if (new Date(day).getTime() > new Date(currentDate).getTime()) {
              stuStatus = '待上';
              style = {
                background: 'rgba(137, 218, 140, 0.4)',
                color: '#333',
              };
            }
            if (new Date(day).getTime() === new Date(currentDate).getTime()) {
              stuStatus = '今日';
              style = {
                background: '#2196F3',
                color: '#FFF',
              };
            }
            if (new Date(day).getTime() < new Date(currentDate).getTime()) {
              stuStatus = '出勤';
              style = {
                background: '#FFF',
                color: '#999',
                border: '1px solid #DDD',
              };
            }
            if (res.data?.length) {
              const curCQ = res.data.find((item) => item.CQRQ === day);
              if (curCQ) {
                switch (curCQ?.CQZT) {
                  case '请假':
                    style = {
                      background: 'rgba(242, 200, 98, 0.4)',
                      color: '#666',
                    };
                    break;
                  case '缺席':
                    style = {
                      background: 'rgba(244, 138, 130, 0.4)',
                      color: '#666',
                    };
                    break;
                  default:
                    break;
                }
                stuStatus = curCQ?.CQZT || '出勤';
              }
            }
            if (status === '已请假') {
              style = {
                background: 'rgba(122, 137, 144, 0.2)',
                color: '#666',
              };
            }
            if (status === '调课' || status === '已调课') {
              style = {
                background: 'rgba(172, 144, 251, 0.2)',
                color: '#666',
              };
            }
            return {
              day: moment(day).format('MM/DD'),
              status: status || stuStatus,
              style,
              ...rest,
            };
          });
          setTimetableList(dataTable);
        }
      }
    }
    fetchData();
  }, [classid]);
  const handleModal = (val: any) => {
    let content = {};
    if (val.tag) {
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
          content: `由于${val.reason},本节课临时调整到${val.realDate}日${val.start}-${val.end}上课,请知悉.`,
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
      {path ? (
        <GoBack title={'课程详情'} onclick={`/parent/home?index=${path}`} />
      ) : (
        <GoBack title={'课程详情'} />
      )}
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
            {KcDetail?.KSS === 0 || KcDetail?.KSS === null ? (
              ''
            ) : (

              <li>
                <span>{KcDetail?.ISFW === 1 ? '周课时：' : '总课时：'}</span>
                {KcDetail?.KSS}课时
              </li>
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
                    type="userName"
                    openid={mainTeacher?.JZGJBSJ?.WechatUserId}
                    XM={mainTeacher?.JZGJBSJ?.XM}
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
                        type="userName"
                        openid={ele?.JZGJBSJ?.WechatUserId}
                        XM={ele?.JZGJBSJ?.XM}
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
            <Badge className={styles.legend} color="#AC90FB" text="教师调课" />
            <Badge className={styles.legend} color="#7A8990" text="教师请假" />
            <br />
            <Badge className={`${styles.legend} ${styles.legend1}`} color="#FFF" text="出勤" />
            <Badge className={styles.legend} color="#F48A82" text="缺勤" />
            <Badge className={styles.legend} color="#F2C862" text="请假" />
            <Badge className={styles.legend} color="#2196F3" text="今日" />
            <Badge className={styles.legend} color="#89DA8C" text="待上" />
          </span>
        </p>
        <div className={styles.cards}>
          {!(timetableList?.length === 0) ? (
            timetableList?.map((value) => {
              return (
                <div
                  className={styles.card}
                  style={value?.style}
                  onClick={() => handleModal(value)}
                >
                  <p>
                    {value.tag && value.tag === '假'
                      ? `【${value.tag}】`
                      : `第${value.index + 1}节`}
                  </p>
                  <p>{value.day}</p>
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

export default CourseTable;
