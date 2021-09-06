/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-08-24 19:59:45
 * @LastEditTime: 2021-09-04 16:02:36
 * @LastEditors: Sissle Lynn
 */
export const bgColor = [
  {
    begin: '#FFA178',
    end: '#FF6756',
  },
  {
    begin: '#36D1DC',
    end: '#85ABFF',
  },
  {
    begin: '#FFE466',
    end: '#FF9B1E',
  },
  {
    begin: '#6FEE7C',
    end: '#4DC6B7',
  },
  {
    begin: '#86A8E7',
    end: '#7F7FD5',
  },
  {
    begin: '#4BF3D5',
    end: '#1CC6C6',
  },
];
export const topNum = [
  {
    title: '本校开课中课程班',
    type: 'xxbjNum'
  },
  {
    title: '机构开课中课程班',
    type: 'jgbjNum',
  },
  {
    title: '引入课程',
    type: 'yrkcNum'
  },
  {
    title: '报名学生',
    type: 'xsNum'
  },
  {
    title: '待处理反馈',
    type: 'fkNum'
  },
  {
    title: '待处理退款信息',
    type: 'amount'
  }
];
export const chartConfig: any = {
  data: [],
  xField: 'type',
  yField: 'number',
  xAxis: {
    label: {
      autoHide: true,
      autoRotate: false
    }
  },
  yAxis: { minInterval: 1 },
  columnStyle: {},
  maxColumnWidth: 30,
  meta: {
    type: { alias: '课程名称' },
    number: { alias: '总数' }
  }
};
