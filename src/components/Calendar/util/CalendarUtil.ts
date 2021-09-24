/* eslint-disable max-params */
import moment from 'moment';
import { LunarHelp } from './LunarHelper';
import { defaultConfig } from './DefaultSetting';
import { Config, Day, SchoolEvent } from '../data';
// 将日期格式规范化，默认格式为YYYY-MM-DD
const formatDate = (date: string | moment.Moment, format?: string) => {
  const curDate = moment(date).format(format || 'YYYY-MM-DD');
  return curDate;
}
// 遍历日期的方法
export const DateRange = (startDate: string, endDate: string) => {
  // 存放groupDate;
  const groupDate: any[] = [];
  // 截取的开始时间
  const startTime = new Date(startDate);
  // 截取的结束时间
  const endTime = new Date(endDate);
  // 利用setTime获取两个日期之间差值,差值毫秒换算成天1000*60*60*24
  const distanceDayLength = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24);

  for (let i = 0; i <= distanceDayLength; i += 1) {
    const curDate = startTime.getTime() + (1000 * 60 * 60 * 24) * i;
    groupDate.push(moment(curDate).format("yyyy-MM-DD"));
  }
  return groupDate;
}
// 将日期年月日单独拆离方便使用
export const splitDate = (date: string | moment.Moment) => {
  const termYear = Number(formatDate(date, 'YYYY'));
  const termMonth = Number(formatDate(date, 'MM'));
  const termDay = Number(formatDate(date, 'DD'));
  return [
    termYear,
    termMonth,
    termDay
  ];
}
// 获取上下个月
export const getNearbyMonth = (year: number, month: number, type: string) => {
  let cYear = year;
  let cMonth = month;
  if (type === 'pre') {
    if (cMonth === 1) {
      cYear -= 1;
      cMonth = 12;
    } else {
      cMonth -= 1;
    }
  } else if (type === 'next') {
    if (month === 12) {
      cYear += 1;
      cMonth = 1;
    } else {
      cMonth += 1;
    }
  }
  return [cYear, cMonth];
};
// 计算每个月的第一天是星期几
const calcMonthFirstDay = (year: number, month: number) => {
  return new Date(year, month - 1, 1).getDay();
};
// 获取对应的学期和开学日期
const getTerm = (year: number, month: number, terms: any[]) => {
  const date = parseInt(`${year}${month}`, 10);
  for (let i = terms?.length - 1; i >= 0; i -= 1) {
    const [termYear, termMonth] = splitDate(terms[i].KSRQ);
    const termDate = parseInt(`${termYear}${termMonth}`, 10);
    if (date >= termDate) {
      return terms[i];
    }
  }
  return null;
};
// 获取M月份的周数列表
const getWeekly = (
  year: number,
  month: number,
  rowCount: number,
  terms: any,
  callBack: (curData: any) => void,
) => {
  let result: string[] = [];
  const thisTerm = getTerm(year, month, terms);
  if (!thisTerm) {
    result = new Array(rowCount);
    callBack({ weeklys: result.fill('假期') });
    return;
  }

  // 当月的第一天是星期几
  let firstDay = calcMonthFirstDay(year, month);
  if (firstDay === 0) {
    firstDay = 7;
  }
  // 当月第一个星期五的日期
  const SatDay = 6 - firstDay;
  // 当月天数
  const dayCount = new Date(year, month, 0).getDate();

  const termDate: any = new Date(formatDate(thisTerm.KSRQ, 'YYYY/MM/DD'));
  const termEndDate: any = new Date(formatDate(thisTerm.JSRQ, 'YYYY/MM/DD'));


  for (let i = 0; i < rowCount; i += 1) {
    let day = SatDay + i * 7;
    let cyear = year;
    let cmonth = month;
    if (day > dayCount) {
      cmonth += 1;
      day -= dayCount;
      if (cmonth > 12) {
        cyear += 1;
        cmonth = 1;
      }
    }
    if (day <= 0) {
      // 获取上个月
      const [preYear, preMonth] = getNearbyMonth(year, month, 'pre');
      const preMonthDayCount: number = new Date(preYear, preMonth, 0).getDate();
      day = preMonthDayCount - Math.abs(day);
      cyear = preYear;
      cmonth = preMonth;
    }

    const satDay: any = new Date(`${cyear}/${cmonth}/${day}`);
    if (satDay < termDate) {
      result.push('假期');
    } else {
      const weekly = Math.ceil((satDay - termDate) / 1000 / 60 / 60 / 24 / 7);
      if (satDay <= termEndDate) {
        result.push(`第${weekly}周`);
      } else {
        result.push('假期');
      }
    }
  }

  callBack({ weeklys: result });
};
// 选择M月事件，并调整事件字段
const exchangeEvents = (
  year: number,
  month: number,
  events: SchoolEvent[],
  callback: (curData: any) => void,
) => {
  const eventArr: SchoolEvent[] = [];
  const thisEvents: any[] = [];
  events.forEach((item, index) => {
    const { range } = item;
    const [startYear, startMonth] = splitDate(range[0]);
    const [endYear, endMonth] = splitDate(range[range.length - 1]);
    if (startYear === year && startMonth === month || endYear === year && endMonth === month) {
      const days = DateRange(range[0], range[range.length - 1]);
      for (let cur of days) {
        const [termYear, termMonth, termDay] = splitDate(cur);
        if (termYear === year && termMonth === month) {
          eventArr.push({
            id: item.id,
            term: item.term,
            title: item.title,
            eventIndex: index,
            range: item.range,
            year,
            month,
            day: termDay,
          });
        }
      }
    }
    if (year === startYear && month === startMonth) {
      const newItem = { ...item };
      const startDate = formatDate(range[0], 'YYYY年MM月DD日');
      const endDate = formatDate(range[range.length - 1], 'YYYY年MM月DD日');
      const startRange = formatDate(range[0], 'YYYY-MM-DD');
      const endRange = formatDate(range[range.length - 1], 'YYYY-MM-DD');
      newItem.dateItem = `${startDate} — ${endDate}`;
      newItem.editRange = [startRange, endRange];
      thisEvents.push(newItem);
    }
  });
  callback({
    thisEvents,
  });
  return eventArr;
};

