/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-10-26 16:18:21
 * @LastEditTime: 2022-04-06 17:34:48
 * @LastEditors: Sissle Lynn
 */
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { useModel } from 'umi';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { countKHJSCQ, statisSubstitute } from '@/services/after-class/khjscq';
import BarChart from './BarChart';
import PieChart from './PieChart';

import Nodata from '@/components/Nodata';
import styles from '../index.less';
import noChart from '@/assets/noChart1.png';

const CheckOnStatic = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // 考勤数据
  const [satistics, setStatistics] = useState<any[]>();
  // 代课数据
  const [replace, setReplace] = useState<any[]>([]);
  // 转换考勤数据格式
  const convertData = (data: any, type: string) => {
    if (data && type === 'attendance') {
      const toDo =
        data.ALL_KSS -
        Number(data.attendance) -
        Number(data.leave) -
        Number(data.substitute) -
        Number(data.absenteeism);
      return {
        title: `${data.KCMC}`,
        subTitle: `${data.BJMC}`,
        zc: data.normal,
        yc: data.abnormal,
        ds: data.remain,
        data: [
          {
            label: `${data.KCMC}/${data.BJMC}`,
            type: '正常',
            value: Number(data.attendance),
            color: 'l(180) 0:rgba(137, 218, 140, 1) 1:rgba(137, 218, 140, 0.2)',
          },
          {
            label: `${data.KCMC}/${data.BJMC}`,
            type: '请假',
            value: Number(data.leave),
            color: 'l(180) 0:rgba(242, 200, 98, 0.2) 1:rgba(242, 200, 98, 1)',
          },
          {
            label: `${data.KCMC}/${data.BJMC}`,
            type: '代课',
            value: Number(data.substitute),
            color: 'l(180) 0:rgba(172, 144, 251, 0.2) 1:rgba(172, 144, 251, 1)',
          },
          {
            label: `${data.KCMC}/${data.BJMC}`,
            type: '异常',
            value: Number(data.absenteeism),
            color: 'l(180) 0:rgba(244, 138, 130, 0.2) 1:rgba(244, 138, 130, 1)',
          },
          {
            label: `${data.KCMC}/${data.BJMC}`,
            type: '待上',
            value: toDo > 0 ? toDo : 0,
            color: 'l(180) 0:rgba(221, 221, 221, 0.2) 1:rgba(221, 221, 221, 1)',
          },
        ],
      };
    }
    if (data && type === 'rlbj') {
      return {
        title: `${data.KCMC}`,
        subTitle: `${data.BJMC}`,
        zc: data.normal,
        yc: data.abnormal,
        ds: data.remain,
        data: [
          {
            label: `${data.KCMC}/${data.BJMC}`,
            type: '正常',
            value: Number(data.attendance),
            color: 'l(180) 0:rgba(137, 218, 140, 1) 1:rgba(137, 218, 140, 0.2)',
          },
          {
            label: `${data.KCMC}/${data.BJMC}`,
            type: '请假',
            value: Number(data.leave),
            color: 'l(180) 0:rgba(242, 200, 98, 0.2) 1:rgba(242, 200, 98, 1)',
          },
          {
            label: `${data.KCMC}/${data.BJMC}`,
            type: '代课',
            value: Number(data.substitute),
            color: 'l(180) 0:rgba(172, 144, 251, 0.2) 1:rgba(172, 144, 251, 1)',
          },
          {
            label: `${data.KCMC}/${data.BJMC}`,
            type: '异常',
            value: Number(data.absenteeism),
            color: 'l(180) 0:rgba(244, 138, 130, 0.2) 1:rgba(244, 138, 130, 1)',
          },
        ],
      };
    }
    if (data && type === 'replace') {
      const { count, cq_count, qq_count } = data;
      const num = Number(count) - Number(cq_count) - Number(qq_count);
      return [
        {
          label: `${data.XM}`,
          type: '考勤正常',
          value: num < 0 ? count : cq_count,
        },
        {
          label: `${data.XM}`,
          type: '考勤异常',
          value: qq_count < 0 ? 0 : qq_count,
        },
        {
          label: `${data.XM}`,
          type: '待上课',
          value: num < 0 ? 0 : num,
        },
      ];
    }
    return {};
  };

  useEffect(() => {
    (async () => {
      const result = await queryXNXQList(currentUser?.xxId);
      if (result.current) {
        const res = await countKHJSCQ({
          XNXQId: result.current.id,
          JZGJBSJId: currentUser.JSId || testTeacherId,
        });
        if (res.status === 'ok') {
          const arr = [].map.call(res.data.SKBJs, (item) => {
            return convertData(item, 'attendance');
          });
          const arrs = [].map.call(res.data.RLBJs, (item) => {
            return convertData(item, 'rlbj');
          });
          setStatistics([...arr, ...arrs] || []);
        }
        const response = await statisSubstitute({
          XNXQId: result.current.id,
          JZGJBSJId: currentUser.JSId || testTeacherId,
        });
        if (response.status === 'ok') {
          let newArr: any[] = [];
          response.data?.forEach((item: any) => {
            newArr = newArr.concat(convertData(item, 'replace'));
          });
          setReplace(newArr);
        }
      }
    })();
  }, []);
  return (
    <>
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
                <Col span={12} key={item.id}>
                  <PieChart
                    data={item.data}
                    title={item.title}
                    subTitle={item.subTitle}
                    key={item.title}
                  />
                </Col>
              );
            })}
          </Row>
        ) : (
          <Nodata imgSrc={noChart} desc="暂无数据" />
        )}
      </div>
      <div className={styles.funWrapper}>
        <div className={styles.titleBar}>代课统计</div>
        {replace && replace.length ? (
          <BarChart data={replace} />
        ) : (
          <Nodata imgSrc={noChart} desc="暂无数据" />
        )}
      </div>
    </>
  );
};

export default CheckOnStatic;
