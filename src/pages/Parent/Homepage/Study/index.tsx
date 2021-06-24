import React, { useContext, useState } from 'react';
import DisplayColumn from '@/components/DisplayColumn';
import { iconTextData } from './mock';
import styles from './index.less';
import ClassCalendar from './ClassCalendar';
import ListComponent from '@/components/ListComponent';
import { learndata } from '../listData';
import moment from 'moment';
import myContext from '../myContext';

const Study = () => {
  // 从日历中获取的时间
  const [datedata, setDatedata] = useState<any[]>([]);
  // 获取列表数据
  const { weekSchedule } = useContext(myContext);
  console.log('weekSchedule',weekSchedule)

  const myDate = new Date();
  const nowdata=new Date(moment(myDate.toLocaleDateString()).format('YYYY-MM-DD'));
  const Timetable=[];
  datedata.map((item:any)=>{
    const cc=new Date(item);
    if(cc<=nowdata){
      Timetable.push(cc);
    }
  })
  return <div className={styles.studyPage}>
    <DisplayColumn
      type="icon"
      isheader={false}
      grid={{ column: 3 }}
      dataSource={iconTextData}
    />
    <div className={styles.funWrapper}>
      <div className={styles.titleBar}>孩子课表</div>
      <ClassCalendar setDatedata={setDatedata}/>
    </div>
    <div className={styles.funWrapper}>
      <div className={styles.titleBar}>在学课程 3</div>
      <ListComponent listData={learndata} />
    </div>
  </div>;
};

export default Study;
