import type { Config } from "./data";
import dayjs from 'dayjs';

// 默认配置
export const defaultConfig: Config = {
  currentDate: dayjs().format('YYYY-MM-DD'),
  showType: 'month',
  transitionDuration: 0.3,
  onDateClick: () => { },
  onTouchStart: () => { },
  onTouchMove: () => { },
  onTouchEnd: () => { },
  onToggleShowType: () => { },
  markType: 'dot',
  markDates: [],
  disableWeekView: false,
};
