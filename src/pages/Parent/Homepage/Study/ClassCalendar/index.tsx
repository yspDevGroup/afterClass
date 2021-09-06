import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Calendar } from 'react-h5-calendar';
import styles from './index.less';
import ListComponent from '@/components/ListComponent';
import { DateRange, Week } from '@/utils/Timefunction';
import myContext from '@/utils/MyContext';
import noData from '@/assets/noCourse.png';
import moment from 'moment';

type propstype = {
  setDatedata: (data: any) => void;
};
const defaultMsg = {
  type: 'picList',
  cls: 'picList',
  list: [],
  noDataText: '当天无课',
  noDataImg: noData,
};

const ClassCalendar = (props: propstype) => {
  const { setDatedata } = props;
  const [day, setDay] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [cDay, setCDay] = useState<string>(dayjs().format('M月D日'));
  const [course, setCourse] = useState<any>(defaultMsg);
  const { weekSchedule } = useContext(myContext);
  const [dates, setDates] = useState<any[]>([]);
  const [courseArr, setCourseArr] = useState<any>({});

  // 后台返回的周数据的遍历
  const getCalendarData = (data: any) => {
    const courseData = {};
    const markDays = [];
    const learnData = {};
    for (let k = 0; k < data.length; k += 1) {
      const item = data[k];
      const courseDays = [];
      const startDate = item.KHBJSJ.KKRQ ? item.KHBJSJ.KKRQ : item.KHBJSJ.KHKCSJ.KKRQ;
      const endDate = item.KHBJSJ.JKRQ ? item.KHBJSJ.JKRQ : item.KHBJSJ.KHKCSJ.JKRQ;
      const kcxxInfo = [
        {
          title: item.KHBJSJ.KHKCSJ.KCMC,
          img: item.KHBJSJ.KCTP ? item.KHBJSJ.KCTP : item.KHBJSJ.KHKCSJ.KCTP,
          link: `/parent/home/courseTable?classid=${item.KHBJSJ.id}`,
          desc: [
            {
              left: [
                `课程时段：${item.XXSJPZ.KSSJ.substring(0, 5)}-${item.XXSJPZ.JSSJ.substring(0, 5)}`,
              ],
            },
            {
              left: [`上课地点：${item.FJSJ.FJMC}`],
            },
          ],
        },
      ];
      const res = DateRange(
        moment(startDate).format('YYYY/MM/DD'),
        moment(endDate).format('YYYY/MM/DD'),
      );
      for (let i = 0; i < res.length; i += 1) {
        const weekDay = Week(moment(res[i]).format('YYYY/MM/DD'));
        if (weekDay === item.WEEKDAY) {
          if (courseData[res[i]]) {
            courseData[res[i]] = courseData[res[i]].concat(kcxxInfo);
          } else {
            courseData[res[i]] = kcxxInfo;
          }
          markDays.push({
            date: res[i],
          });
          courseDays.push(res[i]);
        }
      }
      if (learnData[item.KHBJSJ.id]) {
        const val = learnData[item.KHBJSJ.id];
        learnData[item.KHBJSJ.id] = {
          dates: val.dates.concat(courseDays),
          weekDay: `${val.weekDay},${item.WEEKDAY}`,
          courseInfo: item,
        };
      } else {
        learnData[item.KHBJSJ.id] = {
          dates: courseDays,
          weekDay: item.WEEKDAY,
          courseInfo: item,
        };
      }
    }

    return {
      markDays,
      courseData,
      learnData,
    };
  };
  useEffect(() => {
    const { markDays, courseData, learnData } = getCalendarData(weekSchedule);
    setDatedata(learnData);
    setDates(markDays);
    setCourse({
      type: 'picList',
      cls: 'picList',
      list: courseData[day] || [],
      noDataText: '当天无课',
      noDataImg: noData,
    });
    setCourseArr(courseData);
  }, []);

  return (
    <div className={styles.schedule}>
      <span
        className={styles.today}
        onClick={() => {
          setDay(dayjs().format('YYYY-MM-DD'));
          setCDay(dayjs().format('M月D日'));
          setCourse({
            type: 'picList',
            cls: 'picList',
            list: courseArr[dayjs().format('YYYY-MM-DD')] || [],
            noDataText: '当天无课',
            noDataImg: noData,
          });
        }}
      >
        今
      </span>
      <Calendar
        showType={'week'}
        markDates={dates}
        onDateClick={(date: { format: (arg: string) => any }) => {
          setDay(date.format('YYYY-MM-DD'));
          setCDay(date.format('M月D日'));
          const curCourse = {
            type: 'picList',
            cls: 'picList',
            list: courseArr[date.format('YYYY-MM-DD')] || [],
            noDataText: '当天无课',
            noDataImg: noData,
          };
          setCourse(curCourse);
        }}
        markType="dot"
        transitionDuration={0.1}
        currentDate={day}
      />
      <div className={styles.subTitle}>{cDay}</div>
      <ListComponent listData={course} />
    </div>
  );
};
export default ClassCalendar;
