import React from 'react';
import styles from './index.less';
import ClassCalendar from './ClassCalendar';

const Study = () => {

  return <div className={styles.studyPage}>
    <div className={styles.funWrapper}>
      <div className={styles.titleBar}>我的课表</div>
      <ClassCalendar />
    </div>
  </div>;
};

export default Study;
