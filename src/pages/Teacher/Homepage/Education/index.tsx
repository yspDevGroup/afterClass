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
      grid={{ column: 4 }}
      dataSource={iconTextData}
    />
    <div className={styles.funWrapper}>
      <div className={styles.titleBar}>我的课表</div>
      <ClassCalendar />
    </div>
    <div className={styles.funWrapper}>
      <div className={styles.titleBar}>任教课程 2</div>
      <ListComponent listData={electiveData} />
    </div>
  </div>;
};

export default Study;
