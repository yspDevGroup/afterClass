/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-08-24 19:59:45
 * @LastEditTime: 2021-10-30 10:54:09
 * @LastEditors: Please set LastEditors
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
    title: '本校课程班',
    type: 'bj_count',
  },
  {
    title: '合作机构数',
    type: 'jg_count',
  },
  {
    title: '课程总数',
    type: 'kc_count',
  },
  {
    title: '引入课程',
    type: 'jgkc_count',
  },
  {
    title: '学校教师',
    type: 'js_count',
  },
  {
    title: '报名学生',
    type: 'xs_count',
  },
];
export const chartConfig: any = {
  data: [],
  xField: 'type',
  yField: 'number',
  xAxis: {
    label: {
      autoHide: true,
      autoRotate: false,
    },
  },
  yAxis: { minInterval: 1 },
  columnStyle: {},
  maxColumnWidth: 30,
  meta: {
    type: { alias: '课程名称' },
    number: { alias: '总数' },
  },
};
