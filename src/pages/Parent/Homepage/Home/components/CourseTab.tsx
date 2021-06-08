import React from 'react';
import { Link } from 'umi';
import { Tabs } from 'antd';
import styles from '../index.less';

const { TabPane } = Tabs;
const CourseTab = () => {
  return <div className={styles.tabHeader}>
    <Tabs tabBarExtraContent={{ right: <Link to='/parent/home'>全部 {'>'}</Link> }} className={styles.courseTab}>
      <TabPane tab="开设课程" key="setup">
        开设课程
      </TabPane>
      <TabPane tab="已选课程" key="elective">
        已选课程
      </TabPane>
    </Tabs>
  </div>;
};

export default CourseTab;
