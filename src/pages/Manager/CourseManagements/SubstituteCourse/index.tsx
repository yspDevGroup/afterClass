import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { useModel } from 'umi';
import SubstituteFor from './SubstituteFor';
import Adjustment from './Adjustment';
import PageContainer from '@/components/PageContainer';
import WWOpenDataCom from '@/components/WWOpenDataCom';
import { getAllJZGJBSJ } from '@/services/after-class/jzgjbsj';

const { TabPane } = Tabs;
/**
 * 调代课管理
 * @returns
 */
const LeaveManagement = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // 教师
  const [teacherData, setTeacherData] = useState<any[]>([]);
  // 获取教师
  useEffect(() => {
    (async () => {
      const res = await getAllJZGJBSJ({ XXJBSJId: currentUser?.xxId, page: 0, pageSize: 0 });
      if (res.status === 'ok') {
        const data = res.data?.rows;
        const teachOption: { label: string | JSX.Element; value: string; WechatUserId?: string }[] =
          [];
        data?.forEach((item: any) => {
          // 兼顾企微
          const label =
            item.XM === '未知' && item.WechatUserId ? (
              <WWOpenDataCom type="userName" openid={item.WechatUserId} />
            ) : (
              item.XM
            );
          teachOption.push({
            label,
            value: item.id,
            WechatUserId: item.WechatUserId,
          });
        });
        setTeacherData(teachOption);
      }
    })()
  }, [])
  return (
    <PageContainer>
      <Tabs>
        <TabPane tab="教师调课" key="1">
          <Adjustment teacherData={teacherData} />
        </TabPane>
        <TabPane tab="教师代课" key="2">
          <SubstituteFor teacherData={teacherData} />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default LeaveManagement;
