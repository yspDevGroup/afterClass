import { Tabs } from 'antd';
import PageContainer from '@/components/PageContainer';
import CourseRefund from './CourseRefund';
import ServiceRefund from './ServiceRefund';
import ServiceAterClass from './ServiceAterClass';
import { useEffect, useState } from 'react';
import { getQueryString } from '@/utils/utils';

const { TabPane } = Tabs;
const Index = () => {
  const [keys, setKeys] = useState<string>();
  useEffect(() => {
    const index = getQueryString('index');
    if (index) {
      setKeys(index)
    } else {
      setKeys('1')
    }
  }, [])

  return (
    <PageContainer>
      <Tabs
        activeKey={keys}
        onChange={(key) => {
          setKeys(key)
        }}
      >
        <TabPane tab="课后服务退款" key="1">
          <ServiceAterClass />
        </TabPane>
        <TabPane tab="课程服务退款" key="2">
          <CourseRefund />
        </TabPane>
        <TabPane tab="增值服务退款" key="3">
          <ServiceRefund />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};
export default Index;
