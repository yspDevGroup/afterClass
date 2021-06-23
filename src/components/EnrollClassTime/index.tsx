/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-22 11:13:07
 * @LastEditTime: 2021-06-22 18:26:29
 * @LastEditors: txx
 */
import React from 'react';
import type { FC } from "react";
import styles from "./index.less";
import ListComp from '../ListComponent';
import type { ListData } from '../ListComponent/data';

type IType = {
  dataSourse: {
    /** 在报名 | 在报名在上课 | 报名结束未上课 | 上课时间段 |未报名未上课 */
    type?: 'enroll' | 'enrolling' | 'enrolled' | 'education' | 'empty';
    /** 报名时段 */
    period?: string;
    /** 选课时间 */
    time?: string;
    listData: ListData;

  }[]
}

const EnrollClassTime: FC<IType> = ({ dataSourse }) => {
  return (<div className={styles.EnrollClassTime}>
    {dataSourse.map((item) => {
      const { type, period, time, listData } = item;
      switch (type) {
        case 'enroll':
          return (<div className={styles.enroll}>
            <div className={styles.enrollText}>{period}课后服务课程报名开始了！</div>
            <div className={styles.enrollDate}>选课时间：{time} </div>
          </div>);
        case 'education':
          return (<div className={styles.enroll}>
            <div className={styles.enrollText}>{period}课后服务课程报名已结束！</div>
            <div className={styles.enrollDate}>开课时间：{time} </div>
          </div>);
        case 'enrolling':
          return (<div className={styles.enrolling}>
            <div className={styles.todayCourses}>
              <ListComp listData={listData} />
            </div>
            <div className={styles.enrollText}>{period}课后服务课程报名开始了！</div>
          </div>);
        case 'enrolled':
          return (<div className={styles.enrolled}>
            <div className={styles.todayCourses}>
              <ListComp listData={listData} />
            </div>
            <div className={styles.enrollText}>{period}课后服务课程报名已结束！</div>
          </div>);

        case 'empty':
          return (<></>);
        default:
          return <></>;
      }


    })}
  </div>)
}
export default EnrollClassTime