
export const customConfig1: Partial<Config> = {
  primaryColor:'rgb(47, 84, 235)',
  edit: true,
  date:{
    cellHeight: '150px',
    showLunar: true,
    showMark: false,
    showEvent: true,
    showSchoolWeek: true,
    displayOtherMonthDate: true,
  },
  header: {
    type: 'month',
    position:'wk-left',
  },
  showEventList: true,
  eventListWidth: '450px',
};

export const customConfig2: Partial<Config> = {
  primaryColor:'#ff9800',
  edit: true,
  date:{
    cellHeight: '150px',
    showMark: false,
    showEvent: true,
    showSchoolWeek: false,
    displayOtherMonthDate: true,
  },
  header: {},
  showEventList: true,
};

export const customConfig3: Partial<Config> = {
  primaryColor:'#4caf50',
  edit: true,
  date:{
    cellHeight: '70px',
    showMark: true,
    showLunar: true,
  },
  header: {
    type: 'date',
    position:'center',
  },
  showEventList: true,
};