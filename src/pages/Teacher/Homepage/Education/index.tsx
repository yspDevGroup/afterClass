import React, { useEffect, useState } from 'react';
import 'antd/es/modal/style';
import { useModel } from 'umi';
import ClassCalendar from './ClassCalendar';
import { ParentHomeData } from '@/services/local-services/mobileHome';

import styles from './index.less';
import OperationBar from './OperationBar';

const Study = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [courseData, setCourseData] = useState<any>([]);
  useEffect(() => {
    (async () => {
      const oriData = await ParentHomeData( 'teacher',currentUser?.xxId, currentUser.JSId || testTeacherId);
      const { yxkc } = oriData.data;
      setCourseData(yxkc);
    })()
  }, []);
  return (
    <div className={styles.studyPage}>
      <div className={styles.funWrapper}>
        <OperationBar courseData={courseData} />
        <div className={styles.titleBar}>我的课表</div>
        <ClassCalendar />
      </div>
    </div>
  );
};

export default Study;
