import { Config } from "../data";

// 默认配置
export const defaultConfig: Config = {
  primaryColor:'rgb(47, 84, 235)',
  edit: true,
  date:{
    cellHeight: '150px',
    showLunar: true,
    showMark: true,
    showEvent: true,
    showSchoolWeek: true,
    displayOtherMonthDate: true,
  },
  header: {
    type: 'date',
    position:'wk-left',
  },
  weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  colors: [
    '#e54d42',
    '#6739b6',
    '#1cbbb4',
    '#fbbd08',
    '#f37b1d',
    '#e03997',
    '#557571',
    '#28df99',
    '#9c26b0',
    '#09bb07',
    '#0081ff',
  ],
  showEventList: true,
  today: {
    nowYear: 0,
    nowMonth: 0,
    nowDay: 0
  },
};
