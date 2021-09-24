/* eslint-disable max-params */
import React, { useEffect, useMemo, useState } from 'react';
import { defaultConfig } from './util/DefaultSetting';
import { addData, getNearbyMonth, splitDate } from './util/CalendarUtil';
import styles from './index.less';
import EventList from './components/EventList';
import { DatePicker } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import moment from 'moment';
import DateEvent from './components/DateEvent';
import { Config, Day, SchoolEvent } from './data';

let inter: NodeJS.Timeout;

// 传参说明
type CalendarProps = {
  chosenDay: string;
  terms: API.XNXQ[] | null;
  config?: Partial<Config>;
  events?: SchoolEvent[];
  handleEvents?: (type: string, date: string, value?: any) => void;
  handleOver?: (date: string) => Promise<boolean>;
}
const updateVal = (type: 'month' | 'date' | undefined, year: number, month: number, day?: number) => {
  let val: moment.Moment | undefined;
  if (type === 'month') {
    val = moment(`${year}-${month}`, 'YYYY-MM');
  } else {
    val = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD');
  }
  return val;
}
const findWrapper: (dom: any) => any = (dom: any) => {
  if (dom.tagName === 'DIV' && dom.className.indexOf('dayItem') > -1) {
    return dom;
  }
  return findWrapper(dom.parentElement);
};
const Calendar = ({ chosenDay, terms, config, events, handleEvents, handleOver }: CalendarProps) => {
  // 获取日历配置信息；
  const configs: Config = Object.assign(defaultConfig, config);
  const { type, position, } = configs.header;
  const { cellHeight, showMark, showEvent, showSchoolWeek, displayOtherMonthDate } = configs.date;
  // 获取当前日期，年，月，日
  const date = new Date(chosenDay);
  const [nowYear, nowMonth, nowDay] = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  // 配置Y年份，M月，D日期，W周，事件，
  const [thisYear, setThisYear] = useState<number>(nowYear);
  const [thisMonth, setThisMonth] = useState<number>(nowMonth);
  const [curWeek, setCurweek] = useState<string>();
  const [days, setDays] = useState<Day[]>();
  const [weeklys, setWeeklys] = useState<[]>([]);
  const [thisEvents, setThisEvents] = useState<[]>([]);
  const [curValue, setCurValue] = useState<moment.Moment | undefined>(updateVal(type, nowYear, nowMonth, nowDay));
  const [classInfoShow, setClassInfoShow] = useState<boolean>(false);
  const showClassInfo = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, date: string) => {
    if (inter) {
      clearInterval(inter)
    }
    inter = setInterval(async () => {
      if (!classInfoShow) {
        setClassInfoShow(true);
        const result = await handleOver?.(date);
        if (!result) {
          const dom = findWrapper(e.target);
          dom.id = 'yspNoArrange';
        }

        clearInterval(inter);
      }
    }, 500);
  };
  const hideClassInfo = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (inter) {
      clearInterval(inter)
    }
    const dom = findWrapper(e.target);
    dom.id = '';
    setClassInfoShow(false);
  };
  const updateData = (curData: any) => {
    if (curData.days) {
      setDays(curData.days);
    }
    if (curData.weeklys) {
      setWeeklys(curData.weeklys);
    }
    if (curData.thisEvents) {
      setThisEvents(curData.thisEvents);
    }
  };
  useEffect(() => {
    defaultConfig.today = {
      nowYear,
      nowMonth,
      nowDay
    };
    addData(nowYear, nowMonth, terms, events || [], configs, updateData);
  }, [configs, terms, events, nowDay, nowMonth, nowYear]);
  useEffect(() => {
    days?.forEach((item, index) => {
      if (item.cls === 'yspToday') {
        const nowWk = weeklys.filter((it) => it !== undefined);
        const wk: string = nowWk[Math.floor(index / 7)];
        if (wk?.match(/[0-9]+/g)) {
          setCurweek(wk.match(/[0-9]+/g)![0]);
        } else {
          setCurweek('假期');
        };
        return index;
      }
      return '';
    });
  }, [days, weeklys]);
  const changeDatas = (values: moment.Moment) => {
    const [termYear, termMonth, termDay] = splitDate(values);
    setThisYear(termYear);
    setThisMonth(termMonth);
    addData(termYear, termMonth, terms, events || [], configs, updateData);
    const val = updateVal(type, termYear, termMonth, termDay);
    setCurValue(val);
  };
  // 根据传递参数，切换上下或返回当前月份
  const changeMonth = (param: string) => {
    let val;
    if (param === 'now') {
      const today = new Date();
      const [toYear, toMonth, toDay] = [today.getFullYear(), today.getMonth() + 1, today.getDate()];
      addData(toYear, toMonth, terms, events || [], configs, updateData);
      setThisYear(toYear);
      setThisMonth(toMonth);
      val = updateVal(type, toYear, toMonth, toDay);
    } else {
      const [year, month] = getNearbyMonth(thisYear, thisMonth, param);
      setThisYear(year);
      setThisMonth(month);
      addData(year, month, terms, events || [], configs, updateData);
      val = updateVal(type, year, month, nowDay);
    }
    setCurValue(val);
  };

  return (
    <div className={`${styles.calendarContainer} ${configs.className}`}>
      {configs?.header.type ? <div className={styles.calendarHeader}>
        <div className={styles.termInfo} v-align={position}>
          <div className={`${styles.optionItem}`}>
            <LeftOutlined onClick={() => changeMonth('pre')} />
          </div>
          <DatePicker
            value={curValue}
            format={type === 'month' ? 'YYYY-MM' : 'YYYY-MM-DD'}
            picker={type}
            allowClear={false}
            onPanelChange={(values) => changeDatas(values)}
          />
          <div className={`${styles.optionItem}`} >
            <RightOutlined onClick={() => changeMonth('next')} />
          </div>
        </div>
        {/* {showSchoolWeek ? <div className={styles.weekInfo} style={{ right: configs.showEventList ? '380px' : '0px' }}>
          {curWeek === '假期' ? (
            <span>{curWeek}</span>
          ) : (
            <div>
              当前第<span onClick={() => changeMonth('now')}>{curWeek}</span>周
            </div>
          )}
        </div> :} */}
        <div className={styles.today} onClick={() => changeMonth('now')}>
          <span>
            <LeftOutlined />返回今天
          </span>
        </div>
      </div> : ''}
      <div className={styles.calendarBody}>
        <div className={styles.dateWrapper} v-align={position} style={{ paddingRight: configs.showEventList ? '16px' : 0 }}>
          <div className={styles.dateHeader}>
            {showSchoolWeek ? <div className={`${styles.weekly} ${styles.weekItem}`} >
              周次
            </div> : ''}
            <div className={styles.yspWeek}>
              {configs.weekdays.map((item: string) => (
                <div className={styles.weekItem} key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.dateData}>
            {showSchoolWeek ? <div className={styles.weekly}>
              {weeklys.map((item, index) => (
                <div className={`${styles.weeklyItem} ${styles.item}`} key={`${item}${index + 1}`} style={{ height: cellHeight, lineHeight: cellHeight }}>
                  {item}
                </div>
              ))}
            </div> : ''}
            <div className={styles.yspDays}>
              {days?.length && days.map((item: Day) => {
                let divCls = `${styles.dayItem} ${item.cls}`;
                let style: Record<string, string> = {};
                if (showEvent) {
                  divCls += ` ${styles.eventItem}`;
                } else if (showMark && item.events && item.events.length > 0) {
                  divCls += ` ${styles.mark}`
                  style = {
                    background: configs.colors[item.events[0].eventIndex! % configs.colors.length]
                  };
                }
                const showOther = item.cls === 'yspOthermonth' && !displayOtherMonthDate ? `${styles.noShow}` : '';
                return (
                  <div
                    className={`${divCls} ${showOther}`} key={`${item.cls}${item.text}`}
                    style={{ height: cellHeight }}
                    onClick={(e) => {
                      if (item.cls !== 'yspOthermonth') {
                        e.stopPropagation();
                        if (handleEvents) {
                          const type = item?.events?.length ? 'check' : 'new';
                          handleEvents(type, `${moment(curValue).format('YYYY-MM')}-${item.text}`,item?.events);
                        }
                      }
                    }}
                    onMouseOver={(e) => {
                      e.stopPropagation();
                      showClassInfo(e, `${moment(curValue).format('YYYY-MM')}-${item.text}`);
                    }}
                    onMouseLeave={(e) => {
                      hideClassInfo(e);
                    }}
                  >
                    <div className={styles.day} style={style}>{item.text}</div>
                    <div className={styles.lunarDay}>{item.lunarday}</div>
                    <div className={styles.noText}>今日无课<br />无需值班</div>
                    {showEvent && item?.events?.length? <DateEvent
                      events={item.events}
                      colors={configs.colors}
                    /> : ''}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        {configs.showEventList ? <EventList
          config={configs}
          events={thisEvents}
          handleEvents={handleEvents}
        /> : ''}
      </div>

    </div>
  );
};

export default Calendar;
