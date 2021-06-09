import React from 'react';
import DisplayColumn from '@/components/DisplayColumn';
import { iconTextData } from './mock';
import styles from './index.less';
import ClassCalendar from './ClassCalendar';
import ListComponent from '@/components/ListComponent';
import { electiveData } from '../listData';

const Study = () => {
  return <div className={styles.studyPage}>
    <DisplayColumn
      type="icon"
      isheader={false}
      grid={{ column: 3 }}
      dataSource={iconTextData}
    />
    <div className={styles.funWrapper}>
      <div className={styles.titleBar}>孩子课表</div>
      <ClassCalendar />
    </div>
    <div className={styles.funWrapper}>
      <div className={styles.titleBar}>在学课程 3</div>
      <ListComponent listData={electiveData} />
    </div>
  </div>;
};

export default Study;
