/*
 * @description:
 * @author: lyy
 * @Date: 2021-06-11 14:33:28
 * @LastEditTime: 2021-09-29 21:19:32
 * @LastEditors: zpl
 */
import React from 'react';
import { Pie, measureTextWidth } from '@ant-design/charts';
import styles from '../index.less';

function renderStatistic(containerWidth: number, text: string, style: any) {
  const _measureTextWidth = (0, measureTextWidth)(text, style),
    textWidth = _measureTextWidth.width,
    textHeight = _measureTextWidth.height;
  const R = containerWidth / 2;
  let scale = 1;
  if (containerWidth < textWidth) {
    scale = Math.min(
      Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))),
      1,
    );
  }
  const textStyleStr = 'width:'.concat(`${containerWidth}`, 'px;');
  return '<div style="'
    .concat(textStyleStr, ';font-size:')
    .concat(`${scale}`, 'em;line-height:')
    .concat(scale < 1 ? '1' : 'inherit', ';">')
    .concat(text, '</div>');
}

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
    innerRadius: 0.55,
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
        customHtml: function customHtml(container: any, view: any, datum: any) {
          const _container$getBoundin = container.getBoundingClientRect(),
            width = _container$getBoundin.width,
            height = _container$getBoundin.height;
          const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
          const text = datum ? datum.type : '总计';
          return renderStatistic(d, text, { fontSize: 16 });
        },
      },
      content: {
        offsetY: 4,
        style: { fontSize: '20px' },
        customHtml: function customHtml(container: any, view: any, datum: any, oldData: any) {
          const _container$getBoundin2 = container.getBoundingClientRect(),
            width = _container$getBoundin2.width;
          const text = datum
            ? '\xA5 '.concat(datum.value)
            : '\xA5 '.concat(
                oldData.reduce(function (r: any, d: any) {
                  return r + d.value;
                }, 0),
              );
          return renderStatistic(width, text, { fontSize: 20 });
        },
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
