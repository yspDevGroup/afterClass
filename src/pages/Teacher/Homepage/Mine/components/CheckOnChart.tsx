import React from 'react';
import { Bar } from '@ant-design/charts';
import styles from '../index.less';
import type { Datum } from '@ant-design/charts/es/graphs/types';

type ItemType = {
  label: string;
  type?: string;
  value: number;
  color: string;
};

const CheckOnChart = (props: { data: ItemType[], title?: string, cls?: string }) => {
  const { data, title, cls } = props;
  const config = {
    data,
    // height: 150,
    isGroup: true,
    xField: 'value',
    yField: 'label',
    seriesField: 'color',
    padding: [10, 40, 40],
    maxBarWidth: 18,
    marginRatio: 0.3,
    color: (datum: Datum) => {
      return datum.color;
    },
    legend: false,
    label: {
      show: true,
      position: 'right'
    },
    xAxis: false,
    barStyle: {
      radius: [10, 10, 0, 0],
    }
  };
  return (
    <div className={`${styles.chartWrapper} ${cls}`}>
      {title ? <div className="title">
        {title}
      </div> : ''}
      <Bar  {...config} />
    </div>
  );
};

export default CheckOnChart;