import React, { useContext, useEffect, useState } from 'react';
import styles from './index.less';
import ClassCalendar from './ClassCalendar';
import ListComponent from '@/components/ListComponent';
import moment from 'moment';
import myContext from '@/utils/MyContext';
import type { ListData } from '@/components/ListComponent/data';
import noData from '@/assets/noCourses.png';

const Study = () => {
  // 从日历中获取的时间
  const [datedata, setDatedata] = useState<any>();
  // 获取列表数据
  const { yxkc } = useContext(myContext);
  // 在学课程数据
  const myDate = new Date();
  const nowdata = new Date(moment(myDate.toLocaleDateString()).format('YYYY-MM-DD'));

  const [listData, setListData] = useState<ListData>();
  const Selectedcourses = (data: any) => {
    const courseData: any[] = [];
    for (let i = 0; i < data?.length; i += 1) {
      const Timetable = [];
      const record = data[i];
      if (datedata && datedata[record.id]) {
        for (let z = 0; z < datedata[record.id].dates.length; z += 1) {
          for (let j = z + 1; j < datedata[record.id].dates.length; j += 1) {
            if (datedata[record.id].dates[z] === datedata[record.id].dates[j]) {
              datedata[record.id].dates.splice(j, 1);
              j -= 1;
            }
          }
        }
        datedata[record.id].dates.forEach((item: any) => {
          if (new Date(item) < nowdata) {
            Timetable.push(item);
          }
        });
        courseData.push({
          id: record.id,
          title: record.KHKCSJ.KCMC,
          link: `/parent/home/courseTable?classid=${record.id}`,
          desc: [
            {
              left: [
                `${datedata[record.id].weekDay.split(',').map((item: any) => {
                  return `每周${'日一二三四五六'.charAt(item)}`;
                })}`,
                `${datedata[record.id].courseInfo.XXSJPZ.KSSJ.substring(0, 5)}-${datedata[
                  record.id
                ].courseInfo.XXSJPZ.JSSJ.substring(0, 5)}`,
                `${datedata[record.id].courseInfo.FJSJ.FJMC}`,
              ],
            },
            {
              left: [`共${datedata[record.id].dates.length}课时`, `已学${Timetable.length}课时`],
            },
          ],
        });
      }
    }
    return {
      courseData,
    };
  };
  useEffect(() => {
    const { courseData } = Selectedcourses(yxkc);
    const Selected: ListData = {
      type: 'list',
      cls: 'list',
      list: courseData,
      noDataText: '暂无课程',
      noDataImg: noData,
    };
    setListData(Selected);
  }, [yxkc, datedata]);

  return (
    <div className={styles.studyPage}>
      <div className={styles.funWrapper}>
        <div className={styles.titleBar}>孩子课表</div>
        <ClassCalendar setDatedata={setDatedata} />
      </div>
      <div className={styles.funWrapper} style={{ marginTop: '20px' }}>
        <div className={styles.titleBar}>{`在学课程 ${listData?.list.length}`}</div>
        <ListComponent listData={listData} />
      </div>
    </div>
  );
};

export default Study;
