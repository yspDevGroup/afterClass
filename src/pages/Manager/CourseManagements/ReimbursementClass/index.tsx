import { Tabs } from 'antd';
import PageContainer from '@/components/PageContainer';
import CourseUnsubscribe from './CourseUnsubscribe';
import ServiceUnsubscribe from './ServiceUnsubscribe';
import ServiceAterClass from './ServiceAterClass';

const { TabPane } = Tabs;
const Index = () => {
  return (
    <PageContainer>
      <Tabs>
        <TabPane tab="课后服务退订" key="3">
          <ServiceAterClass />
        </TabPane>
        <TabPane tab="课程服务退订" key="1">
          <CourseUnsubscribe />
        </TabPane>
        <TabPane tab="增值服务退订" key="2">
          <ServiceUnsubscribe />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};
export default Index;
