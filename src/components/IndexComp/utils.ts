/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-08-24 19:59:45
 * @LastEditTime: 2021-10-30 18:34:00
 * @LastEditors: Please set LastEditors
 */
export const bgColor = [
  {
    begin: '#FFE466',
    end: '#FF9B1E',
  },
  {
    begin: '#FFA178',
    end: '#FF6756',
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
  {
    begin: '#36D1DC',
    end: '#85ABFF',
  },

];
export const topNum = [
  {
    title: '课程总数',
    type: 'kc_count',
  },
  {
    title: '课程班总数',
    type: 'bj_count',
  },
  {
    title: '参与班级数',
    type: 'khfw_count',
  },
  {
    title: '参与教师数',
    type: 'js_count',
  },
  {
    title: '参与学生数',
    type: 'xs_counts',
  },
  {
    title: '合作机构',
    type: 'jg_count',
  },
];
export const centerNum = [
  {
    title: '教师请假',
    type: 'jsqj_count',
    color: '#00E9E4',
    path: '/audit/leaveManagement'
  },
  {
    title: '教师调/代课',
    type: 'jstdk_count',
    color: '#FF5959',
    path: '/audit/substituteCourse'
  },
  {
    title: '教师补签',
    type: 'jsbq_count',
    color: '#FF5959',
    path: '/audit/resignManagement'
  },
  {
    title: '课后服务退订',
    type: 'khfwtd_count',
    color: '#898FD7',
    path: '/orderInquiry/reimbursementClass?index=1'
  },
  {
    title: '课程服务退订',
    type: 'kctd_count',
    color: '#898FD7',
    path: '/orderInquiry/reimbursementClass?index=2'
  },
  {
    title: '增值服务退订',
    type: 'fwtd_count',
    color: '#EED600',
    path: '/orderInquiry/reimbursementClass?index=3'
  },
  {
    title: '课后服务退款',
    type: 'khfwtk_count',
    color: '#FFA238',
    path: '/orderInquiry/refundManagement?index=1'
  },
  {
    title: '课程服务退款',
    type: 'kctk_count',
    color: '#98D32D',
    path: '/orderInquiry/refundManagement?index=2'
  },
  {
    title: '增值服务退款',
    type: 'fwtk_count',
    color: '#FFA238',
    path: '/orderInquiry/refundManagement?index=3'
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
