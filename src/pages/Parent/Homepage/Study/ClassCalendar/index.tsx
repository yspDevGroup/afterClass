import React, { useContext, useState } from 'react';
import dayjs from 'dayjs';
import { Calendar } from 'react-h5-calendar';
import styles from './index.less';
import ListComponent from '@/components/ListComponent';
import PromptInformation from './components/PromptInformation';
import { courseArr } from '../mock';
import { DateRange, Week } from '@/utils/Timefunction';
import myContext from '../../myContext';
import moment from 'moment';


const ClassCalendar = () => {
  const [day, setDay] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [cDay, setCDay] = useState<string>(dayjs().format('M月D日'));
  const [course, setCourse] = useState<any>();
  const { weekSchedule } = useContext(myContext);
  // console.log('weekSchedule', weekSchedule[0].KHBJSJ)
  // console.log(DateRange('2021/06/01', '2021/06/30'))
  // console.log(Week('2021/06/24'))
  // 后台返回的周数据的遍历
 const arry= weekSchedule.map((item: any) => {
    const arry: any[] = [];
    if (item.KHBJSJ.KKRQ && item.KHBJSJ.JKRQ) {
      const res = DateRange(moment(item.KHBJSJ.KKRQ).format('YYYY/MM/DD'), moment(item.KHBJSJ.JKRQ).format('YYYY/MM/DD'));
      res.map((arrye: any) => {
        const erry = Week(moment(arrye).format('YYYY/MM/DD'));
        if (erry === item.WEEKDAY) {
          arry.push(arrye);
        }
      })
    }else{
      const res =DateRange(moment(item.KHBJSJ.KHKCSJ.KKRQ).format('YYYY/MM/DD'),moment(item.KHBJSJ.KHKCSJ.JKRQ).format('YYYY/MM/DD'));
      res.map((arrye: any) => {
        const erry = Week(moment(arrye).format('YYYY/MM/DD'));
        if (erry === item.WEEKDAY) {
          arry.push(arrye);
        }
      })
    }
    return arry;
  })
  console.log('arry',arry)
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
        markDates={[
          { date: '2021-6-7' },
          { date: '2021-6-9' },
          { date: '2021-6-10' },
        ]}
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