// import React from 'react';
import { Tabs } from 'antd';
import PageContainer from '@/components/PageContainer';
import ServiceClass from './ServiceClass';
import CourseClass from './CourseClass';

const { TabPane } = Tabs;

const index = (props: { location: { state: any } }) => {
  const { state } = props.location;

  return (
    <PageContainer>
      <Tabs defaultActiveKey={state?.type || '1'}>
        <TabPane tab="服务课堂" key="1">
          <ServiceClass
            location={{
              state: state?.record,
            }}
          />
        </TabPane>
        <TabPane tab="缤纷课堂" key="2">
          <CourseClass
            location={{
              state: state?.record,
            }}
          />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default index;
