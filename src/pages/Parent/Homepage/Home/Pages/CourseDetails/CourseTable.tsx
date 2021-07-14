/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Badge } from 'antd';
import { getData, getQueryString } from '@/utils/utils';
import moment from 'moment';
import styles from './index.less';
import noData from '@/assets/noCourse.png';
import Nodata from '@/components/Nodata';
import GoBack from '@/components/GoBack';


const CourseTable: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [KcDetail, setKcDetail] = useState<any>();
  const [timetableList, setTimetableList] = useState<any[]>();
  const classid = getQueryString('classid');
  const myDate: Date = new Date();
  const currentDate = moment(myDate).format('MM/DD');
  const children = currentUser?.subscriber_info?.children || [{
    student_userid: currentUser?.UserId,
    njId: '1'
  }];
  const xsName = currentUser?.subscriber_info?.remark || currentUser?.username;
  useEffect(() => {
    async function fetchData() {
      if (classid) {
        const schedule = await getData(classid, children[0].student_userid!);
        const { data, ...rest } = schedule;
        setKcDetail({
          ...rest
        });
        setTimetableList(data);
      }
    };
    fetchData();
  }, [classid]);

  return <div className={styles.CourseDetails2}>
    <GoBack title={'课程详情'} onclick='/parent/home?index=study' />
    <div className={styles.KCXX}>
      {/* 上课时段 */}
      <p className={styles.title}>{KcDetail?.kcmc}</p>
      <ul>
      <ul>
        <li>上课时段：{moment(KcDetail?.start).format('YYYY.MM.DD')}~{moment(KcDetail?.end).format('YYYY.MM.DD')}</li>
        <li>上课地点：{KcDetail?.XQName}</li>
        <li>总课时：{KcDetail?.kss}课时</li>
        <li>班级：{KcDetail?.title}</li>
        <li>学生：{xsName?.split('-')[0]}</li>
      </ul>
      </ul>
    </div>
    <div className={styles.Timetable}>
      <p className={styles.title}>
        <span>课程表</span>
        <span>
          <Badge className={`${styles.legend} ${styles.legend1}`} color="#FFF" text="出勤" />
          <Badge className={styles.legend} color="#fd8b8b" text="缺勤" />
          <Badge className={styles.legend} color="#45C977" text="今日" />
          <Badge className={styles.legend} color="#d2ecdc" text="待上" />
        </span>

      </p>
      <div className={styles.cards}>
        {
          !(timetableList?.length === 0) ? timetableList?.map((value, index) => {
            return <div className={value.date === currentDate ? styles.card2 : (value.status === '缺席' ? styles.card1 : (value.status === '出勤' ? styles.card3 : styles.card))} >
              <p>第{index + 1}节</p>
              <p>{value.date}</p>
            </div>
          }) : <Nodata imgSrc={noData} desc='暂无课表' />
        }
      </div>


    </div>
  </div>

};

export default CourseTable;
