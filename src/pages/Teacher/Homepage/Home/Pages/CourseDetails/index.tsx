import { getQueryString } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Article } from './mock';


const CourseDetails: React.FC = () => {
  const valueKey = getQueryString("courseId");
  const [title, setTitle] = useState<any>('');
  useEffect(() => {
    if(valueKey){
      setTitle(Article[valueKey])
    }
  }, [valueKey])
  return (
    <>
      <div className={styles.CourseDetails2}>
        <div className={styles.KCXX}>
          <p className={styles.title}>{title.title}</p>
          <ul>
            <li>上课时段：{title.timeRange}</li>
            <li>上课地点：{title.address}</li>
            <li>总课时：{title.hours}</li>
            <li>班级：{title.class}</li>
            <li>学生：{title.student}</li>
          </ul>
        </div>
        <div className={styles.Timetable}>
          <p className={styles.title}>课程表</p>
          <div className={styles.cards}>
            {
              title.schedule?.map((value: { type: string; JC: React.ReactNode; data: React.ReactNode; }) => {
                return <div className={value.type === '已上' ? styles.card1 : styles.card} >
                  <p>{value.JC}</p>
                  <p>{value.data}</p>
                </div>
              })
            }
          </div>
        </div>
      </div>
    </>)
};

export default CourseDetails;
