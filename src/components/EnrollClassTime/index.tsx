/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-22 11:13:07
 * @LastEditTime: 2021-06-25 19:16:02
 * @LastEditors: txx
 */
import { useContext, useEffect, useState } from 'react';
import styles from "./index.less";
import ListComp from '../ListComponent';
import myContext from '@/pages/Parent/Homepage/myContext';
import type { ListData } from '../ListComponent/data';

const EnrollClassTime = (props: { teacher?: boolean }) => {
  const { teacher = false } = props
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
          const startTime1 = (item.XXSJPZ.KSSJ).substring(0, 2);// 上课开始时间的小时
          const startTime2 = (item.XXSJPZ.KSSJ).substring(3, 5);// 上课开始时间的分钟
          const endTime1 = (item.XXSJPZ.JSSJ).substring(0, 2);// 上课结束时间的小时
          const endTime2 = (item.XXSJPZ.JSSJ).substring(3, 5);// 上课结束时间的分钟
          let titleRightText = '';// 上课状态
          if ((startTime1 - day.getHours() > 0) || startTime1 === day.getHours() && startTime2 > day.getMinutes()) {
            titleRightText = '待上课';
          }
          if (((startTime1 - day.getHours() <= 0) && (startTime2 - day.getMinutes() <= 0)) && ((day.getHours() <= endTime1) && (day.getMinutes() <= endTime2))) {
            titleRightText = '上课中';
          }
          if ((day.getHours() - endTime1 > 0) || ((day.getHours() === endTime1) && (day.getMinutes() > endTime2))) {
            titleRightText = '已下课';
          }
          let nowMin;// 现在的总分钟
          let classMin;// 上课的总分钟
          let diff; // 剩余总分钟
          let hour;// 剩余小时
          let min;// 剩余分钟
          let desRight // 剩余时间显示
          if (titleRightText === '待上课') {
            nowMin = Number(day.getHours() * 60) + Number(day.getMinutes());
            classMin = Number(startTime1 * 60) + Number(startTime2);
            diff = Number(classMin - nowMin);
            hour = Math.floor(diff / 60);
            min = diff % 60;
            desRight = ` ${hour}时${min}分后开课`;
          }
          curCourse.push({
            title: item.KHBJSJ.KHKCSJ.KCMC,
            titleRight: {
              text: titleRightText,
            },
            link: `/parent/home/courseDetails?classid=${item.KHBJSJ.id}&courseid=${item.KHBJSJ.KHKCSJ.id}`,
            desc: [
              {
                left: [`${(item.XXSJPZ.KSSJ).substring(0, 5)}-${(item.XXSJPZ.JSSJ).substring(0, 5)}`, `${item.FJSJ.FJMC}`],
                right: desRight,
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
        {teacher === false ?
          (<><div className={styles.enrollText}>课后服务课程已开课！</div>
            <div className={styles.enrollDate}>开课时间：{`${skkssj}—${skjssj}`} </div></>)
          : <></>
        }

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