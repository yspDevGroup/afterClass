import React, { useState } from 'react';
import dayjs from 'dayjs';
// 因为插件为JS，TS校验报错，不影响使用
import { Calendar } from 'react-h5-calendar';
import styles from './index.less';
import ListComponent from '@/components/ListComponent';
import { courseArr } from '../mock';
import PromptInformation from './components/PromptInformation';

const ClassCalendar = () => {
  const [day, setDay] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [cDay, setCDay] = useState<string>(dayjs().format('M月D日'));
  const [course, setCourse] = useState<any>();
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
          { date: '2021-06-08' },
          { date: '2021-06-10' },
          { date: '2021-06-15' },
          { date: '2021-06-17' },
          { date: '2021-06-24' },
          { date: '2021-06-22' },
          { date: '2021-09-02' },
          { date: '2021-09-07' },
          { date: '2021-09-09' },
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
      {course ? <ListComponent listData={course} /> : <PromptInformation />}
    </div>
  )
}
export default ClassCalendar;