/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-22 11:13:07
 * @LastEditTime: 2021-06-23 17:11:13
 * @LastEditors: txx
 */
import { useContext } from 'react';
import styles from "./index.less";
import ListComp from '../ListComponent';
import myContext from '@/pages/Parent/Homepage/myContext';

const EnrollClassTime = () => {
  // 获取首页数据
  const { courseStatus, weekSchedule } = useContext(myContext);
  switch (courseStatus) {
    case 'enroll':
      return (<div>
        <div className={styles.enrollText}>课后服务课程报名开始了！</div>
        <div className={styles.enrollDate}>选课时间：</div>
      </div>);
    case 'education':
      return (<div>
        <div><ListComp /> </div>
        <div className={styles.enrollText}>课后服务课程已开课！</div>
        <div className={styles.enrollDate}>开课时间： </div>
      </div>);
    case 'enrolling':
      return (<div>
        <div> <ListComp /></div>
        <div className={styles.enrollText}>课后服务课程报名开始了！</div>
        <div className={styles.enrollDate}>选课时间： </div>
      </div>);
    case 'enrolled':
      return (<div>
        <div className={styles.enrollText}>课后服务课程报名已结束！</div>
        <div className={styles.enrollDate}>开课时间： </div>
      </div>);

    case 'empty':
      return <></>;
    default:
      return <></>;
  }


}
export default EnrollClassTime