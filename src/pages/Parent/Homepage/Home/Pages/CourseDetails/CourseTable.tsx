/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Badge } from 'antd';
import { getData, getQueryString } from '@/utils/utils';
import moment from 'moment';
import styles from './index.less';
import noData from '@/assets/noCourse.png';
import Nodata from '@/components/Nodata';
import GoBack from '@/components/GoBack';
import { ParentHomeData } from '@/services/local-services/mobileHome';
import { getAllKHXSCQ } from '@/services/after-class/khxscq';
import { getTeachersByBJId } from '@/services/after-class/khbjsj';
import WWOpenDataCom from '@/components/WWOpenDataCom';


const CourseTable: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { student } = currentUser || {};
  const [KcDetail, setKcDetail] = useState<any>();
  const [teacherList, setTeacherList] = useState<any[]>([]);
  const [timetableList, setTimetableList] = useState<any[]>();
  const classid = getQueryString('classid');
  const path = getQueryString('path');
  const myDate: Date = new Date();
  const currentDate = moment(myDate).format('YYYY-MM-DD');
  const StorageXSId = localStorage.getItem('studentId') || (student && student[0].XSJBSJId) || testStudentId;
  const StorageNjId = localStorage.getItem('studentNjId') || (student && student[0].NJSJId);

  useEffect(() => {
    async function fetchData() {
      if (classid) {
        const oriData = await ParentHomeData('student', currentUser?.xxId, StorageXSId, StorageNjId);
        const { courseSchedule } = oriData;
        const detail = courseSchedule.find((item: { courseInfo: { bjId: string; }[]; }) => {
          return item.courseInfo?.[0].bjId === classid
        });
        const result = await getTeachersByBJId({ KHBJSJId: classid });
        if (result.status === 'ok') {
          setTeacherList(result.data?.rows);
        }
        // 获取课程班学生出勤数据
        const res = await getAllKHXSCQ({
          bjId: classid,
          xsId: StorageXSId
        });
        if (detail) {
          setKcDetail(detail.courseInfo[0]);
        }
        if (res.status === 'ok' && res.data) {

          const dataTable = detail?.days && detail?.days.map((ele: { index: number; day: string; }) => {
            const { index, day } = ele;
            let status: string = '';
            let style: any = {};
            if (new Date(day).getTime() > new Date(currentDate).getTime()) {
              status = '待上';
              style = {
                background: 'rgba(137, 218, 140, 0.4)',
                color: '#333333'
              };
            }
            if (new Date(day).getTime() < new Date(currentDate).getTime()) {
              status = '出勤';
              style = {
                background: '#FFFFFF',
                color: '#999999',
                border: '1px solid #dddddd'
              };
            }
            if (res.data?.length) {
              let curCQ = res.data.find((item) => item.CQRQ === day);
              if (curCQ) {
                switch (curCQ?.CQZT) {
                  case '请假':
                    style = {
                      background: 'rgba(242, 200, 98, 0.4)',
                      color: '#666666',
                    };
                    break;
                  case '缺席':
                    style = {
                      background: 'rgba(244, 138, 130, 0.4)',
                      color: '#666666',
                    };
                    break;
                  default:
                    break;
                }
                status = curCQ?.CQZT || '出勤';
              }
            }
            // 处理今日已点名情况，故后更新今日状态
            if (new Date(day).getTime() === new Date(currentDate).getTime()) {
              status = '今日';
              style = {
                background: '#2196F3',
                color: '#FFFFFF',
              };
            }
            return {
              num: index + 1,
              day: moment(day).format('MM/DD'),
              status,
              style
            }
          })
          setTimetableList(dataTable);
        }
      }
    };
    fetchData();
  }, [classid]);
  return <div className={styles.CourseDetails2}>
    <GoBack title={'课程详情'} onclick={`/parent/home?index=${path ? path : 'index'}`} />
    <div className={styles.KCXX}>
      {/* 上课时段 */}
      <p className={styles.title}>{KcDetail?.title}</p>
      <ul>
        <ul>
          <li><span>上课时段：</span>{moment(KcDetail?.KKRQ).format('YYYY.MM.DD')}~{moment(KcDetail?.JKRQ).format('YYYY.MM.DD')}</li>
          <li><span>上课地点：</span>{KcDetail?.xq} | {KcDetail?.address}</li>
          <li><span>总课时：</span>{KcDetail?.KSS}课时</li>
          <li><span>授课班级：</span>{KcDetail?.BJMC}</li>
          <li><span>授课教师：</span>{teacherList && teacherList?.length && teacherList.map((ele) => {
            return <span className={styles.teacherName}>{ele?.JZGJBSJ?.XM === '未知' && ele?.JZGJBSJ?.WechatUserId ? (
              <WWOpenDataCom type="userName" openid={ele?.JZGJBSJ?.WechatUserId} />
            ) : (
              ele?.JZGJBSJ?.XM
            )}</span>
          })}</li>
        </ul>
      </ul>
    </div>
    <div className={styles.Timetable}>
      <p className={styles.title}>
        <span>课程表</span>
        <span>
          <Badge className={`${styles.legend} ${styles.legend1}`} color="#FFF" text="出勤" />
          <Badge className={styles.legend} color="#F48A82" text="缺勤" />
          <Badge className={styles.legend} color="#F2C862" text="请假" />
          <Badge className={styles.legend} color="#2196F3" text="今日" />
          <Badge className={styles.legend} color="#89DA8C" text="待上" />
          {/* <br />
          <Badge className={styles.legend} color="#fd8b8b" text="调课" />
          <Badge className={styles.legend} color="#45C977" text="代课" /> */}
        </span>
      </p>
      <div className={styles.cards}>
        {
          !(timetableList?.length === 0) ? timetableList?.map((value) => {
            return <div className={styles.card} style={value?.style} >
              <p>第{value.num}节</p>
              <p>{value.day}</p>
            </div>
          }) : <Nodata imgSrc={noData} desc='暂无课表' />
        }
      </div>
    </div>
  </div>

};

export default CourseTable;
