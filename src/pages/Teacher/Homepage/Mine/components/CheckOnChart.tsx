/*
 * @description:
 * @author: lyy
 * @Date: 2021-06-11 14:33:28
 * @LastEditTime: 2021-09-30 15:57:38
 * @LastEditors: zpl
 */
import React from 'react';
import { Pie } from '@ant-design/charts';
import styles from '../index.less';

type ItemType = {
  label: string;
  type?: string;
  value: number;
  color: string;
};

const CheckOnChart = (props: { data: ItemType[]; title?: string; cls?: string }) => {
  const { data, title, cls } = props;

  const pieConfig = {
    appendPadding: 10,
    height: 150,
    data,
    angleField: 'value',
    colorField: 'type',
    color: data.map((d) => d.color),
    radius: 1,
    innerRadius: 0.65,
    legend: false,
    meta: {
      value: {
        formatter: function formatter(v: string) {
          return ''.concat(v, ' 节');
        },
      },
    },
    label: {
      type: 'inner',
      offset: '-50%',
      style: { textAlign: 'center' },
      autoRotate: false,
      content: '{value}',
    },
    statistic: {
      title: {
        offsetY: -4,
        style: { fontSize: '14px' },
        content: '总课时',
      },
      content: {
        offsetY: 4,
        style: { fontSize: '16px' },
      },
    },
  };
  return (
    <div className={`${styles.chartWrapper} ${cls}`}>
      {title ? <div className="title">{title}</div> : ''}
      {/* <Bar  {...config} /> */}
      <Pie {...pieConfig} />
    </div>
  );
};

export default CheckOnChart;
