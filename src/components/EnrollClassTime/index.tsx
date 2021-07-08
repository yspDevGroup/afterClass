import { useContext, useEffect, useState } from 'react';
import styles from "./index.less";
import ListComp from '../ListComponent';
import type { ListData } from '../ListComponent/data';
import myContext from '@/utils/MyContext';
import TimeRight from './TimeRight';
import noData from '@/assets/today.png';
import noData1 from '@/assets/today1.png';
import moment from 'moment';

const EnrollClassTime = (props: { teacher?: boolean }) => {
  const { teacher = false } = props;
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

          let rightDom = <></>;
          if (titleRightText === '待上课') {

            rightDom = <TimeRight startTimeHour={startTime1} startTimeMin={startTime2} />
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
                right: rightDom,
              },
            ],
          })
        }
      }
    }
    return { curCourse, };
  }
  useEffect(() => {
    if (weekSchedule) {
      const { curCourse } = getTodayData(weekSchedule);
      const todayList: ListData = {
        type: "descList",
        cls: 'descList',
        header: {
          title:'今日课程',
        },
        list: curCourse,
        noDataText: '今日没有课呦',
        noDataIcon: true,
        noDataImg: teacher ? noData1 : noData
      }
      setDatasourse(todayList);
    }
  }, [weekSchedule]);

  switch (courseStatus) {

    case 'enroll':
      return (<div>
        {teacher === false ?
          (<><div className={styles.enrollText}>课后服务课程报名开始了！</div>
            <div className={styles.enrollDate}>报名时间：{`${moment(bmkssj).format('YYYY.MM.DD')}—${moment(bmjssj).format('YYYY.MM.DD')}`}</div></>)
          : <div className={styles.enrollText}>课后服务课程将于{`${moment(skkssj).format('YYYY.MM.DD')}`}正式开课！</div>}
      </div>);
      break;
    case 'education':
    case 'noTips':
      return (<div>
        {teacher === false ? <div> <ListComp listData={datasourse} cls={styles.todayImg} /> </div> : <></>}
        <><div className={styles.enrollText}>课后服务课程{teacher ? '已正式开课！' : '开课了！'}</div>
          {teacher === false ? '' : <ListComp listData={datasourse} cls={styles.todayImg} />}
        </>
      </div>);
      break;
    case 'enrolling':
      return (<div>
        {teacher === false ?
          (<>
            <div><ListComp listData={datasourse} cls={styles.todayImg} /></div>
            <div className={styles.enrollText}>课后服务课程报名开始了！</div>
            <div className={styles.enrollDate}>报名时间：{`${moment(bmkssj).format('YYYY.MM.DD')}—${moment(bmjssj).format('YYYY.MM.DD')}`}</div>
          </>)
          : <>
            <div className={styles.enrollText}>课后服务课程已正式开课！</div>
            <div><ListComp listData={datasourse} cls={styles.todayImg} /></div>
          </>}
      </div>);
      break;
    case 'enrolled':
      return (<div>
        {teacher === false ?
          (<><div className={styles.enrollText}>课后服务课程报名已结束！</div>
            <div className={styles.enrollDate}>开课时间：{`${moment(skkssj).format('YYYY.MM.DD')}—${moment(skjssj).format('YYYY.MM.DD')}`} </div></>)
          : <div className={styles.enrollText}>课后服务课程将于{`${moment(skkssj).format('YYYY.MM.DD')}`}正式开课！</div>}
      </div>);
      break;
    default:
      return <></>;
      break;
  }
}
export default EnrollClassTime