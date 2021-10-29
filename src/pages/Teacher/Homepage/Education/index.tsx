import React, { useEffect, useState } from 'react';
import 'antd/es/modal/style';
import { Link, useModel } from 'umi';
import ClassCalendar from './ClassCalendar';
import { ParentHomeData } from '@/services/local-services/mobileHome';

import styles from './index.less';
import icon_stuEvaluate from '@/assets/icon_stuEvaluate.png';
import icon_courseBack from '@/assets/icon_courseBack.png';
import icon_classroomStyle from '@/assets/classroomStyle.png';
import myContext from '@/utils/MyContext';
import icon_leave from '@/assets/icon-teacherLeave.png';
import icon_CourseAdjustment from '@/assets/icon-CourseAdjustment.png';

const Study = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [courseData, setCourseData] = useState<any>([]);
  useEffect(() => {
    (async () => {
      const oriData = await ParentHomeData(currentUser?.xxId, currentUser.JSId || testTeacherId,'teacher');
      const { yxkc } = oriData;
      setCourseData(yxkc);
    })()
  }, []);
  return (
    <div className={styles.studyPage}>
      <div className={styles.funWrapper}>
        <div className={styles.headBox}>
        <Link
            key="qj"
            to='/teacher/education/askForLeave'
            className={styles.Leave}>
            <p className={styles.LeaveP1}>
              <p className={styles.LeaveP2}>
              <img src={icon_leave} alt="" />
              </p>
            </p>
            <p className={styles.LeaveP3}>请假</p>
          </Link>
          <Link
            key="tdk"
            to='/teacher/education/courseAdjustment'
            className={styles.Leave}>
            <p className={styles.LeaveP1s}>
              <p className={styles.LeaveP2s}>
              <img src={icon_CourseAdjustment} alt="" />
              </p>
            </p>
            <p className={styles.LeaveP3}>调/代课</p>
          </Link>
          <Link
            key="xxpj"
            to={{
              pathname: '/teacher/education/studentEvaluation',
              state: courseData
            }}
            className={styles.stuEvaluat}>
            <p className={styles.stuEvaluatP1}>
              <p className={styles.stuEvaluatP2}>
                <img src={icon_stuEvaluate} alt="" />
              </p>
            </p>
            <p className={styles.stuEvaluatP3}>学生评价</p>
          </Link>
          <Link
            key="kcfk"
            to={{
              pathname: '/teacher/education/feedback',
              state: courseData
            }}
            className={styles.courseBack}>
            <p className={styles.courseBackP1}>
              <p className={styles.courseBackP2}>
                <img src={icon_courseBack} alt="" />
              </p>
            </p>
            <p className={styles.courseBackP3}>课程反馈</p>
          </Link>
          <Link
            key="ktfc"
            to={{
              pathname: '/teacher/education/record',
              state: courseData
            }}
            className={styles.record}>
            <p className={styles.recordP1}>
              <p className={styles.recordP2}>
                <img src={icon_classroomStyle} alt="" />
              </p>
            </p>
            <p className={styles.recordP3}>课堂风采</p>
          </Link>

        </div>
        <div className={styles.titleBar}>我的课表</div>
        <ClassCalendar />
      </div>
    </div>
  );
};

export default Study;
