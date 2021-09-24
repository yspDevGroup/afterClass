// 日历事件参数类型
export type SchoolEvent = {
  id?: string;
  term?: {
    id?: string;
    XN?: string;
    XQ?: string;
    KSRQ?: string;
    JSRQ?: string
  }; // 学期
  title: string;
  eventIndex?: number;// 当月事件顺序
  year?: number;
  month?: number;
  day?: number;
  range: string[]; // 事件时间
  dateItem?: string; // 事件时间转换，无需配置
  editRange?: string[]; // 事件时间转换，无需配置
}
// 日历中日期格式
export type Day = {
  text: number,
  cls: string,
  lunarday?: string;
  events?: SchoolEvent[];
}
// 日历配置参数说明
export type Config = {
  className?: string; // 日历dom自定义类名
  primaryColor?: string; // 日历主色调，控制新增按钮显示色彩
  edit: boolean; // 日历是否可编辑
  date: {
    cellHeight?: string; // 日历格子高度
    showLunar?: boolean; // 是否在格子里显示农历日期
    showMark?: boolean; // 是否在格子里显示事件背景色，与显示事件二选一
    showEvent?: boolean; // 是否在格子里显示事件，与显示背景色二选一
    displayOtherMonthDate?: boolean; // 是否在视图中展示其他月份日期
    showSchoolWeek?: boolean; // 是否显示教学周
  };
  header: {
    type?: 'month' | 'date';
    position?: 'left' | 'center' | 'right' | 'wk-left'; // 头部日期位置，wk-left 专为教学周提供支持
  };
  weekdays: string[]; // 周一到周日的显示格式
  colors: string[]; // 事件显示时的边框或点的颜色
  showEventList?: boolean; // 是否在右侧显示事件列表
  eventListWidth?: string; // 右侧显示事件列表的宽度
  nodataImg?: string; // 右侧显示事件列表的无数据的图片地址
  today: { // 当前日期，默认展示，无需配置
    nowYear: number;
    nowMonth: number;
    nowDay: number;
  };
}
