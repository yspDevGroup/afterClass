/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-16 11:53:39
 * @LastEditTime: 2021-09-17 12:07:07
 * @LastEditors: Sissle Lynn
 */
import { useEffect } from 'react';
import { Button, message } from 'antd';
import moment from 'moment';

import Nodata from '@/components/Nodata';
import { updateKHXSQJ } from '@/services/after-class/khxsqj';
import { enHenceMsg } from '@/utils/utils';
import { compareNow } from '@/utils/Timefunction';
import noData from '@/assets/noData.png';

import styles from '../index.less';

type propsType = {
  leaveInfo: API.KHXSQJ[];
  getData: () => Promise<void>;
};
const LeaveHistory = (props: propsType) => {
  const { leaveInfo, getData } = props;
  const handleCancle = async (d: any) => {
    const res = await updateKHXSQJ({ id: d.id }, { QJZT: 1 });
    if (res.status === 'ok') {
      message.success(`请假申请已撤销`);
      getData();
    } else {
      enHenceMsg(res.message);
    }
  };
  useEffect(()=>{
    getData();
  },[])
  return (
    <div className={styles.listWrapper}>
      {leaveInfo.length ? (
        leaveInfo.map((item: any) => {
          const con1 = compareNow(item.KHQJKCs?.[0].QJRQ, item.KSSJ);
          return (
            <div className={styles.Information}>
              <div>
                <h4>{item.XSXM}的请假{item.QJZT === 1 ? <span>已撤销</span> : ''}</h4>
                <span>
                  {moment(item.updatedAt||item.createdAt).format('YYYY.MM.DD')}
                </span>
              </div>
              <p>时间：{moment(item.KHQJKCs?.[0].QJRQ).format('MM月DD日')} {item.KSSJ}-{item.JSSJ}</p>
              <p>课程：{item.KHQJKCs?.map((it: any) => it.KCMC)}</p>
              <p>原因：{item.QJYY}</p>
              {item.QJZT === 0 && con1 ? (
                <Button onClick={() => handleCancle(item)}>
                  撤销
                </Button>
              ) : ('')}
            </div>
          );
        })
      ) : (
        <Nodata imgSrc={noData} desc="暂无请假记录" />
      )}
    </div>
  );
};
export default LeaveHistory;