// 获取校历事件
const getEvents = (
  year: number,
  month: number,
  days: Day[],
  events: SchoolEvent[],
  callback: (curData: any) => void,
) => {
  const nowEvents = exchangeEvents(year, month, events, callback);
  const newDays = days.map((day) => {
    const cDay = { ...day };
    if (cDay.cls.indexOf('yspNormal') > -1) {
      cDay.events = [];
      nowEvents.map((item) => {
        if (cDay.text === item.day) {
          cDay.events?.push(item);
        }
        return item;
      });
    };
    return cDay;
  })
  callback({ days: newDays });
};
// 获取M月份阳历阴历数据
export const addData = (year: number, month: number, terms: API.XNXQ[] | null, events: SchoolEvent[], config: Config, callBack: (curData: any) => void) => {
  const { nowYear, nowMonth, nowDay } = defaultConfig.today;
  const today = new Date();
  const [toYear, toMonth, toDay] = [today.getFullYear(), today.getMonth() + 1, today.getDate()];
  const day = new Date(year, month - 1, 1);
  const days = [];
  let week = day.getDay();
  let rowCount = 5;
  let lastCount = 0;
  const dayCount = new Date(year, month, 0).getDate();

  if (week === 0) week = 7;
  if (week === 7 || week > 5 && dayCount === 31) {
    rowCount = 6
  }
  lastCount = rowCount * 7 - dayCount - week;

  // 计算得到月视图下第一个格子的日期
  const thispageStart = new Date(Date.parse(day.toDateString()) - (week - 1) * 24 * 3600 * 1000).getDate();
  // 获取上个月
  const [preYear, preMonth] = getNearbyMonth(year, month, 'pre');
  const preMonthDayCount: number = new Date(preYear, preMonth, 0).getDate();
  // 获取下个月
  const [nextYear, nextMonth] = getNearbyMonth(year, month, 'next');
  // 对月视图下计算before,now,after M的长度，遍历获取数值
  if (thispageStart !== 1) {
    for (let i = thispageStart; i <= preMonthDayCount; i += 1) {
      const item: Day = {
        text: i,
        cls: 'yspOthermonth'
      };
      if (config.date.showLunar) {
        const writelunarday = new LunarHelp(preYear, preMonth, i).getLunarDayName();
        item.lunarday = writelunarday;
      }
      days.push(item)
    }
  }

  for (let i = 1; i <= dayCount; i += 1) {
    const item: Day = {
      text: i,
      cls: 'yspNormal',
    }
    if (config.date.showLunar) {
      const writelunarday = new LunarHelp(year, month, i).getLunarDayName();
      item.lunarday = writelunarday;
    }

    // 添加today样式 toYear, toMonth, toDay
    if (toYear === year && toMonth === month && toDay === i) {
      item.cls += ' yspToday';
    }
    // 添加chosenday样式
    if (nowYear === year && nowMonth === month && nowDay === i) {
      item.cls += ' yspChosenDay';
    }
    days.push(item);
  };

  for (let i = 1; i <= lastCount + 1; i += 1) {
    const item: Day = {
      text: i,
      cls: 'yspOthermonth'
    };
    if (config.date.showLunar) {
      const writelunarday = new LunarHelp(nextYear, nextMonth, i).getLunarDayName();
      item.lunarday = writelunarday;
    }
    days.push(item)
  }
  callBack({ days });
  getWeekly(year, month, rowCount, terms, callBack);

  if (events?.length) {
    getEvents(year, month, days, events, callBack)
  }
}

