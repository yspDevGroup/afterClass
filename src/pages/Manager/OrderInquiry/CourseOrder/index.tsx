import { Tabs } from 'antd';
import PageContainer from '@/components/PageContainer';
import Expired from './expired';

const { TabPane } = Tabs;
const Index = () => {
  return (
    <PageContainer>
      <Tabs>
        <TabPane tab="已付款" key="2">
          <Expired TabState="已付款" />
        </TabPane>
        <TabPane tab="待付款" key="1">
          <Expired TabState="代付款" />
        </TabPane>
        <TabPane tab="已过期" key="3">
          <Expired TabState="已过期" />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};
export default Index;
