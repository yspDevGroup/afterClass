import { Tabs } from 'antd';
import PageContainer from '@/components/PageContainer';
import CourseUnsubscribe from './CourseUnsubscribe';
import ServiceUnsubscribe from './ServiceUnsubscribe';
import ServiceAterClass from './ServiceAterClass';
import { useEffect, useState } from 'react';
import { getQueryString } from '@/utils/utils';

const { TabPane } = Tabs;
const Index = () => {
  const [keys, setKeys] = useState<string>();
  useEffect(() => {
    const index = getQueryString('index');
    if (index) {
      setKeys(index);
    } else {
      setKeys('1');
    }
  }, []);
  return (
    <PageContainer>
      <Tabs
        activeKey={keys}
        onChange={(key) => {
          setKeys(key);
        }}
      >
        <TabPane tab="课后服务退订" key="1">
          <ServiceAterClass />
        </TabPane>
        <TabPane tab="缤纷课堂退订" key="2">
          <CourseUnsubscribe />
        </TabPane>
        <TabPane tab="增值服务退订" key="3">
          <ServiceUnsubscribe />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};
export default Index;
