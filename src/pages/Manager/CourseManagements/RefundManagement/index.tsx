import { Tabs } from 'antd';
import PageContainer from '@/components/PageContainer';
import CourseRefund from './CourseRefund';
import ServiceRefund from './ServiceRefund';

const { TabPane } = Tabs;
const Index = (props: any) => {
  const { index } = props.history.location.query;
  return (
    <PageContainer>
      <Tabs defaultActiveKey={index ? index : "1"}>
        <TabPane tab="课程退款" key="1">
          <CourseRefund />
        </TabPane>
        <TabPane tab="服务退款" key="2">
          <ServiceRefund  />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};
export default Index;
