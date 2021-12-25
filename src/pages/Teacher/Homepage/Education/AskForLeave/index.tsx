/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-15 09:57:23
 * @LastEditTime: 2021-12-08 17:47:58
 * @LastEditors: Sissle Lynn
 */
import React, { useEffect, useState } from 'react';
import { useModel, history } from 'umi';
import { enHenceMsg } from '@/utils/utils';
import GoBack from '@/components/GoBack';
import LeaveHistory from './Components/LeaveHistory';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getAllKHJSQJ } from '@/services/after-class/khjsqj';
import icon_leave from '@/assets/icon-teacherLeave.png';
import styles from './index.less';

const AskForLeave = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [curXNXQId, setCurXNXQId] = useState<any>();
  const [leaveInfo, setLeaveInfo] = useState<API.KHXSQJ[]>([]);

  const fetch = async () => {
    // 获取后台学年学期数据
    const result = await queryXNXQList(currentUser?.xxId, undefined);
    if (result.current) {
      setCurXNXQId(result.current.id);
    }
  };
  const getData = async () => {
    const res = await getAllKHJSQJ({
      XXJBSJId: currentUser?.xxId,
      JZGJBSJId: currentUser?.JSId || testTeacherId,
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
    getData();
  }, [curXNXQId])
  return (
    <>
      <GoBack title={'请假记录'} teacher onclick="/teacher/home?index=education" />
      <div className={styles.leaveList}>
        <LeaveHistory leaveInfo={leaveInfo} getData={getData} />
        <div
          className={styles.apply}
          onClick={() => {
            history.push('/teacher/education/askForLeave/newLeave');
          }}
        >
          <div>
            <img src={icon_leave} />
          </div>
          我要请假
        </div>
      </div>
    </>
  );
};

export default AskForLeave;
