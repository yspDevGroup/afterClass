// import React from 'react';
import { Tabs } from 'antd';
import PageContainer from '@/components/PageContainer';
import ServiceClass from './ServiceClass';
import CourseClass from './CourseClass';
import { useEffect, useState } from 'react';
import { getQueryString } from '@/utils/utils';

const { TabPane } = Tabs;

const index = (props: { location: { state: any } }) => {
  const { state } = props.location;

  const [keys, setKeys] = useState<string>();
  useEffect(() => {
    const indexs = getQueryString('index');
    if (indexs) {
      setKeys(indexs)
    } else if (state) {
      setKeys(state?.type)
    } else {
      setKeys('1')
    }
  }, [])
  return (
    <PageContainer>
      <Tabs activeKey={keys}>
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
