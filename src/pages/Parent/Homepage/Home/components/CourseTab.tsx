import React, { useContext } from 'react';
import styles from '../index.less';
import myContext from '../../myContext';

const CourseTab = () => {
  // 获取首页数据
  const { courseStatus, kskc, yxkc } = useContext(myContext);
  console.log('333', courseStatus, kskc, yxkc);
  return <div className={`${styles.tabHeader}`}>
    
  </div>;
};

export default CourseTab;
