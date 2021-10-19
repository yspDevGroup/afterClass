import PageContainer from '@/components/PageContainer';
import { LeftOutlined } from '@ant-design/icons';
import { Button, Tabs } from 'antd';
import TabList from './compoents/TabList'
import { history } from 'umi';

const { TabPane } = Tabs;

const Detail = (props: any) => {
  const { data } = props.location.state;
  return (
    <div>
      <PageContainer>
        <Button
          type="primary"
          onClick={() => {
            history.go(-1);
          }}
          style={{
            marginBottom: '24px',
          }}
        >
          <LeftOutlined />
          返回上一页
        </Button>
        <Tabs>
          <TabPane tab="学生评价" key="1">
            <TabList ListData={{ ListName: '学生评价', ListState: data }}></TabList>
          </TabPane>
          <TabPane tab="课程反馈" key="2">
            <TabList ListData={{ ListName: '课程反馈', ListState: data }}></TabList>
          </TabPane>
        </Tabs>
      </PageContainer>
    </div>
  );
};
export default Detail;
