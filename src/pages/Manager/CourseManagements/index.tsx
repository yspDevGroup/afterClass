import React from 'react';
import { Tabs } from 'antd';
import PageContainer from '@/components/PageContainer';
import CourseList from './courseList';
import CourseHistory from './courseHistory';
import CourseNotIntroduced from './courseNotIntroduced';

const { TabPane } = Tabs;

/**
 * 课程管理
 * @returns
 */
const index = () => {
  const callback = (key: any) => {
    console.log(key);
  };

  return (
    <PageContainer>
      <Tabs onChange={callback}>
        <TabPane tab="本校课程" key="1">
          <CourseList />
        </TabPane>
        <TabPane tab="可选课程" key="2">
          <CourseNotIntroduced />
        </TabPane>
        <TabPane tab="课程历史记录" key="3">
          <CourseHistory />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default index;
