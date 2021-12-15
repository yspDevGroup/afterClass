// 日历配置参数说明
export type Config = {
  className?: string; // 日历dom自定义类名
  primaryColor?: string; // 日历主色调，控制新增按钮显示色彩
  currentDate: string;
  showType: 'week' | 'month';
  transitionDuration: number;
  onDateClick: PropTypes.func;
  onTouchStart: PropTypes.func;
  onTouchMove: PropTypes.func;
  onTouchEnd: PropTypes.func;
  onToggleShowType: PropTypes.func;
  markType: 'dot' | 'circle';
  markDates: PropTypes.array;
  disableWeekView: PropTypes.bool;
};
