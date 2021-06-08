import React from 'react';
import { Link } from 'umi';
import { Tabs } from 'antd';
import ListComponent from '@/components/ListComponent';
import { courseData } from '../listData';
import styles from '../index.less';

const { TabPane } = Tabs;
const CourseTab = () => {
  return <div className={styles.tabHeader}>
    <Tabs tabBarExtraContent={{ right: <Link to='/parent/home'>全部 {'>'}</Link> }} className={styles.courseTab}>
      <TabPane tab="开设课程" key="setup">
        <Tabs className={styles.courseType}>
          <TabPane tab="文化" key="culture">
            <ListComponent listData={courseData} />
          </TabPane>
          <TabPane tab="艺术" key="art">

          </TabPane>
          <TabPane tab="科技" key="tech">

          </TabPane>
          <TabPane tab="体育" key="sports">

          </TabPane>
        </Tabs>
      </TabPane>
      <TabPane tab="已选课程" key="elective">
        <ListComponent listData={courseData} />
      </TabPane>
    </Tabs>
  </div>;
};

export default CourseTab;
