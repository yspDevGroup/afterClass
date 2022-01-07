import React, { useEffect, useState } from 'react';
import { Link, useModel } from 'umi';
import ClassCalendar from './ClassCalendar';
import ListComponent from '@/components/ListComponent';
import type { ListData } from '@/components/ListComponent/data';
import { ParentHomeData, CountCourses } from '@/services/local-services/mobileHome';

import styles from './index.less';
import noData from '@/assets/noCourses.png';
import XSQJ from '@/assets/XSQJ.png';
import KTFC from '@/assets/KTFC.png';
import XSPJ from '@/assets/XSPJ.png';
import Selected from '../Home/components/Selected';

const Study = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { xxId, student } = currentUser || {};
  const StorageXSId = localStorage.getItem('studentId') || (student && student[0].XSJBSJId) || testStudentId;
  const StorageNjId = localStorage.getItem('studentNjId') || (student && student[0].NJSJId) || testStudentNJId;
  const StorageBjId = localStorage.getItem('studentBJId') || currentUser?.student?.[0].BJSJId || testStudentBJId;
  const StorageXQSJId = localStorage.getItem('studentXQSJId') || currentUser?.student?.[0].XQSJId || testStudentXQSJId;

  const [listData, setListData] = useState<ListData>();
  const [totalData, setTotalData] = useState<any>({});

  useEffect(() => {
    (async () => {
      if (StorageXSId) {
        const bjId = localStorage.getItem('studentBJId') || currentUser?.student?.[0].BJSJId || testStudentBJId;
        const oriData = await ParentHomeData('student', xxId, StorageXSId, StorageNjId, bjId, StorageXQSJId);
        const { courseSchedule } = oriData;
        const courseData = CountCourses(courseSchedule);
        // eslint-disable-next-line @typescript-eslint/no-shadow
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
  useEffect(() => {
    (async () => {
      if (StorageXSId) {
        const oriData = await ParentHomeData('student', currentUser?.xxId, StorageXSId, StorageNjId, StorageBjId, StorageXQSJId);
        const { data } = oriData;
        setTotalData(data);
      }
    })()
  }, [StorageXSId]);

  return (
    <div className={styles.studyPage}>
      <div className={styles.headBox}>
        <Link to="/parent/study/askforLeave" className={styles.linkItem}>
          <p className={styles.top}>
            <p className={styles.wrapper}>
              <img src={XSQJ} alt="" />
            </p>
          </p>
          <p className={styles.text}>请假</p>
        </Link>
        <Link to="/parent/study/teacherEvaluation" className={styles.linkItem}>
          <p className={styles.top}>
            <p className={styles.wrapper}>
              <img src={XSPJ} alt="" />
            </p>
          </p>
          <p className={styles.text}>教师寄语</p>
        </Link>
        <Link to="/parent/study/classroomStyle" className={styles.linkItem}>
          <p className={styles.top}>
            <p className={styles.wrapper}>
              <img src={KTFC} alt="" />
            </p>
          </p>
          <p className={styles.text}>课堂风采</p>
        </Link>
      </div>
      <div className={styles.funWrapper}>
        <div className={styles.title}>
          <div />
          <span>我的课表</span>
        </div>
        <ClassCalendar />
      </div>
      {/* <div className={styles.funWrapper} style={{ marginTop: '20px' }}>
        <div className={styles.titleBar}>{`在学课程 ${listData?.list.length || 0}`}</div>
        <ListComponent listData={listData} />
      </div> */}
      <div className={styles.courseArea}>
        <div className={styles.title}>
          <div />
          <span>我的课程</span>
        </div>
        <Selected dataResource={totalData} />
      </div>
    </div>
  );
};

export default Study;
