/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-15 09:57:23
 * @LastEditTime: 2021-12-08 17:47:58
 * @LastEditors: Sissle Lynn
 */
import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { useModel } from 'umi';
import GoBack from '@/components/GoBack';
import styles from './index.less';
import LeaveForm from './Components/LeaveForm';
import LeaveHistory from './Components/LeaveHistory';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { enHenceMsg } from '@/utils/utils';
import { getAllKHJSQJ } from '@/services/after-class/khjsqj';

const { TabPane } = Tabs;

const AskForLeave =() => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [curXNXQId, setCurXNXQId] = useState<any>();
  const [activeKey, setActiveKey] = useState<string>('apply');
  const [leaveInfo, setLeaveInfo] = useState<API.KHXSQJ[]>([]);
  const [reload, setReload] = useState<boolean>(false);

  const fetch = async () => {
    // 获取后台学年学期数据
    const result = await queryXNXQList(currentUser?.xxId, undefined);
    if (result.current) {
      setCurXNXQId(result.current.id);
    }
  };
  const getData = async () => {
    const res = await getAllKHJSQJ({
      XXJBSJId:currentUser?.xxId,
      JZGJBSJId:currentUser?.JSId || testTeacherId,
      XNXQId: curXNXQId,
    });
    if (res.status === 'ok') {
      if (res.data && res.data?.rows) {
        setLeaveInfo(res.data.rows);
      }
    } else {
      enHenceMsg(res.message);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  useEffect(() => {
    if (activeKey === 'history' && reload) {
      getData();
    }
  }, [activeKey, reload]);
  return (
    <>
      <GoBack title={'请假'} teacher onclick="/teacher/home?index=education" />
      <div className={styles.leaveList}>
        <Tabs
          activeKey={activeKey}
          centered={true}
          onChange={(key) => {
            setActiveKey(key);
          }}
        >
          <TabPane tab="我要请假" key="apply">
            {activeKey === 'apply' ? (
              <LeaveForm setActiveKey={setActiveKey} setReload={setReload} />
            ) : (
              ''
            )}
          </TabPane>
          <TabPane tab="请假记录" key="history">
            <LeaveHistory leaveInfo={leaveInfo} getData={getData} />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default AskForLeave;
