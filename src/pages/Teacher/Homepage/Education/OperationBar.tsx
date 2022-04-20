/* eslint-disable @typescript-eslint/no-unused-expressions */
/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-11-29 15:20:16
 * @LastEditTime: 2022-04-20 18:00:34
 * @LastEditors: Wu Zhan
 */
import React, { useEffect, useState } from 'react';
import { Link, useModel } from 'umi';

import styles from './index.less';
import icon_stuEvaluate from '@/assets/icon_stuEvaluate.png';
import icon_courseBack from '@/assets/icon_courseBack.png';
import icon_classroomStyle from '@/assets/classroomStyle.png';
import icon_leave from '@/assets/icon-teacherLeave.png';
import icon_select from '@/assets/icon_classroom.png';
import icon_resign from '@/assets/icon_resign.png';
import icon_CourseAdjustment from '@/assets/icon-CourseAdjustment.png';
import { getXXSPPZ } from '@/services/after-class/xxsppz';
import { Modal } from 'antd';

const OperationBar = (props: { courseData: any }) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { courseData } = props;
  const day = new Date().getDate();
  /** 教师补签日期 */
  const [start, setStart] = useState<number>(20);
  const [end, setEnd] = useState<number>(25);
  const [disabled, setDisabled] = useState<boolean>(true);
  useEffect(() => {
    (async () => {
      const res = await getXXSPPZ({
        xxId: currentUser.xxId,
      });
      if (res.status === 'ok' && res.data) {
        const { JSBQ_KSRQ, JSBQ_JSRQ } = res.data;
        JSBQ_KSRQ ? setStart(Number(JSBQ_KSRQ)) : '';
        JSBQ_JSRQ ? setEnd(Number(JSBQ_JSRQ)) : '';
      }
    })();
  }, []);
  useEffect(() => {
    if (start && end && day) {
      if (start <= day && day <= end) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    }
  }, [start, end, day]);

  return (
    <div className={styles.headBox}>
      <Link key="xk" to="/teacher/education/selectCourse" className={styles.wrapper}>
        <p className={styles.container}>
          <p className={styles.content}>
            <img src={icon_select} alt="" />
          </p>
        </p>
        <p className={styles.text}>选课</p>
      </Link>
      <Link key="qj" to="/teacher/education/askForLeave" className={styles.wrapper}>
        <p className={styles.container}>
          <p className={styles.content}>
            <img src={icon_leave} alt="" />
          </p>
        </p>
        <p className={styles.text}>请假</p>
      </Link>
      <Link key="tdk" to="/teacher/education/courseAdjustment" className={styles.wrapper}>
        <p className={styles.container}>
          <p className={styles.content}>
            <img src={icon_CourseAdjustment} alt="" />
          </p>
        </p>
        <p className={styles.text}>调/代课</p>
      </Link>
      <>
        {disabled ? (
          <a
            className={styles.wrapper}
            onClick={() => {
              Modal.info({
                title: `教师补签时段为每月${start}日到${end}日`,
                className: styles.modalSign,
                centered: true,
                okText: '知道了',
              });
            }}
          >
            <p className={styles.container}>
              <p className={styles.content}>
                <img src={icon_resign} alt="" />
              </p>
            </p>
            <p className={styles.text}>补签到</p>
          </a>
        ) : (
          <Link
            key="bqd"
            to={{
              pathname: '/teacher/education/resign',
            }}
            className={styles.wrapper}
          >
            <p className={styles.container}>
              <p className={styles.content}>
                <img src={icon_resign} alt="" />
              </p>
            </p>
            <p className={styles.text}>补签到</p>
          </Link>
        )}
      </>
      <Link
        key="ktfc"
        to={{
          pathname: '/teacher/education/record',
          state: courseData,
        }}
        className={styles.wrapper}
      >
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
          state: courseData,
        }}
        className={styles.wrapper}
      >
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
          state: courseData,
        }}
        className={styles.wrapper}
      >
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
