import React from 'react';
import { Tabs } from 'antd';
import PageContainer from '@/components/PageContainer';
import SubstituteFor from './SubstituteFor';
import Adjustment from './Adjustment';

const { TabPane } = Tabs;
/**
 * 调代课管理
 * @returns
 */
const LeaveManagement = () => {
  return (
    <PageContainer>
      <Tabs>
        <TabPane tab="教师调课" key="1">
          <Adjustment />
        </TabPane>
        <TabPane tab="教师代课" key="2">
          <SubstituteFor />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default LeaveManagement;
