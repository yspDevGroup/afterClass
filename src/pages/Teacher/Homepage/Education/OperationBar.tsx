/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-11-29 15:20:16
 * @LastEditTime: 2021-12-06 13:52:29
 * @LastEditors: Sissle Lynn
 */
import React from 'react';
import { Link } from 'umi';

import styles from './index.less';
import icon_stuEvaluate from '@/assets/icon_stuEvaluate.png';
import icon_courseBack from '@/assets/icon_courseBack.png';
import icon_classroomStyle from '@/assets/classroomStyle.png';
import icon_leave from '@/assets/icon-teacherLeave.png';
import icon_CourseAdjustment from '@/assets/icon-CourseAdjustment.png';

const OperationBar = (props: { courseData: any }) => {
  const { courseData } = props;
  return (
    <div className={styles.headBox}>
      <Link
        key="xk"
        to='/teacher/education/selectCourse'
        className={styles.wrapper}>
        <p className={styles.container}>
          <p className={styles.content}>
            <img src={icon_leave} alt="" />
          </p>
        </p>
        <p className={styles.text}>选课</p>
      </Link>
      <Link
        key="qj"
        to='/teacher/education/askForLeave'
        className={styles.wrapper}>
        <p className={styles.container}>
          <p className={styles.content}>
            <img src={icon_leave} alt="" />
          </p>
        </p>
        <p className={styles.text}>请假</p>
      </Link>
      <Link
        key="tdk"
        to='/teacher/education/courseAdjustment'
        className={styles.wrapper}>
        <p className={styles.container}>
          <p className={styles.content}>
            <img src={icon_CourseAdjustment} alt="" />
          </p>
        </p>
        <p className={styles.text}>调/代课</p>
      </Link>
      <Link
        key="bqd"
        to={{
          pathname: '/teacher/education/resign',
        }}
        className={styles.wrapper}>
        <p className={styles.container}>
          <p className={styles.content}>
            <img src={icon_stuEvaluate} alt="" />
          </p>
        </p>
        <p className={styles.text}>补签到</p>
      </Link>
      <Link
        key="ktfc"
        to={{
          pathname: '/teacher/education/record',
          state: courseData
        }}
        className={styles.wrapper}>
        <p className={styles.container}>
          <p className={styles.content}>
            <img src={icon_classroomStyle} alt="" />
          </p>
        </p>
        <p className={styles.text}>课堂风采</p>
      </Link>
      <Link
        key="xxpj"
        to={{
          pathname: '/teacher/education/studentEvaluation',
          state: courseData
        }}
        className={styles.wrapper}>
        <p className={styles.container}>
          <p className={styles.content}>
            <img src={icon_stuEvaluate} alt="" />
          </p>
        </p>
        <p className={styles.text}>学生点评</p>
      </Link>
      <Link
        key="kcfk"
        to={{
          pathname: '/teacher/education/feedback',
          state: courseData
        }}
        className={styles.wrapper}>
        <p className={styles.container}>
          <p className={styles.content}>
            <img src={icon_courseBack} alt="" />
          </p>
        </p>
        <p className={styles.text}>家长反馈</p>
      </Link>
    </div>
  );
};

export default OperationBar;
