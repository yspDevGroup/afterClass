import PageContainer from '@/components/PageContainer';
import { Tabs, } from 'antd';
import Table from './compoents/TableList'
const { TabPane } = Tabs;
const LeaveManagement = () => {

  return (
    <PageContainer>
      <Tabs>
        <TabPane tab="教师考勤统计" key="1">
          <Table TableList={{ position: '老师' }} />
        </TabPane>

        <TabPane tab="学生考勤统计" key="2">
          <Table TableList={{ position: '学生' }} />
        </TabPane>
      </Tabs>

    </PageContainer>
  )
}
export default LeaveManagement
