import React, { useContext, useEffect, useState } from 'react';
import DisplayColumn from '@/components/DisplayColumn';
import { iconTextData } from './mock';
import styles from './index.less';
import ClassCalendar from './ClassCalendar';
import ListComponent from '@/components/ListComponent';
// import { electiveData } from '../listData';
import type{ ListData } from '@/components/ListComponent/data';
import moment from 'moment';
import myContext from '@/utils/MyContext';

const Study = () => {
   // 从日历中获取的时间
   const [datedata, setDatedata] = useState<any>();
   // 获取列表数据
   const { rjkc } = useContext(myContext);
   // 在学课程数据
   const myDate = new Date();
   const nowdata = new Date(moment(myDate.toLocaleDateString()).format('YYYY-MM-DD'));
   const Timetable = [];
   const [listData, setListData] = useState<ListData>();
   const Selectedcourses = (data: any) => {
     const courseData: any[] = [];
     for (let i = 0; i < data.length; i += 1) {
       const record = data[i];
       if (datedata && datedata[record.id]) {
         datedata[record.id].dates.map((item: any) => {
           if (new Date(item) < nowdata) {
             Timetable.push(item);
           }
           return true
         })
         courseData.push({
           id: record.id,
           title: record.KHKCSJ.KCMC,
           link: `/parent/home/courseDetails?classid=${record.id}&type=false`,
           desc: [
             {
               left: [`${((datedata[record.id].weekDay).split(',')).map((item: any) => {
                 return `每周${'日一二三四五六'.charAt(item)}`
               })}`, `${(datedata[record.id].courseInfo.XXSJPZ.KSSJ).substring(0, 5)}-${(datedata[record.id].courseInfo.XXSJPZ.JSSJ).substring(0, 5)}`, `${datedata[record.id].courseInfo.FJSJ.FJMC}`],
             },
             {
               left: [`共${record.KSS}`, `已学${Timetable.length}课时`],
             },
           ],
         })
       }
     }
     return {
       courseData
     }
   }
   useEffect(() => {
     if(rjkc){
       const { courseData } = Selectedcourses(rjkc);
       const Selected: ListData = {
         type: 'list',
         cls: 'list',
         list: courseData,
         noDataText: '暂无课程',
       };
       setListData(Selected);
     }
   }, [rjkc, datedata])
 
  return <div className={styles.studyPage}>
    <DisplayColumn
      type="icon"
      isheader={false}
      grid={{ column: 4 }}
      dataSource={iconTextData}
    />
    <div className={styles.funWrapper}>
      <div className={styles.titleBar}>我的课表</div>
      <ClassCalendar setDatedata={setDatedata}/>
    </div>
    <div className={styles.funWrapper}>
      <div className={styles.titleBar}>{`任教课程 ${rjkc?.length}`}</div>
      <ListComponent listData={listData} />
    </div>
  </div>;
};

export default Study;
