import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Calendar } from 'react-h5-calendar';
import styles from './index.less';
import ListComponent from '@/components/ListComponent';
import PromptInformation from './components/PromptInformation';
import { DateRange, Week } from '@/utils/Timefunction';
import myContext from '../../myContext';
import moment from 'moment';


const ClassCalendar = () => {
  const [day, setDay] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [cDay, setCDay] = useState<string>(dayjs().format('M月D日'));
  const [course, setCourse] = useState<any>();
  const { weekSchedule } = useContext(myContext);
  const [dates, setDates] = useState<any[]>([]);
  const [courseArr, setCourseArr] = useState<any>({})

  // 后台返回的周数据的遍历
  const yy = {};
  const arrys = weekSchedule.map((item: any) => {
    const arry: any[] = [];
    item.xx = {
      type: 'picList',
      cls: 'picList',
      list: [
        {
          title: item.KHBJSJ.KHKCSJ.KCMC,
          img: item.KHBJSJ.KCTP ? item.KHBJSJ.KCTP : item.KHBJSJ.KHKCSJ.KCTP,
          link: `/parent/home/courseDetails?id=${item.KHBJSJ.id}&type=true`,
          desc: [
            {
              left: [`课程时段：${item.XXSJPZ.KSSJ}-${item.XXSJPZ.JSSJ}`],
            },
            {
              left: [`上课地点：${item.KHBJSJ.XQName}`],
            },
          ],
        },
      ]
    };
    if (item.KHBJSJ.KKRQ && item.KHBJSJ.JKRQ) {
      const res = DateRange(moment(item.KHBJSJ.KKRQ).format('YYYY/MM/DD'), moment(item.KHBJSJ.JKRQ).format('YYYY/MM/DD'));
      res.map((arrye: any) => {
        const erry = Week(moment(arrye).format('YYYY/MM/DD'));
        if (erry === item.WEEKDAY) {
          arry.push(arrye);
          yy[arrye] = item.xx;
        }
      })
    } else {
      const res = DateRange(moment(item.KHBJSJ.KHKCSJ.KKRQ).format('YYYY/MM/DD'), moment(item.KHBJSJ.KHKCSJ.JKRQ).format('YYYY/MM/DD'));
      res.map((arrye: any) => {
        const erry = Week(moment(arrye).format('YYYY/MM/DD'));
        if (erry === item.WEEKDAY) {
          arry.push(arrye);
          yy[arrye] = item.xx;
        }
      })
    }
    setCourseArr(yy);
    return arry;
  })
  useEffect(() => {
    const eray: any[] = []
    arrys.map((item: any) => {
      item.map((items: any) => {
        eray.push({ date: items })
      })
    })
    setDates(eray);
  }, [])
console.log('courseArr',courseArr)

  return (
    <div className={styles.schedule}>
      <span className={styles.today} onClick={() => {
        setDay(dayjs().format('YYYY-MM-DD'));
        setCDay(dayjs().format('M月D日'))
      }}>
        今
      </span>
      <Calendar
        showType={'week'}
        markDates={dates}
        onDateClick={(date: { format: (arg: string) => any; }) => {
          setDay(date.format('YYYY-MM-DD'));
          setCDay(date.format('M月D日'));
          const curCourse = courseArr[date.format('YYYY-MM-DD')];
          setCourse(curCourse);
        }}
        markType="dot"
        transitionDuration="0.1"
        currentDate={day}
      />
      <div className={styles.subTitle}>
        {cDay}
      </div>
      { course ? <ListComponent listData={course} /> : <PromptInformation />}
    </div>
  )
}
export default ClassCalendar;