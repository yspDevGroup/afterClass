/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-22 11:13:07
 * @LastEditTime: 2021-06-23 16:34:50
 * @LastEditors: txx
 */
import { useContext } from 'react';
import styles from "./index.less";
import ListComp from '../ListComponent';
import myContext from '@/pages/Parent/Homepage/myContext';
import type { ListData } from '../ListComponent/data';

const EnrollClassTime = (props: {
  /** 在报名 | 在报名在上课 | 报名结束未上课 | 上课时间段 |未报名未上课 */
  type?: 'enroll' | 'enrolling' | 'enrolled' | 'education' | 'empty';
  /** 报名时段 */
  period?: any,
  /** 选课时间 */
  time?: any,
  /** 今日课程数据 */
  listData?: ListData
}) => {
  const { type, period, time } = props
  // 获取首页数据
  const { courseStatus, weekSchedule } = useContext(myContext);
  console.log(courseStatus, weekSchedule);

  switch (type) {
    case 'enroll':
      return (<div>
        <div className={styles.enrollText}>{period}课后服务课程报名开始了！</div>
        <div className={styles.enrollDate}>选课时间：{time} </div>
      </div>);
    case 'education':
      return (<div>
        <div><ListComp /> </div>
        <div className={styles.enrollText}>{period}课后服务课程已开课！</div>
        <div className={styles.enrollDate}>开课时间：{time} </div>
      </div>);
    case 'enrolling':
      return (<div>
        <div> <ListComp /></div>
        <div className={styles.enrollText}>{period}课后服务课程报名开始了！</div>
        <div className={styles.enrollDate}>选课时间：{time} </div>
      </div>);
    case 'enrolled':
      return (<div>
        <div className={styles.enrollText}>{period}课后服务课程报名已结束！</div>
        <div className={styles.enrollDate}>开课时间：{time} </div>
      </div>);

    case 'empty':
      return <></>;
    default:
      return <></>;
  }


}
export default EnrollClassTime