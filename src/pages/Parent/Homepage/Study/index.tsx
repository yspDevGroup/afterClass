import React from 'react';
import DisplayColumn from '@/components/DisplayColumn';
import { iconTextData } from './mock';
import styles from './index.less';

const Study = () => {
  return <div className={styles.studyPage}>
    <DisplayColumn
     type="icon"
     isheader={false}
     grid={{ column: 3 }}
     dataSource={iconTextData}
    />
  </div>;
};

export default Study;
