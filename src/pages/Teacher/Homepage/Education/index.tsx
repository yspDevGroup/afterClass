import React, { useContext } from 'react';
import styles from './index.less';
import 'antd/es/modal/style';
import ClassCalendar from './ClassCalendar';
import { Link } from 'umi';
import icon_stuEvaluate from '@/assets/icon_stuEvaluate.png';
import icon_courseBack from '@/assets/icon_courseBack.png';
import myContext from '@/utils/MyContext';
import icon_leave from '@/assets/icon-teacherLeave.png';

const Study = () => {

  const { yxkc } = useContext(myContext);

  return (
    <div className={styles.studyPage}>
      <div className={styles.funWrapper}>
        <div className={styles.headBox}>
        <Link
            key="qj"
            to={{
              pathname: '/teacher/education/askForLeave',
              state: yxkc
            }}
            className={styles.Leave}>
            <p className={styles.LeaveP1}>
              <p className={styles.LeaveP2}>
              <img src={icon_leave} alt="" />
              </p>
            </p>
            <p className={styles.LeaveP3}>请假</p>
          </Link>
          <Link
            key="xxpj"
            to={{
              pathname: '/teacher/education/studentEvaluation',
              state: yxkc
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
              state: yxkc
            }}
            className={styles.courseBack}>
            <p className={styles.courseBackP1}>
              <p className={styles.courseBackP2}>
                <img src={icon_courseBack} alt="" />
              </p>
            </p>
            <p className={styles.courseBackP3}>课程反馈</p>
          </Link>

        </div>
        <div className={styles.titleBar}>我的课表</div>
        <ClassCalendar />
      </div>
    </div>
  );
};

export default Study;
