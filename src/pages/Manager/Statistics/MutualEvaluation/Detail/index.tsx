import PageContainer from '@/components/PageContainer';
import { LeftOutlined } from '@ant-design/icons';
import { Button, Tabs } from 'antd';
import TabList from './compoents/TabList'
import { history } from 'umi';
import styles from '../index.less';

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
        <div className={styles.TopSearchss}>
          <span>课程名称：{data?.record?.KHKCSJ?.KCMC}</span>
          <span style={{ marginLeft: '20px' }}>班级名称：{data?.record?.BJMC}</span>
        </div>
        <Tabs>
          <TabPane tab="学生评价" key="1">
            <TabList ListData={{ ListName: '学生评价', ListState: data }} />
          </TabPane>
          <TabPane tab="课程反馈" key="2">
            <TabList ListData={{ ListName: '课程反馈', ListState: data }} />
          </TabPane>
        </Tabs>
      </PageContainer>
    </div>
  );
};
export default Detail;
