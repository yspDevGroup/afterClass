import React from 'react';
import { Bar } from '@ant-design/charts';
import styles from '../index.less';

const CheckOnChart: React.FC = () => {
  const data = [
    {
      label: 'A班',
      type: '正常',
      value: 12,
      color: 'red',
    },
    {
      label: 'A班',
      type: '异常',
      value: 1,
    },
    {
      label: 'A班',
      type: '待上',
      value: 4,
    },
    {
      label: 'B班',
      type: '正常',
      value: 12,
    },
    {
      label: 'B班',
      type: '异常',
      value: 1,
    },
    {
      label: 'B班',
      type: '待上',
      value: 4,
    },
  ];
  const config = {
    data,
    height: 150,
    isGroup: true,
    xField: 'value',
    yField: 'label',
    seriesField: 'type',
    padding: [0,40],
    maxBarWidth: 18,
    marginRatio: 0.3,
    color: (_ref: { type: any; }) => {
      const { type } = _ref;
      switch (type) {
        case '待上':
          return 'l(180) 0:rgba(221, 221, 221, 1) 1:rgba(221, 221, 221, 0.04)';
          break;
        case '异常':
          return 'l(180) 0:rgba(255, 113, 113, 1) 1:rgba(255, 113, 113, 0.04)';
          break;
        default:
          return 'l(180) 0:rgba(49, 217, 159, 1) 1:rgba(49, 217, 159, 0.04)';
          break;
      }
    },
    legend: false,
    label: {
      show: true,
      position: 'right'
    },
    xAxis: false,
    theme:'#EEEEEE',
    barStyle: {
      radius: [10, 10, 0, 0],
    }
  };
  return (
    <div className={styles.chartWrapper}>
      <Bar  {...config} />
    </div>
  );
};

export default CheckOnChart;