const getMonthData = (type: 'start' | 'middle' | 'end', year: number, month: number, day?: number) => {
  const days = [];
  let date;
  if (type === 'middle') {
    date = new Date(year, month - 1, 1);
  } else {
    date = new Date(year, month - 1, day);
  }
  let dayCount;
  if (type === 'end') {
    dayCount = date.getDate();
  } else {
    dayCount = new Date(year, month, 0).getDate();
  }

  let start = 1;
  if (type === 'start' && day) {
    start = day;
  }
  for (let i = start; i <= dayCount; i += 1) {
    const item = {
      text: i,
      cls: 'yspNormal',
      week: new Date(year, month - 1, i).getDay()
    };
    days.push(item);
  };
  return days;
};
const findAllData = (type: 'start' | 'middle' | 'end', data: any[], finishYear: number, finishMonth: number, finishDay: number, year: number, month: number, day?: number) => {
  const [nextYear, nextMonth] = getNearbyMonth(year, month, 'next');
  if (nextYear === finishYear && nextMonth === finishMonth) {
    const curDates = getMonthData('end', year, month, finishDay);
    data.push({
      month: month,
      date: curDates
    });
  } else {
    const curDates = getMonthData(type, year, month, day);
    data.push({
      month: month,
      date: curDates
    });
    findAllData('middle',data, finishYear, finishMonth, finishDay, nextYear, nextMonth);
  }
};
// 获取学期数据
export const getTermData = (term: API.XNXQ) => {
  const { KSRQ, JSRQ } = term;
  const startDay = new Date(KSRQ);
  const endDay = new Date(JSRQ);
  const [beginYear, beginMonth, beginDay] = [startDay.getFullYear(), startDay.getMonth() + 1, startDay.getDate()];
  const [finishYear, finishMonth, finishDay] = [endDay.getFullYear(), endDay.getMonth() + 1, endDay.getDate()];
  let data: any[] = [];
  findAllData('start', data, finishYear, finishMonth, finishDay, beginYear, beginMonth, beginDay);
  return data;
}
