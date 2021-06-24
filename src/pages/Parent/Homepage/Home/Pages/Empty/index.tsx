/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-23 10:35:06
 * @LastEditTime: 2021-06-23 15:21:28
 * @LastEditors: txx
 */
import React, { useContext } from 'react';
import imgPop from '@/assets/mobileBg.png';
import styles from "./index.less";
import myContext from '../../../myContext';

const Empty = () => {
  const { currentUser } = useContext(myContext);
  const title = '课后帮课后服务报名通知';
  const time = '2021.09.01 08:32:23';
  const content = `1.服务时间：一、二年级16:10-17:00，其中周二16:50-17:40，三——六年级17:00-17:50（夏令时间顺延20分钟）。\n
  2.服务费用：运动类项目240元／项，非运动类项目220元／项，均已包含耗材费用。\n
  3.序号36——65所列项目需另外购买40元/人的（运动类）意外险，保期四个月（全天24小时），参加其中一个或多个项目的只需购买1份保险。\n
  4.参加第1时段课后服务的学生方可报名，每人可报一个或多个项目，但要注意时间不要冲突；网上报名平台开放时间：2月24日12:00-24日22:00，每个项目均有人数限制，欲报从速。`;
  return (
    <div className={styles.EmptyPage}>
      <header className={styles.cusHeader}>
        <div className={styles.headerPop} style={{ backgroundImage: `url(${imgPop})` }}></div>
        <div className={styles.headerText}>
          <h4>
            <span>{currentUser?.subscriber_info?.remark || currentUser?.username || '家长'}</span>
            ，你好！
          </h4>
          <div>欢迎使用课后帮，课后服务选我就对了！ </div>
        </div>
      </header>
      <div className={styles.cusContent}>
        <div className={styles.title}>{title}</div>
        <div className={styles.time}>{time}</div>
        <div className={styles.line}></div>
        <div className={styles.opacity}></div>
        <textarea disabled value={content} />
      </div>
    </div>
  )
}
export default Empty;
