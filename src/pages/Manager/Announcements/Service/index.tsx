import { Tabs } from 'antd';
import PageContainer from '@/components/PageContainer';
import Detail from './Detail';
import { getQueryString } from '@/utils/utils';

const { TabPane } = Tabs;
const ServiceSetting = (props: any) => {
  const type = getQueryString('type');
  return (
    <PageContainer cls='serviceSetting'>
      <Tabs defaultActiveKey={type ? type : "normal"}>
        <TabPane tab="课后服务协议" key="normal">
          <Detail type='normal' />
        </TabPane>
        <TabPane tab="缤纷课堂协议" key="service">
          <Detail type='service' />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};
ServiceSetting.wrappers = ['@/wrappers/auth'];
export default ServiceSetting;
