import React, { useState } from 'react';
import dayjs from 'dayjs';
// 因为插件为JS，TS校验报错，不影响使用
import { Calendar } from 'react-h5-calendar';
import styles from './index.less';
import ListComponent from '@/components/ListComponent';
import { myData } from '../../listData';

const ClassCalendar = () => {
  const [day,setDay] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [cDay,setCDay] = useState<string>(dayjs().format('M月D日'));
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
          setCDay(date.format('M月D日'))
        }}
        markType="dot"
        transitionDuration="0.1"
        currentDate={day}
      />
      <div className={styles.subTitle}>
        {cDay}
      </div>
      <ListComponent listData={myData} />
    </div>
  )
}
export default ClassCalendar;