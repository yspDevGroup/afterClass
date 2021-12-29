import { Tabs } from 'antd';
import PageContainer from '@/components/PageContainer';
import CourseUnsubscribe from './CourseUnsubscribe';
import ServiceUnsubscribe from './ServiceUnsubscribe';
import ServiceAterClass from './ServiceAterClass';

const { TabPane } = Tabs;
const Index = (props: any) => {
  const { index } = props.history.location.query;
  return (
    <PageContainer>
      <Tabs defaultActiveKey={index ? index : "1"}>
        <TabPane tab="课程服务退订" key="1">
          <CourseUnsubscribe />
        </TabPane>
        <TabPane tab="课后服务退订" key="2">
          <ServiceAterClass />
        </TabPane>
        <TabPane tab="增值服务退订" key="3">
          <ServiceUnsubscribe />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};
export default Index;
