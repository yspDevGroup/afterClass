/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-15 09:57:23
 * @LastEditTime: 2021-09-15 11:46:24
 * @LastEditors: Sissle Lynn
 */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { useModel } from 'umi';
import { Tabs } from 'antd';
import { enHenceMsg } from '@/utils/utils';
import Nodata from '@/components/Nodata';
import GoBack from '@/components/GoBack';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getAllKHXSQJ } from '@/services/after-class/khxsqj';

import styles from './index.less';
import LeaveForm from './Components/LeaveForm';
const { TabPane } = Tabs;

const AskForLeave: React.FC = () => {
  const [leaveInfo, setLeaveInfo] = useState<API.KHXSQJ[]>([]);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const fetch = async () => {
    // 获取后台学年学期数据
    const result = await queryXNXQList(currentUser?.xxId, undefined);
    if (result.current) {
      const { student } = currentUser || {};
      const res = await getAllKHXSQJ({
        XSId: student && student.student_userid || '20210901',
        XNXQId: result.current.id,
      });
      if (res.status === 'ok') {
        if (res.data && res.data?.rows) {
          setLeaveInfo(res.data.rows);
        }
      } else {
        enHenceMsg(res.message);
      }
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  return (
    <>
      <GoBack title={'请假'} onclick="/parent/home?index=study" />
      <div className={styles.leaveList}>
        <Tabs defaultActiveKey='apply' centered={true}>
          <TabPane tab="我要请假" key="apply">
            <LeaveForm />
          </TabPane>
          <TabPane tab="请假记录" key="history">

          </TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default AskForLeave;
