import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Link, useModel } from 'umi';
import ClassCalendar from './ClassCalendar';
import ListComponent from '@/components/ListComponent';
import type { ListData } from '@/components/ListComponent/data';
import { ParentHomeData } from '@/services/local-services/mobileHome';

import styles from './index.less';
import noData from '@/assets/noCourses.png';
import icon_curriculum from '@/assets/icon_curriculum.png';
import icon_classroomStyle from '@/assets/classroomStyle.png';
import icon_leave from '@/assets/icon_leave.png';

const Study = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { xxId, student } = currentUser || {};
  // 从日历中获取的时间
  const [datedata, setDatedata] = useState<any>();
  // 在学课程数据
  const myDate = dayjs().format('YYYY/MM/DD');
  const StorageXSId = localStorage.getItem('studentId') || (student && student[0].XSJBSJId) || testStudentId;
  const StorageNjId = localStorage.getItem('studentNjId') || (student && student[0].NJSJId);

  const [listData, setListData] = useState<ListData>();
  const Selectedcourses = (data: any) => {
    const courseData = data.length && data.map((item: { courseInfo: any; days: any; }) => {
      const { courseInfo, days } = item;
      const learned = days.filter((ele: { day: string; })=>{
       const time =  new Date(ele.day.replace(/-/g, '/')).getTime() - new Date(myDate).getTime();
       return time<0
      });
      return {
        id: courseInfo?.[0]?.bjId,
        title: courseInfo?.[0]?.title,
        link: `/parent/home/courseTable?classid=${courseInfo?.[0]?.bjId}`,
        desc: [
          {
            left: [
              `${courseInfo.map((item: any, index: number) => {
                return `每周${'日一二三四五六'.charAt(item.wkd)} ${item.start}-${item.end}`;
              })}`
            ]
          },
          {
            left: [`共${courseInfo?.[0]?.KSS}课时`, `已学${learned?.length||0}课时`],
          },
        ],
      }
    });
    return courseData;
  };
  useEffect(() => {
    (async () => {
      if (StorageXSId) {
        const oriData = await ParentHomeData('student', xxId, StorageXSId, StorageNjId);
        const { courseSchedule } = oriData;
        const courseData = Selectedcourses(courseSchedule);
        const Selected: ListData = {
          type: 'list',
          cls: 'list',
          list: courseData,
          noDataText: '暂无课程',
          noDataImg: noData,
        };
        setListData(Selected);
      }
    })()
  }, [StorageXSId]);

  return (
    <div className={styles.studyPage}>
      <div className={styles.headBox}>
        <Link to="/parent/study/askforLeave" className={styles.linkItem}>
          <p className={styles.top}>
            <p className={styles.wrapper}>
              <img src={icon_leave} alt="" />
            </p>
          </p>
          <p className={styles.text}>请假</p>
        </Link>
        <Link to="/parent/study/teacherEvaluation" className={styles.linkItem}>
          <p className={styles.top}>
            <p className={styles.wrapper}>
              <img src={icon_curriculum} alt="" />
            </p>
          </p>
          <p className={styles.text}>教师寄语</p>
        </Link>
        <Link to="/parent/study/classroomStyle" className={styles.linkItem}>
            <p className={styles.top}>
              <p className={styles.wrapper}>
                <img src={icon_classroomStyle} alt="" />
              </p>
            </p>
            <p className={styles.text}>课堂风采</p>
          </Link>
      </div>
      <div className={styles.funWrapper}>
        <div className={styles.titleBar}>孩子课表</div>
        <ClassCalendar setDatedata={setDatedata} />
      </div>
      <div className={styles.funWrapper} style={{ marginTop: '20px' }}>
        <div className={styles.titleBar}>{`在学课程 ${listData?.list.length}`}</div>
        <ListComponent listData={listData} />
      </div>
    </div>
  );
};

export default Study;
