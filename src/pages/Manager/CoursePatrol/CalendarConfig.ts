import { Config } from '@/components/Calendar/data';

export const customConfig: Partial<Config> = {
  className: 'ui-cusCalendar',
  primaryColor: 'rgb(47, 84, 235)',
  edit: true,
  date: {
    cellHeight: '120px',
    showLunar: true,
    showMark: false,
    showEvent: true,
    showSchoolWeek: false,
    displayOtherMonthDate: true,
  },
  header: {
    type: 'month',
    position: 'wk-left',
  },
  showEventList: false,
};
