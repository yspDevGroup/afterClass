/* eslint-disable no-bitwise */
export class LunarHelp {
  lunarInfo: number[];
  nStr1: string[];
  nStr2: string[];
  year: number;
  isLeap: boolean;
  month: number;
  day: number;
  constructor(year: number, month: number, day: number) {
    
    this.lunarInfo = new Array(
      0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
      0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
      0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
      0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
      0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
      0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
      0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
      0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
      0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
      0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
      0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
      0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
      0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
      0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
      0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0)

    this.nStr1 = new Array('日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十');
    this.nStr2 = new Array('初', '十', '廿', '三');

    const date = new Date(year, month - 1, day);

    let i; 
    let leap = 0;
    let temp = 0;// 天数
    const baseDate = new Date(1900, 0, 31);
    let offset = (Date.parse(date.toDateString()) - Date.parse(baseDate.toDateString())) / 86400000;


    // 计算年数
    for (i = 1900; i < 2050 && (offset - this.lYearDays(i)) > 0; i += 1) {
      offset -= this.lYearDays(i)
    }

    this.year = i
    leap = this.leapMonth(i) // 闰哪个月
    this.isLeap = false


    // 计算月数
    for (i = 1; i < 13 && offset > 0; i += 1) {
      // 闰月
      if (leap > 0 && i === (leap + 1) && this.isLeap === false) {
        i -= 1;
        temp = this.leapDays(this.year);
      } else {
        temp = this.monthDays(this.year, i);
      }

      // // 解除闰月
      // if (this.isLeap === true && i === (leap + 1)) this.isLeap = false

      offset -= temp
    }

    // 如果恰好减完了，不是闰月的话月数减1
    if (offset === 0 && leap > 0 && i === leap + 1)
      if (this.isLeap) {
        this.isLeap = false;
      } else {
        this.isLeap = true;
        i -= 1;
      }

    if (offset < 0) {
      offset += temp;
      i -= 1;
    }

    this.month = i
    // 最后剩余的就是日期
    this.day = offset + 1
  }

  // 获取y年的总天数
  lYearDays(year: number) {
    let i; let sum = 0;
    for (i = 0x8000; i > 0x8; i >>= 1)
      sum += (this.lunarInfo[year - 1900] & i) ? 30 : 29
    return (sum + this.leapDays(year)) // 最后在加上可能有的闰年的闰月
  }

  // 获取闰年闰月的天数 闰大月还是小月
  leapDays(year: number) {
    if (this.leapMonth(year))
      return ((this.lunarInfo[year - 1900] & 0x10000) ? 30 : 29)
    return 0;
  }

  // 获取闰年闰哪个月1-12 ,没闰传回 0
  leapMonth(year: number) {
    return (this.lunarInfo[year - 1900] & 0xf)
  }

  // 获取y年m月的总天数 正常月
  monthDays(year: number, month: number) {
    return ((this.lunarInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29)
  }

  // 中文日期
  cDay(d: number) {
    let s;
    switch (Math.floor(d)) {
      case 10:
        s = '初十';
        break;
      case 20:
        s = '二十';
        break;
        break;
      case 30:
        s = '三十';
        break;
        break;
      default:
        s = this.nStr2[Math.floor(d / 10)];
        s += this.nStr1[Math.floor(d % 10)];

    }
    return (s);
  }
  // 中文月份
  cMonth(m: number) {
    let s;

    switch (m) {
      case 1:
        s = '正月';
        break;
      case 2:
        s = '二月';
        break;
      case 3:
        s = '三月';
        break;
      case 4:
        s = '四月';
        break;
      case 5:
        s = '五月';
        break;
      case 6:
        s = '六月';
        break;
      case 7:
        s = '七月';
        break;
      case 8:
        s = '八月';
        break;
      case 9:
        s = '九月';
        break;
      case 10:
        s = '十月';
        break;
      case 11:
        s = '十一月';
        break;
      case 12:
        s = '十二月';
        break;
      default:
        break;
    }
    return (s);
  }

  // 获得阴历日期 字符串
  getLunarDay() {
    return this.cMonth(this.month) + this.cDay(this.day);
  }
  // 获得阴历日期某一天的中文
  getLunarDayName() {

    if (this.day === 1)
      return this.cMonth(this.month);
    return this.cDay(this.day);
  }
  // 获取阴历日期的数字
  getLunarDayNum() {
    return {
      day: this.day,
      month: this.month
    };
  }


}
