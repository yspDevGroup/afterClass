/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-22 11:13:07
 * @LastEditTime: 2021-06-25 08:33:18
 * @LastEditors: txx
 */
import { useContext, useEffect, useState } from 'react';
import styles from "./index.less";
import ListComp from '../ListComponent';
import myContext from '@/pages/Parent/Homepage/myContext';
import type { ListData } from '../ListComponent/data';

const EnrollClassTime = () => {
  // 获取首页数据
  const { courseStatus, weekSchedule, bmkssj, bmjssj, skkssj, skjssj } = useContext(myContext);
  const [datasourse, setDatasourse] = useState<ListData>();// 今日课程中的数据
  const getTodayData = (data: any) => {
    const day = new Date();// 获取现在的时间  eg:day Thu Jun 24 2021 18:54:38 GMT+0800 (中国标准时间)
    const curCourse = [];// list中的数据
    for (let i = 0; i < data.length; i += 1) {// 循环每一个数组
      const item = data[i]; // 每一个数组
      if (Number(item.WEEKDAY) === day.getDay()) {// 周几上课与现在是周几做对比
        const startDate = item.KHBJSJ.KKRQ ? item.KHBJSJ.KKRQ : item.KHBJSJ.KHKCSJ.KKRQ;// 开课日期
        const endDate = item.KHBJSJ.JKRQ ? item.KHBJSJ.JKRQ : item.KHBJSJ.KHKCSJ.JKRQ;// 结课日期
        if (new Date(startDate) <= day && day <= new Date(endDate)) {// 开课时间与现在时间与结课时间做判断
          curCourse.push({
            title: item.KHBJSJ.KHKCSJ.KCMC,
            titleRight: {
              text: '待上课',
            },
            link: `/parent/home/courseDetails?id=${item.KHBJSJ.id}&type=false`,
            desc: [
              {
                left: [`${(item.XXSJPZ.KSSJ).substring(0, 5)}-${(item.XXSJPZ.JSSJ).substring(0, 5)}`, `${item.FJSJ.FJMC}`],
                right: '2时43分后开课'
              },
            ],
          })
        }
      }
    }
    return { curCourse, };
  }
  useEffect(() => {
    const { curCourse } = getTodayData(weekSchedule);
    const todayList: ListData = {
      type: "descList",
      cls: 'descList',
      header: {
        title: '今日课程',
      },
      list: curCourse,
    }
    setDatasourse(todayList);

  }, [courseStatus, weekSchedule])
  switch (courseStatus) {
    case 'enroll':
      return (<div>
        <div className={styles.enrollText}>课后服务课程报名开始了！</div>
        <div className={styles.enrollDate}>选课时间：{`${bmkssj}—${bmjssj}`}</div>
      </div>);
      break;
    case 'education':
      return (<div>
        <div> <ListComp listData={datasourse} /> </div>
        <div className={styles.enrollText}>课后服务课程已开课！</div>
        <div className={styles.enrollDate}>开课时间：{`${skkssj}—${skjssj}`} </div>
      </div>);
      break;
    case 'enrolling':
      return (<div>
        <div> <ListComp listData={datasourse} /></div>
        <div className={styles.enrollText}>课后服务课程报名开始了！</div>
        <div className={styles.enrollDate}>选课时间：{`${bmkssj}—${bmjssj}`} </div>
      </div>);
      break;
    case 'enrolled':
      return (<div>
        <div className={styles.enrollText}>课后服务课程报名已结束！</div>
        <div className={styles.enrollDate}>开课时间：{`${skkssj}—${skjssj}`} </div>
      </div>);
      break;
    default:
      return <></>;
      break;
  }
}
export default EnrollClassTime