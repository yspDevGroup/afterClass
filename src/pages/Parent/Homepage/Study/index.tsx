import React, { useContext, useState } from 'react';
import DisplayColumn from '@/components/DisplayColumn';
import { iconTextData } from './mock';
import styles from './index.less';
import ClassCalendar from './ClassCalendar';
import ListComponent from '@/components/ListComponent';
import moment from 'moment';
import myContext from '../myContext';

const Study = () => {
  // 从日历中获取的时间
  const [datedata, setDatedata] = useState<any[]>([]);
  // 获取列表数据
  const { weekSchedule, yxkc } = useContext(myContext);
  // 在学课程数据
  const myDate = new Date();
  const nowdata = new Date(moment(myDate.toLocaleDateString()).format('YYYY-MM-DD'));
  const Timetable = [];
  for (let i = 0; i < datedata.length; i+=1) {
    if (new Date(datedata[i]) < nowdata) {
      Timetable.push(datedata[i]);
    }
  }
  weekSchedule.map((record: any) => {
      record.zxkc = {
        type: 'list',
        cls: 'list',
        list: [
          {
            id: record.KHBJSJ.id,
            title: record.KHBJSJ.KHKCSJ.KCMC,
            link: `/parent/home/courseDetails?classid=${record.KHBJSJ.id}&type=false`,
            desc: [
              {
                left: ['每周一', `${record.XXSJPZ.KSSJ}-${record.XXSJPZ.JSSJ}`, '本校'],
              },
              {
                left: [`共${record.KHBJSJ.KSS}`,`已学${Timetable.length}课时`],
              },
            ],
          },
        ],
        noDataText: '暂无课程',
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
      <ClassCalendar setDatedata={setDatedata} />
    </div>
    <div className={styles.funWrapper}>
      <div className={styles.titleBar}>{`在学课程 ${yxkc?.length}`}</div>
      {
        weekSchedule.map((item: any)=>{
        return   <ListComponent listData={item.zxkc} />
        })
      }
    </div>
  </div>;
};

export default Study;
