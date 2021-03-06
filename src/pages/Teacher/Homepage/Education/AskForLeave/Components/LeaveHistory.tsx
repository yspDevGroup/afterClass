/* eslint-disable no-nested-ternary */
/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-16 11:53:39
 * @LastEditTime: 2021-12-10 13:28:54
 * @LastEditors: zpl
 */
import { useEffect } from 'react';
import { Button, Divider, message } from 'antd';
import moment from 'moment';
import Nodata from '@/components/Nodata';
import { enHenceMsg } from '@/utils/utils';
// import { compareNow } from '@/utils/Timefunction';
import noData from '@/assets/noData.png';

import styles from '../index.less';
import ShowName from '@/components/ShowName';
import { updateKHJSQJ } from '@/services/after-class/khjsqj';

type propsType = {
  leaveInfo: API.KHXSQJ[];
  getData: () => Promise<void>;
};
const LeaveHistory = (props: propsType) => {
  const { leaveInfo, getData } = props;
  const handleCancle = async (d: any) => {
    const res = await updateKHJSQJ({ id: d.id }, { QJZT: 3 });
    if (res.status === 'ok') {
      message.success(`请假申请已撤销`);
      getData();
    } else {
      enHenceMsg(res.message);
      getData();
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className={styles.listWrapper}>
      {leaveInfo.length ? (
        leaveInfo.map((item: any) => {
          return (
            <div className={styles.Information}>
              <div>
                <h4>
                  <ShowName
                    type="userName"
                    openid={item?.JZGJBSJ?.WechatUserId}
                    XM={item.JZGJBSJ?.XM}
                  />
                  的请假
                  {item.QJZT === 3 ? (
                    <span>已撤销</span>
                  ) : item.QJZT === 0 ? (
                    <span style={{ color: '#FFB257', borderColor: '#FFB257' }}>申请中</span>
                  ) : item.QJZT === 1 ? (
                    <span style={{ color: '#15B628', borderColor: '#15B628' }}>已同意</span>
                  ) : item.QJZT === 2 ? (
                    <span style={{ color: '#FF4B4B', borderColor: '#FF4B4B' }}>已驳回</span>
                  ) : (
                    ''
                  )}
                </h4>
                <span>{moment(item.updatedAt || item.createdAt).format('YYYY.MM.DD')}</span>
              </div>
              <p>
                时间：{moment(item?.KHJSQJKCs?.[0].QJRQ).format('MM月DD日')} {item.KSSJ}-{item.JSSJ}
              </p>
              <p>
                课程：
                {item?.KHJSQJKCs?.map((it: any) => (
                  <>{it.KCMC} &nbsp; </>
                ))}
              </p>
              <p>原因：{item?.QJYY}</p>
              {item?.BZ ? (
                <>
                  {' '}
                  <Divider />
                  <p>审批说明：{item?.BZ}</p>
                </>
              ) : (
                <></>
              )}
              {item.QJZT === 0 ? <Button onClick={() => handleCancle(item)}>撤销</Button> : ''}
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
