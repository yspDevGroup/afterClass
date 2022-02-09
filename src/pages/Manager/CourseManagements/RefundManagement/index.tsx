import { Tabs } from 'antd';
import PageContainer from '@/components/PageContainer';
import CourseRefund from './CourseRefund';
import ServiceRefund from './ServiceRefund';
import ServiceAterClass from './ServiceAterClass';

const { TabPane } = Tabs;
const Index = () => {
  return (
    <PageContainer>
      <Tabs>
        <TabPane tab="课后服务退款" key="3">
          <ServiceAterClass />
        </TabPane>
        <TabPane tab="课程服务退款" key="1">
          <CourseRefund />
        </TabPane>
        <TabPane tab="增值服务退款" key="2">
          <ServiceRefund />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};
export default Index;
