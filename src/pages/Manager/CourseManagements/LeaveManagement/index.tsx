import React from 'react';
import { Tabs } from 'antd';
import PageContainer from '@/components/PageContainer';
import StudentsLeave from './StudentsLeave';
import TeacherLeave from './TeacherLeave';

const { TabPane } = Tabs;
/**
 * 请假管理
 * @returns
 */
const LeaveManagement = () => {
  return (
    <PageContainer>
      <Tabs>
        <TabPane tab="教师请假" key="1">
          <TeacherLeave />
        </TabPane>
        <TabPane tab="学生请假" key="2">
          <StudentsLeave />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default LeaveManagement;
