// import React from 'react';
import { Tabs } from 'antd';
import PageContainer from '@/components/PageContainer';
import ClassScheduling from './ClassScheduling';
import CourseScheduling from './CourseScheduling';


const { TabPane } = Tabs;

const index = (props: { location: { state: any } }) => {
  const { state } = props.location;

  return (
    <PageContainer>
      <Tabs defaultActiveKey={state?.type || '1'}>
        <TabPane tab="行政班排课" key="1">
          <ClassScheduling />
        </TabPane>
        <TabPane tab="课程班排课" key="2">
          <CourseScheduling />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default index;
