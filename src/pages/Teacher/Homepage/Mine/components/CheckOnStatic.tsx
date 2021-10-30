/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-10-26 16:18:21
 * @LastEditTime: 2021-10-26 17:40:17
 * @LastEditors: Sissle Lynn
 */
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import CheckOnChart from './CheckOnChart';
import Nodata from '@/components/Nodata';

import styles from '../index.less';
import noChart from '@/assets/noChart1.png';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { useModel } from 'umi';
import { countKHJSCQ } from '@/services/after-class/khjscq';

const CheckOnStatic = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [satistics, setStatistics] = useState<any[]>();
  const convertData = (data: any) => {
    if (data) {
      const toDo = data.KSS - data.attendance - data.leave - data.substitute - data.absenteeism;
      return {
        title: `${data.KCMC}/${data.BJMC}`,
        zc: data.normal,
        yc: data.abnormal,
        ds: data.remain,
        data: [
          {
            label: `${data.KCMC}/${data.BJMC}`,
            type: '正常',
            value: data.attendance,
            color: 'l(180) 0:rgba(137, 218, 140, 1) 1:rgba(137, 218, 140, 0.2)',
          },
          {
            label: `${data.KCMC}/${data.BJMC}`,
            type: '请假',
            value:  data.leave,
            color: 'l(180) 0:rgba(242, 200, 98, 0.2) 1:rgba(242, 200, 98, 1)',
          },
          {
            label: `${data.KCMC}/${data.BJMC}`,
            type: '代课',
            value: data.substitute,
            color: 'l(180) 0:rgba(172, 144, 251, 0.2) 1:rgba(172, 144, 251, 1)',
          },
          {
            label: `${data.KCMC}/${data.BJMC}`,
            type: '异常',
            value: data.absenteeism,
            color: 'l(180) 0:rgba(244, 138, 130, 0.2) 1:rgba(244, 138, 130, 1)',
          },
          {
            label: `${data.KCMC}/${data.BJMC}`,
            type: '待上',
            value: toDo > 0 ? toDo : 0,
            color: 'l(180) 0:rgba(221, 221, 221, 0.2) 1:rgba(221, 221, 221, 1)',
          },
        ]
      }
    }
    return {}
  };

  useEffect(() => {
    (async () => {
      const result = await queryXNXQList(currentUser?.xxId);
      if (result.current) {
        const res = await countKHJSCQ({
          XNXQId: result.current.id,
          JZGJBSJId: currentUser.JSId || testTeacherId
        });
        if (res.status === 'ok') {
          const arr = [].map.call(res.data, (item) => {
            return convertData(item);
          })
          setStatistics(arr || []);
        }
      }
    })()
  }, [])
  return (
    <div className={styles.funWrapper}>
      <div className={styles.titleBar}>
        出勤统计
        <div>
          <span />
          正常
          <span />
          待上
          <br />
          <span />
          请假
          <span />
          代课
          <span />
          异常
        </div>
      </div>
      {satistics && satistics.length ? (
        <Row gutter={8}>
          {satistics.map((item: any) => {
            return (
              <Col span={12}>
                <CheckOnChart data={item.data} title={item.title} key={item.title} />
              </Col>
            );
          })}
        </Row>
      ) : (
        <Nodata imgSrc={noChart} desc="暂无数据" />
      )}
    </div>
  );
};

export default CheckOnStatic;
