import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Calendar } from 'react-h5-calendar';
import styles from './index.less';
import ListComponent from '@/components/ListComponent';
import PromptInformation from './components/PromptInformation';
import { courseArr } from '../mock';

const ClassCalendar = () => {
  const [day,setDay] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [cDay,setCDay] = useState<string>(dayjs().format('M月D日'));
  const [course, setCourse] = useState<any>();

  return (
    <div className={styles.schedule}>
      <span className={styles.today} onClick={()=>{
        setDay(dayjs().format('YYYY-MM-DD'));
        setCDay(dayjs().format('M月D日'))
      }}>
        今
      </span>
      <Calendar

        showType={'week'}
        markDates={[
          { date: '2021-6-7' },
          { date: '2021-6-9'},
          { date: '2021-6-10'},
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
   { course ? <ListComponent listData={course} />: <PromptInformation />}
    </div>
  )
}
export default ClassCalendar;