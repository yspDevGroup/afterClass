import { Tabs } from 'antd';
import PageContainer from '@/components/PageContainer';
import CourseRefund from './CourseRefund';
import ServiceRefund from './ServiceRefund';
import ServiceAterClass from './ServiceAterClass';

const { TabPane } = Tabs;
const Index = (props: any) => {
  const { index } = props.history.location.query;
  return (
    <PageContainer>
      <Tabs defaultActiveKey={index ? index : "3"}>
        <TabPane tab="课后服务退款" key="3">
          <ServiceAterClass />
        </TabPane>
        <TabPane tab="课程服务退款" key="1">
          <CourseRefund />
        </TabPane>
        <TabPane tab="增值服务退款" key="2">
          <ServiceRefund  />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};
export default Index;
