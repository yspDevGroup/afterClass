import { Tabs } from 'antd';
import PageContainer from '@/components/PageContainer';
import CourseUnsubscribe from './CourseUnsubscribe';
import ServiceUnsubscribe from './ServiceUnsubscribe';

const { TabPane } = Tabs;
const Index = (props: any) => {
  const { index } = props.history.location.query;
  return (
    <PageContainer>
      <Tabs defaultActiveKey={index ? index : "1"}>
        <TabPane tab="课程退订" key="1">
          <CourseUnsubscribe />
        </TabPane>
        <TabPane tab="服务退订" key="2">
          <ServiceUnsubscribe />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};
export default Index;
