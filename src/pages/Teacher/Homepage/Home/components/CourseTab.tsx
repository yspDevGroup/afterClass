import React from 'react';
import { Link } from 'umi';
import { Tabs } from 'antd';
import ListComponent from '@/components/ListComponent';
import { courseData } from '../../listData';
import styles from '../index.less';
import { ListData } from '@/components/ListComponent/data';

const { TabPane } = Tabs;
const CourseTab = (props: {cls?: string; listData?: ListData; centered?: boolean}) => {
  const {cls,listData=courseData, centered=false } = props;
  return <div className={`${styles.tabHeader} ${cls}`}>
    <Tabs centered={centered} tabBarExtraContent={ !centered ? { right: <Link to='/parent/home/course'>全部 {'>'}</Link> } : ''} className={styles.courseTab}>
      <TabPane tab="开设课程" key="setup">
        <Tabs className={styles.courseType}>
          <TabPane tab="文化" key="culture">
            <ListComponent listData={listData} />
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
        <ListComponent listData={listData} />
      </TabPane>
    </Tabs>
  </div>;
};

export default CourseTab;
