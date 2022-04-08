/*
 * @description:
 * @author: lyy
 * @Date: 2021-06-11 14:33:28
 * @LastEditTime: 2022-04-06 17:34:42
 * @LastEditors: Sissle Lynn
 */
import React from 'react';
import { Bar } from '@ant-design/charts';

import styles from '../index.less';

const BarChart = (props: { data: any[] | undefined; title?: string; cls?: string }) => {
  const { data, cls } = props;
  const config: any = {
    data,
    height: 200,
    xField: 'value',
    yField: 'label',
    seriesField: 'type',
    padding: [30, 10, 30, 60],
    isStack: true,
    maxBarWidth: 18,
    marginRatio: 0.3,
    barStyle: {
      radius: [10, 10, 0, 0],
    },
    color: [
      'l(180) 0:rgba(137, 218, 140, 0.2) 1:rgba(137, 218, 140, 1)',
      'l(180) 0:rgba(244, 138, 130, 0.2) 1:rgba(244, 138, 130, 1)',
      'l(180) 0:rgba(221, 221, 221, 0.2) 1:rgba(221, 221, 221, 1)',
    ],
  };
  return (
    <div className={`${styles.chartWrapper} ${cls}`}>
      <Bar {...config} />
    </div>
  );
};

export default BarChart;
