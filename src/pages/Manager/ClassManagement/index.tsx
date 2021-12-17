// import React from 'react';
import { Tabs } from 'antd';
import PageContainer from '@/components/PageContainer';
import ServiceClass from './ServiceClass';
import CourseClass from './CourseClass';

const { TabPane } = Tabs;

const index = () => {
  return (
    <PageContainer>
      <Tabs>
        <TabPane tab="服务课堂" key="1">
          <ServiceClass location={{
            state: undefined
          }} />
        </TabPane>
        <TabPane tab="缤纷课堂" key="2">
          <CourseClass location={{
            state: undefined
          }} />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default index;
