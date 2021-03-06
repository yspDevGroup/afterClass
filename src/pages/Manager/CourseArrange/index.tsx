import React, { useEffect, useState } from 'react';
import { Button, Modal, Tabs } from 'antd';
import PageContainer from '@/components/PageContainer';
import { history, useModel } from 'umi';
import CourseScheduling from './CourseScheduling';
import { getQueryObj } from '@/utils/utils';
import moment from 'moment';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getAllXXSJPZ } from '@/services/after-class/xxsjpz';
import AddArranging from './components/AddArranging';
import { getAllFJSJ } from '@/services/after-class/fjsj';
import { getKHBJSJ } from '@/services/after-class/khbjsj';
import { getAllCourses } from '@/services/after-class/khkcsj';
import { getAllXQSJ } from '@/services/after-class/xqsj';
import { LeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
import { initWXAgentConfig, initWXConfig } from '@/utils/wx';
import AddArrangingDS from './components/AddArrangingDS';
import AddArrangingZ from './components/AddArrangingZ';
import ClassScheduling from './ClassScheduling';

const { TabPane } = Tabs;
type selectType = { label: string; value: string };

const Index = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [key, setKey] = useState<string>('1');
  const [keys, setKeys] = useState<string>('one');
  const [recordValue, setRecordValue] = useState<any>({});
  const [state, setState] = useState(true);
  // 课程选择框的数据
  const [kcmcData, setKcmcData] = useState<selectType[] | undefined>([]);
  // 校区
  const [campus, setCampus] = useState<any>([]);
  const [campusId, setCampusId] = useState<string>();
  const [termList, setTermList] = useState<any>();
  const [xXSJPZData, setXXSJPZData] = useState<any>([]);
  // 学年学期Id
  const [curXNXQId, setCurXNXQId] = useState<any>();
  // 排课时段的提示开关
  const [pKiskai, setPKiskai] = useState<boolean>(false);
  // 学年学期时段
  const [TimeData, setTimeData] = useState<any>();
  // 单个班级的开课时段排课限制
  const [RqDisable, setRqDisable] = useState<any>();
  // 学期内的周数
  const [Weeks, setWeeks] = useState<any>([]);
  // 场地名称选择框的数据
  const [cdmcData, setCdmcData] = useState<selectType[] | undefined>([]);
  // 排课须知弹框
  const [VisiblePKXZ, setVisiblePKXZ] = useState(false);
  // 学年学期第一周的开始时间
  const [stateTime, setStateTime] = useState<Date>();

  // ----------------------------计算时间-------------------------------
  const getTime = () => {
    // 获取开始日期所在周一的日期
    const getFirstDay = (date: any) => {
      const day = date.getDay() || 7;
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - day);
    };
    const end = new Date(moment(TimeData?.JSRQ).format('YYYY/MM/DD  23:59:59'));
    setStateTime(getFirstDay(new Date(TimeData?.KSRQ)));
    const times = end.getTime() - getFirstDay(new Date(TimeData?.KSRQ)).getTime();
    // 获取开始时间到结束时间中间有多少个自然周
    const zhoushu = Math.ceil(times / (7 * 24 * 60 * 60 * 1000));
    const arr = new Array();
    let i = 0;
    while (i < zhoushu) {
      arr.push(`第${i + 1}周`);
      // eslint-disable-next-line no-plusplus
      i++;
    }
    setWeeks(arr);
  };

  /**
   * 把接口返回的数据处理成ExcelTable组件所需要的
   * @param data  接口返回的数据
   * @param timeData  课程时间段数据
   * @param bjId 班级id
   * @returns
   */
  const startWeek = Number(moment(TimeData?.KSRQ).format('E'));
  const endWeek = Number(moment(TimeData?.JSRQ).format('E'));
  const processingData = (data: any, timeData: any, bjId: string | undefined = undefined) => {
    const week = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const newWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const tableData: any[] = [];
    const sameClassData: any[] = [];
    if (!timeData.length) {
      setPKiskai(true);
    } else {
      Weeks.forEach((item: any, index: number) => {
        timeData.forEach((timeItem: any, timeKey: number) => {
          const table = {
            room: {
              cla: item,
              keys: index,
              teacher: '',
              jsId: '',
              FJLXId: '', // 场地类型ID
              rowspan: timeKey === 0 ? timeData?.length : 0,
              SD: `${moment(stateTime)
                .add(index * 7, 'days')
                .format('MM.DD')}-${moment(stateTime)
                .add(6 + index * 7, 'days')
                .format('MM.DD')} `,
            },
            course: {
              cla: timeItem?.TITLE,
              teacher: `${timeItem?.KSSJ?.slice(0, 5)} — ${timeItem?.JSSJ?.slice(0, 5)}`,
              hjId: timeItem?.id,
            },
          };
          if (data?.length) {
            data.forEach((KHItem: any) => {
              if (KHItem?.PKBZ === item) {
                if (KHItem?.XXSJPZId === timeItem?.id) {
                  const currentTeacher = KHItem?.KHBJSJ?.KHBJJs?.find(
                    (items: any) => items?.JSLX === '主教师',
                  );
                  table[week[KHItem?.WEEKDAY]] = {
                    weekId: KHItem?.id, // 周
                    cla: KHItem?.KHBJSJ?.BJMC, // 班级名称
                    teacher: currentTeacher?.JZGJBSJ?.XM, // 主教师
                    teacherWechatId: currentTeacher?.JZGJBSJ?.WechatUserId, // 主教师微信用户ID
                    bjId: KHItem?.KHBJSJ?.id, // 班级ID
                    kcId: KHItem?.KHBJSJ?.KHKCSJ?.id, // 课程ID
                    njId: KHItem?.KHBJSJ?.KHKCSJ?.NJSJs?.[0]?.id, // 年级ID
                    bjzt: KHItem?.KHBJSJ?.BJZT, // 班级状态
                    xqId: KHItem?.KHBJSJ?.XQSJ?.id, // 校区ID
                    color: KHItem?.KHBJSJ?.KHKCSJ?.KBYS || 'rgba(62, 136, 248, 1)',
                    dis: bjId !== KHItem?.KHBJSJ?.id,
                    fjmc: KHItem?.FJSJ?.FJMC || KHItem?.FJSJ?.label,
                    jcmc: KHItem?.XXSJPZ?.TITLE,
                  };
                  if (bjId === KHItem?.KHBJSJ?.id) {
                    sameClassData.push({
                      WEEKDAY: KHItem?.WEEKDAY, // 周
                      XXSJPZId: KHItem?.XXSJPZId, // 时间ID
                      KHBJSJId: KHItem?.KHBJSJ?.id, // 班级ID
                      FJSJId: item.id, // 教室ID
                      XNXQId: KHItem?.XNXQId, // 学年学期ID
                    });
                  }
                }
              }
            });
          }
          if (RqDisable) {
            // 超出该班级上课开始时段
            if (RqDisable[2] < 7 && index === RqDisable[0] - 1) {
              const num = RqDisable[2] - 1;
              newWeek.slice(0, num).forEach((items: any) => {
                table[items] = {
                  weekId: '', // 周
                  cla: '无法排课', // 班级名称
                  teacher: '', // 主教师
                  teacherWechatId: '', // 主教师微信用户ID
                  teacherID: '', // 主教师ID
                  bjId: '', // 班级ID
                  kcId: '', // 课程ID
                  njId: '', // 年级ID
                  bjzt: '', // 班级状态
                  xqId: '', // 校区ID
                  color: '',
                  dis: true,
                  fjmc: '无法排课',
                  jcmc: '超出当前学年学期',
                };
              });
            }
            if (index < RqDisable[0] - 1) {
              newWeek.forEach((items: any) => {
                table[items] = {
                  weekId: '', // 周
                  cla: '无法排课', // 班级名称
                  teacher: '', // 主教师
                  teacherWechatId: '', // 主教师微信用户ID
                  teacherID: '', // 主教师ID
                  bjId: '', // 班级ID
                  kcId: '', // 课程ID
                  njId: '', // 年级ID
                  bjzt: '', // 班级状态
                  xqId: '', // 校区ID
                  color: '',
                  dis: true,
                  fjmc: '无法排课',
                  jcmc: '超出当前学年学期',
                };
              });
            }
            // 超出该班级上课结束时段
            if (RqDisable[3] < 7 && index === RqDisable[1] - 1) {
              const num = 7 - RqDisable[3];
              newWeek.slice(-num).forEach((items: any) => {
                table[items] = {
                  weekId: '', // 周
                  cla: '无法排课', // 班级名称
                  teacher: '', // 主教师
                  teacherWechatId: '', // 主教师微信用户ID
                  teacherID: '', // 主教师ID
                  bjId: '', // 班级ID
                  kcId: '', // 课程ID
                  njId: '', // 年级ID
                  bjzt: '', // 班级状态
                  xqId: '', // 校区ID
                  color: '',
                  dis: true,
                  fjmc: '无法排课',
                  jcmc: '超出当前学年学期',
                };
              });
            }
            if (RqDisable[1] < Weeks?.length && index > RqDisable[1] - 1) {
              newWeek.forEach((items: any) => {
                table[items] = {
                  weekId: '', // 周
                  cla: '无法排课', // 班级名称
                  teacher: '', // 主教师
                  teacherWechatId: '', // 主教师微信用户ID
                  teacherID: '', // 主教师ID
                  bjId: '', // 班级ID
                  kcId: '', // 课程ID
                  njId: '', // 年级ID
                  bjzt: '', // 班级状态
                  xqId: '', // 校区ID
                  color: '',
                  dis: true,
                  fjmc: '无法排课',
                  jcmc: '超出当前学年学期',
                };
              });
            }
          }
          if (endWeek < 7 && index === Weeks?.length - 1) {
            const num = 7 - endWeek;
            newWeek.slice(-num).forEach((items: any) => {
              table[items] = {
                weekId: '', // 周
                cla: '无法排课', // 班级名称
                teacher: '', // 主教师
                teacherWechatId: '', // 主教师微信用户ID
                teacherID: '', // 主教师ID
                bjId: '', // 班级ID
                kcId: '', // 课程ID
                njId: '', // 年级ID
                bjzt: '', // 班级状态
                xqId: '', // 校区ID
                color: '',
                dis: true,
                fjmc: '无法排课',
                jcmc: '超出当前学年学期',
              };
            });
          }
          if (index === 0) {
            const num = startWeek - 1;
            newWeek.slice(0, num).forEach((items: any) => {
              table[items] = {
                weekId: '', // 周
                cla: '无法排课', // 班级名称
                teacher: '', // 主教师
                teacherWechatId: '', // 主教师微信用户ID
                teacherID: '', // 主教师ID
                bjId: '', // 班级ID
                kcId: '', // 课程ID
                njId: '', // 年级ID
                bjzt: '', // 班级状态
                xqId: '', // 校区ID
                color: '',
                dis: true,
                fjmc: '',
                jcmc: '',
              };
            });
          }
          tableData.push(table);
        });
      });
    }
    return tableData;
  };

  const processingDatas = (
    data: any,
    timeData: any,
    week: any,
    bjId: string | undefined = undefined,
  ) => {
    const tableData: any[] = [];
    const sameClassData: any[] = [];
    let Weekss: any = [];
    let weekIndex: number;

    if (week && week !== undefined) {
      Weekss = week;
      weekIndex = Weeks.indexOf(week[0]);
    } else {
      Weekss = Weeks;
    }
    if (!timeData.length) {
      setPKiskai(true);
    } else {
      Weekss.forEach((item: any, index: number) => {
        timeData.forEach((timeItem: any, timeKey: number) => {
          const table = {
            room: {
              cla: item,
              keys: index,
              teacher: '',
              jsId: '',
              FJLXId: '', // 场地类型ID
              rowspan: timeKey === 0 ? timeData?.length : 0,
              SD: `${moment(stateTime)
                .add((weekIndex || index) * 7, 'days')
                .format('MM.DD')}-${moment(stateTime)
                .add(6 + (weekIndex || index) * 7, 'days')
                .format('MM.DD')} `,
            },
            course: {
              cla: timeItem?.TITLE,
              teacher: `${timeItem?.KSSJ?.slice(0, 5)} — ${timeItem?.JSSJ?.slice(0, 5)}`,
              hjId: timeItem?.id,
            },
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [],
          };
          if (data?.length) {
            data.forEach((KHItem: any) => {
              if (KHItem?.PKBZ === item) {
                if (KHItem?.XXSJPZId === timeItem?.id) {
                  const currentTeacher = KHItem?.KHBJSJ?.KHBJJs?.find(
                    (items: any) => items?.JSLX === '主教师',
                  );
                  const newObj: any = {
                    weekId: KHItem?.id, // 周
                    cla: KHItem?.KHBJSJ?.BJMC, // 班级名称
                    teacher: currentTeacher?.JZGJBSJ?.XM, // 主教师
                    teacherWechatId: currentTeacher?.JZGJBSJ?.WechatUserId, // 主教师微信用户ID
                    teacherID: currentTeacher?.JZGJBSJId, // 主教师ID
                    bjId: KHItem?.KHBJSJ?.id, // 班级ID
                    kcId: KHItem?.KHBJSJ?.KHKCSJ?.id, // 课程ID
                    njId: KHItem?.KHBJSJ?.KHKCSJ?.NJSJs?.[0]?.id, // 年级ID
                    bjzt: KHItem?.KHBJSJ?.BJZT, // 班级状态
                    xqId: KHItem?.KHBJSJ?.XQSJ?.id, // 校区ID
                    color: KHItem?.KHBJSJ?.KHKCSJ?.KBYS || 'rgba(62, 136, 248, 1)',
                    dis: bjId !== KHItem?.KHBJSJ?.id,
                    fjmc: KHItem?.FJSJ?.FJMC || KHItem?.FJSJ?.label,
                    jcmc: KHItem?.XXSJPZ?.TITLE,
                    XNXQId: KHItem?.XNXQId,
                  };
                  if (KHItem?.WEEKDAY === '1') {
                    table?.monday.push(newObj);
                  } else if (KHItem?.WEEKDAY === '2') {
                    table?.tuesday.push(newObj);
                  } else if (KHItem?.WEEKDAY === '3') {
                    table?.wednesday.push(newObj);
                  } else if (KHItem?.WEEKDAY === '4') {
                    table?.thursday.push(newObj);
                  } else if (KHItem?.WEEKDAY === '5') {
                    table?.friday.push(newObj);
                  } else if (KHItem?.WEEKDAY === '6') {
                    table?.saturday.push(newObj);
                  } else if (KHItem?.WEEKDAY === '0') {
                    table?.sunday.push(newObj);
                  }

                  if (
                    bjId === KHItem?.KHBJSJ?.id
                    // (!BJID && recordValue?.BJId === KHItem?.KHBJSJ?.id) ||
                    // (BJID && BJID === KHItem?.KHBJSJ?.id)
                  ) {
                    sameClassData.push({
                      WEEKDAY: KHItem?.WEEKDAY, // 周
                      XXSJPZId: KHItem?.XXSJPZId, // 时间ID
                      KHBJSJId: KHItem?.KHBJSJ?.id, // 班级ID
                      FJSJId: item.id, // 教室ID
                      XNXQId: KHItem?.XNXQId, // 学年学期ID
                    });
                  }
                }
              }
            });
          }

          tableData.push(table);
        });
      });
    }
    return tableData;
  };
  const processingDataDS = (data: any, timeData: any, bjId: string | undefined = undefined) => {
    const NewArr = ['单周', '双周'];
    const tableData: any[] = [];
    const sameClassData: any[] = [];
    if (!timeData.length) {
      setPKiskai(true);
    } else {
      NewArr.forEach((item: any, index: number) => {
        timeData.forEach((timeItem: any, timeKey: number) => {
          const table: any = {
            room: {
              cla: item,
              keys: index,
              teacher: '',
              jsId: '',
              FJLXId: '', // 场地类型ID
              rowspan: timeKey === 0 ? timeData?.length : 0,
            },
            course: {
              cla: timeItem?.TITLE,
              teacher: `${timeItem?.KSSJ?.slice(0, 5)} — ${timeItem?.JSSJ?.slice(0, 5)}`,
              hjId: timeItem?.id,
            },
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [],
          };
          if (data?.length) {
            data.forEach((KHItem: any) => {
              const weekNum = KHItem?.PKBZ.replace(/[^\d]/g, ' ');
              if (item === '双周' && weekNum % 2 === 0) {
                if (KHItem?.XXSJPZId === timeItem?.id) {
                  const currentTeacher = KHItem?.KHBJSJ?.KHBJJs?.find(
                    (items: any) => items?.JSLX === '主教师',
                  );
                  const newObj: any = {
                    weekId: KHItem?.id, // 周
                    cla: KHItem?.KHBJSJ?.BJMC, // 班级名称
                    teacher: currentTeacher?.JZGJBSJ?.XM, // 主教师
                    teacherWechatId: currentTeacher?.JZGJBSJ?.WechatUserId, // 主教师微信用户ID
                    teacherID: currentTeacher?.JZGJBSJId, // 主教师ID
                    bjId: KHItem?.KHBJSJ?.id, // 班级ID
                    kcId: KHItem?.KHBJSJ?.KHKCSJ?.id, // 课程ID
                    njId: KHItem?.KHBJSJ?.KHKCSJ?.NJSJs?.[0]?.id, // 年级ID
                    bjzt: KHItem?.KHBJSJ?.BJZT, // 班级状态
                    xqId: KHItem?.KHBJSJ?.XQSJ?.id, // 校区ID
                    color: KHItem?.KHBJSJ?.KHKCSJ?.KBYS || 'rgba(62, 136, 248, 1)',
                    dis: bjId !== KHItem?.KHBJSJ?.id,
                    fjmc: KHItem?.FJSJ?.FJMC || KHItem?.FJSJ?.label,
                    jcmc: KHItem?.XXSJPZ?.TITLE,
                    XNXQId: KHItem?.XNXQId,
                    PKBZ: KHItem?.PKBZ,
                    RQ: KHItem?.RQ,
                  };
                  if (KHItem?.WEEKDAY === '1') {
                    table?.monday.push(newObj);
                  } else if (KHItem?.WEEKDAY === '2') {
                    table?.tuesday.push(newObj);
                  } else if (KHItem?.WEEKDAY === '3') {
                    table?.wednesday.push(newObj);
                  } else if (KHItem?.WEEKDAY === '4') {
                    table?.thursday.push(newObj);
                  } else if (KHItem?.WEEKDAY === '5') {
                    table?.friday.push(newObj);
                  } else if (KHItem?.WEEKDAY === '6') {
                    table?.saturday.push(newObj);
                  } else if (KHItem?.WEEKDAY === '0') {
                    table?.sunday.push(newObj);
                  }

                  if (
                    bjId === KHItem?.KHBJSJ?.id
                    // (!BJID && recordValue?.BJId === KHItem?.KHBJSJ?.id) ||
                    // (BJID && BJID === KHItem?.KHBJSJ?.id)
                  ) {
                    sameClassData.push({
                      WEEKDAY: KHItem?.WEEKDAY, // 周
                      XXSJPZId: KHItem?.XXSJPZId, // 时间ID
                      KHBJSJId: KHItem?.KHBJSJ?.id, // 班级ID
                      FJSJId: item.id, // 教室ID
                      XNXQId: KHItem?.XNXQId, // 学年学期ID
                    });
                  }
                }
              } else if (item === '单周' && weekNum % 2 !== 0) {
                if (KHItem?.XXSJPZId === timeItem?.id) {
                  const currentTeacher = KHItem?.KHBJSJ?.KHBJJs?.find(
                    (items: any) => items?.JSLX === '主教师',
                  );
                  const newObj: any = {
                    weekId: KHItem?.id, // 周
                    cla: KHItem?.KHBJSJ?.BJMC, // 班级名称
                    teacher: currentTeacher?.JZGJBSJ?.XM, // 主教师
                    teacherWechatId: currentTeacher?.JZGJBSJ?.WechatUserId, // 主教师微信用户ID
                    teacherID: currentTeacher?.JZGJBSJId, // 主教师ID
                    bjId: KHItem?.KHBJSJ?.id, // 班级ID
                    kcId: KHItem?.KHBJSJ?.KHKCSJ?.id, // 课程ID
                    njId: KHItem?.KHBJSJ?.KHKCSJ?.NJSJs?.[0]?.id, // 年级ID
                    bjzt: KHItem?.KHBJSJ?.BJZT, // 班级状态
                    xqId: KHItem?.KHBJSJ?.XQSJ?.id, // 校区ID
                    color: KHItem?.KHBJSJ?.KHKCSJ?.KBYS || 'rgba(62, 136, 248, 1)',
                    dis: bjId !== KHItem?.KHBJSJ?.id,
                    fjmc: KHItem?.FJSJ?.FJMC || KHItem?.FJSJ?.label,
                    jcmc: KHItem?.XXSJPZ?.TITLE,
                    XNXQId: KHItem?.XNXQId,
                    PKBZ: KHItem?.PKBZ,
                    RQ: KHItem?.RQ,
                  };
                  if (KHItem?.WEEKDAY === '1') {
                    table?.monday.push(newObj);
                  } else if (KHItem?.WEEKDAY === '2') {
                    table?.tuesday.push(newObj);
                  } else if (KHItem?.WEEKDAY === '3') {
                    table?.wednesday.push(newObj);
                  } else if (KHItem?.WEEKDAY === '4') {
                    table?.thursday.push(newObj);
                  } else if (KHItem?.WEEKDAY === '5') {
                    table?.friday.push(newObj);
                  } else if (KHItem?.WEEKDAY === '6') {
                    table?.saturday.push(newObj);
                  } else if (KHItem?.WEEKDAY === '0') {
                    table?.sunday.push(newObj);
                  }

                  if (
                    bjId === KHItem?.KHBJSJ?.id
                    // (!BJID && recordValue?.BJId === KHItem?.KHBJSJ?.id) ||
                    // (BJID && BJID === KHItem?.KHBJSJ?.id)
                  ) {
                    sameClassData.push({
                      WEEKDAY: KHItem?.WEEKDAY, // 周
                      XXSJPZId: KHItem?.XXSJPZId, // 时间ID
                      KHBJSJId: KHItem?.KHBJSJ?.id, // 班级ID
                      FJSJId: item.id, // 教室ID
                      XNXQId: KHItem?.XNXQId, // 学年学期ID
                    });
                  }
                }
              }
            });
          }

          tableData.push(table);
        });
      });
    }
    return tableData;
  };
  const processingDataZ = (data: any, timeData: any, bjId: string | undefined = undefined) => {
    const NewArr = ['每周'];
    const tableData: any[] = [];
    const sameClassData: any[] = [];
    if (!timeData.length) {
      setPKiskai(true);
    } else {
      NewArr.forEach((item: any, index: number) => {
        timeData.forEach((timeItem: any, timeKey: number) => {
          const table: any = {
            room: {
              cla: item,
              keys: index,
              teacher: '',
              jsId: '',
              FJLXId: '', // 场地类型ID
              rowspan: timeKey === 0 ? timeData?.length : 0,
            },
            course: {
              cla: timeItem?.TITLE,
              teacher: `${timeItem?.KSSJ?.slice(0, 5)} — ${timeItem?.JSSJ?.slice(0, 5)}`,
              hjId: timeItem?.id,
            },
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [],
          };
          if (data?.length) {
            data.forEach((KHItem: any) => {
              if (KHItem?.XXSJPZId === timeItem?.id) {
                const currentTeacher = KHItem?.KHBJSJ?.KHBJJs?.find(
                  (items: any) => items?.JSLX === '主教师',
                );
                const newObj: any = {
                  weekId: KHItem?.id, // 周
                  cla: KHItem?.KHBJSJ?.BJMC, // 班级名称
                  teacher: currentTeacher?.JZGJBSJ?.XM, // 主教师
                  teacherWechatId: currentTeacher?.JZGJBSJ?.WechatUserId, // 主教师微信用户ID
                  teacherID: currentTeacher?.JZGJBSJId, // 主教师ID
                  bjId: KHItem?.KHBJSJ?.id, // 班级ID
                  kcId: KHItem?.KHBJSJ?.KHKCSJ?.id, // 课程ID
                  njId: KHItem?.KHBJSJ?.KHKCSJ?.NJSJs?.[0]?.id, // 年级ID
                  bjzt: KHItem?.KHBJSJ?.BJZT, // 班级状态
                  xqId: KHItem?.KHBJSJ?.XQSJ?.id, // 校区ID
                  color: KHItem?.KHBJSJ?.KHKCSJ?.KBYS || 'rgba(62, 136, 248, 1)',
                  dis: bjId !== KHItem?.KHBJSJ?.id,
                  fjmc: KHItem?.FJSJ?.FJMC || KHItem?.FJSJ?.label,
                  jcmc: KHItem?.XXSJPZ?.TITLE,
                  XNXQId: KHItem?.XNXQId,
                  PKBZ: KHItem?.PKBZ,
                  RQ: KHItem?.RQ,
                };
                if (KHItem?.WEEKDAY === '1') {
                  table?.monday.push(newObj);
                } else if (KHItem?.WEEKDAY === '2') {
                  table?.tuesday.push(newObj);
                } else if (KHItem?.WEEKDAY === '3') {
                  table?.wednesday.push(newObj);
                } else if (KHItem?.WEEKDAY === '4') {
                  table?.thursday.push(newObj);
                } else if (KHItem?.WEEKDAY === '5') {
                  table?.friday.push(newObj);
                } else if (KHItem?.WEEKDAY === '6') {
                  table?.saturday.push(newObj);
                } else if (KHItem?.WEEKDAY === '0') {
                  table?.sunday.push(newObj);
                }

                if (
                  bjId === KHItem?.KHBJSJ?.id
                  // (!BJID && recordValue?.BJId === KHItem?.KHBJSJ?.id) ||
                  // (BJID && BJID === KHItem?.KHBJSJ?.id)
                ) {
                  sameClassData.push({
                    WEEKDAY: KHItem?.WEEKDAY, // 周
                    XXSJPZId: KHItem?.XXSJPZId, // 时间ID
                    KHBJSJId: KHItem?.KHBJSJ?.id, // 班级ID
                    FJSJId: item.id, // 教室ID
                    XNXQId: KHItem?.XNXQId, // 学年学期ID
                  });
                }
              }
            });
          }
          tableData.push(table);
        });
      });
    }
    return tableData;
  };

  // 获取系统时间配置信息
  const getSysTime = async () => {
    // 查询所有课程的时间段
    const resultTime = await getAllXXSJPZ({
      XNXQId: curXNXQId,
      XXJBSJId: currentUser?.xxId,
      type: ['0'],
    });
    if (resultTime.status === 'ok') {
      const timeSlot = resultTime.data;
      if (timeSlot?.length) {
        setXXSJPZData(timeSlot);
      } else {
        setPKiskai(true);
      }
    }
  };

  // 选择校区后选择学年学期
  const getXNXQData = async () => {
    const xnxq = getQueryObj().xnxqid;
    const res = await queryXNXQList(currentUser?.xxId);
    const newData = res.xnxqList;
    const curTerm = res.current;
    if (newData?.length) {
      if (curTerm) {
        if (xnxq === null) {
          setCurXNXQId(curTerm.id);
        } else {
          setCurXNXQId(xnxq);
        }
        setTimeData(curTerm);
        setTermList(newData);
      }
    }
  };

  // 获取校区信息 默认选择第一个校区
  const getCampus = async () => {
    // 获取年级信息
    const XQ: { label: any; value: any }[] = [];
    // 获取校区数据
    const resXQ: any = await getAllXQSJ({ XXJBSJId: currentUser?.xxId });
    if (resXQ.status === 'ok') {
      resXQ.data?.forEach((item: any) => {
        XQ.push({
          label: item.XQMC,
          value: item.id,
        });
      });
      if (resXQ.data?.length) {
        const { XQSJ } = getQueryObj();
        if (XQSJ !== null) {
          setCampusId(XQSJ);
        } else {
          // 设置默认选择第一个校区
          let id = XQ?.find((item: any) => item.label === '本校')?.value;
          if (!id) {
            id = XQ[0].value;
          }
          setCampusId(id);
        }
      }
      setCampus(XQ);
    }
  };

  const getCDData = async () => {
    const fjList = await getAllFJSJ({
      page: 1,
      pageSize: 0,
      name: '',
      XXJBSJId: currentUser?.xxId,
      xqId: campusId,
    });
    if (fjList.status === 'ok') {
      if (fjList.data?.rows && fjList.data?.rows?.length > 0) {
        const data: any = [].map.call(fjList.data.rows, (item: any) => {
          return { label: item.FJMC, value: item.id };
        });
        setCdmcData(data);
      }
    }
  };

  // 获取课程信息
  const getKCData = async () => {
    const khkcResl = await getAllCourses({
      // 学校Id
      XXJBSJId: currentUser?.xxId,
      // 学年学期Id
      XNXQId: curXNXQId,
      /** 页数 */
      page: 0,
      /** 每页记录数 */
      pageSize: 0,
    });
    if (khkcResl.status === 'ok') {
      const KCMC = khkcResl.data.rows?.map((item: any) => ({
        label: item.KCMC,
        value: item.id,
      }));
      setKcmcData(KCMC);
    }
  };

  // 返回上一页
  const onReset = () => {
    const bjID = getQueryObj().courseId;
    if (bjID) {
      history.go(-1);
      setState(true);
    } else {
      setState(true);
    }
  };

  const showDrawer = () => {
    // 打开编辑页面
    setState(false);
    // 将选中的单元格数据清空 以免新增时数据又回显
    setRecordValue({ XQ: campusId });
  };

  /**
   * 获取Excel表格中数据的方法
   * @param value 在type="edit" 的时候使用；选中将要排课的班级的数据
   * @param record 获取点击某个单元格的所有数据
   */
  const onExcelTableClick = (value: any, record: any) => {
    setRecordValue({ ...record, XQ: campusId });
  };

  useEffect(() => {
    (async () => {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        await initWXConfig(['checkJsApi']);
      }
      await initWXAgentConfig(['checkJsApi']);
    })();
    const queryObj = getQueryObj();
    const bjId = queryObj.courseId;
    const XQSJId = queryObj.XQSJ;
    const XNXQId = queryObj.xnxqid;
    if (bjId !== null) {
      setCurXNXQId(XNXQId);
      (async () => {
        const njInfo = await getKHBJSJ({ id: bjId! });
        if (njInfo.status === 'ok') {
          setRecordValue({
            BJId: njInfo.data.id,
            NJ: njInfo.data.KHKCSJ.NJSJs[0].id,
            KC: njInfo.data.KHKCSJId,
            KCMC: njInfo.data.KHKCSJ.KCMC,
            XQ: XQSJId,
          });
          setState(false);
        }
      })();
    }
  }, []);

  useEffect(() => {
    const bjId = getQueryObj().courseId;
    if (bjId !== null) {
      setState(false);
      setKey('2');
    }
  }, []);
  // 获取学年学期信息 默认选择第一个学年
  useEffect(() => {
    if (campusId) {
      getXNXQData();
    }
  }, [campusId]);

  useEffect(() => {
    getTime();
  }, [TimeData]);

  // 初始化请求请求校区
  useEffect(() => {
    getCampus();
  }, []);

  // 根据学年学期ID 获取学年课程名称数据，和班级名称数据， 获取当前学校学年的学期的场地排课情况
  useEffect(() => {
    const bjId = getQueryObj().courseId;
    if (curXNXQId && campusId) {
      // 获取系统时间配置信息
      getSysTime();
      if (bjId === null) {
        // 课程名称数据
        // getBjData();
        // 课程班数据
        getKCData();
      }
      // 场地数据
      getCDData();
      getTime();
    }
  }, [curXNXQId, campusId]);

  return (
    <div className={styles.CourseArrange}>
      <PageContainer>
        {state ? (
          <Tabs
            activeKey={key}
            onChange={(value: any) => {
              setKey(value);
            }}
          >
            {
              <TabPane tab="行政班课表" key="1">
                {key === '1' && (
                  <CourseScheduling
                    type="行政班课表"
                    kcmcData={kcmcData}
                    processingDatas={processingDatas}
                    campus={campus}
                    setCampus={setCampus}
                    campusId={campusId}
                    curXNXQId={curXNXQId}
                    setCurXNXQId={setCurXNXQId}
                    xXSJPZData={xXSJPZData}
                    setXXSJPZData={setXXSJPZData}
                    currentUser={currentUser}
                    termList={termList}
                    setCampusId={setCampusId}
                    showDrawer={showDrawer}
                    onExcelTableClick={onExcelTableClick}
                    pKiskai={pKiskai}
                    setPKiskai={setPKiskai}
                    Weeks={Weeks}
                  />
                )}
              </TabPane>
            }
            <TabPane tab="课程班课表" key="2">
              {key === '2' && (
                <CourseScheduling
                  type="课程班课表"
                  kcmcData={kcmcData}
                  processingDatas={processingDatas}
                  campus={campus}
                  setCampus={setCampus}
                  campusId={campusId}
                  curXNXQId={curXNXQId}
                  setCurXNXQId={setCurXNXQId}
                  xXSJPZData={xXSJPZData}
                  setXXSJPZData={setXXSJPZData}
                  currentUser={currentUser}
                  termList={termList}
                  setCampusId={setCampusId}
                  showDrawer={showDrawer}
                  onExcelTableClick={onExcelTableClick}
                  pKiskai={pKiskai}
                  setPKiskai={setPKiskai}
                  Weeks={Weeks}
                />
              )}
            </TabPane>
            <TabPane tab="场地课表" key="3">
              {key === '3' && (
                <ClassScheduling
                  type="场地课表"
                  processingDatas={processingDatas}
                  campus={campus}
                  setCampus={setCampus}
                  campusId={campusId}
                  curXNXQId={curXNXQId}
                  setCurXNXQId={setCurXNXQId}
                  xXSJPZData={xXSJPZData}
                  setXXSJPZData={setXXSJPZData}
                  currentUser={currentUser}
                  termList={termList}
                  setCampusId={setCampusId}
                  showDrawer={showDrawer}
                  onExcelTableClick={onExcelTableClick}
                  pKiskai={pKiskai}
                  setPKiskai={setPKiskai}
                  Weeks={Weeks}
                />
              )}
            </TabPane>
            <TabPane tab="教师课表" key="4">
              {key === '4' && (
                <ClassScheduling
                  type="教师课表"
                  processingDatas={processingDatas}
                  campus={campus}
                  setCampus={setCampus}
                  campusId={campusId}
                  curXNXQId={curXNXQId}
                  setCurXNXQId={setCurXNXQId}
                  xXSJPZData={xXSJPZData}
                  setXXSJPZData={setXXSJPZData}
                  currentUser={currentUser}
                  termList={termList}
                  setCampusId={setCampusId}
                  showDrawer={showDrawer}
                  onExcelTableClick={onExcelTableClick}
                  pKiskai={pKiskai}
                  setPKiskai={setPKiskai}
                  Weeks={Weeks}
                />
              )}
            </TabPane>
          </Tabs>
        ) : (
          <>
            <>
              <div className={styles.goBack}>
                <Button
                  type="primary"
                  onClick={onReset}
                  style={{
                    marginRight: '24px',
                  }}
                >
                  <LeftOutlined />
                  返回上一页
                </Button>
                {`${recordValue && recordValue.BJId ? '编辑排课' : '新增排课'}`}
                <a
                  className={styles.xuzhi}
                  onClick={() => {
                    setVisiblePKXZ(true);
                  }}
                >
                  <QuestionCircleOutlined /> 排课须知
                </a>
              </div>
            </>

            <Tabs
              activeKey={keys}
              onChange={(value: any) => {
                setKeys(value);
              }}
              className={styles.tabs}
            >
              <TabPane tab="按周" key="one">
                {keys === 'one' && (
                  <AddArrangingZ
                    campus={campus}
                    campusId={campusId}
                    curXNXQId={curXNXQId}
                    xXSJPZData={xXSJPZData}
                    cdmcData={cdmcData}
                    processingData={processingDataZ}
                    formValues={recordValue}
                    kcmcData={kcmcData}
                    currentUser={currentUser}
                    TimeData={TimeData}
                    setRqDisable={setRqDisable}
                    Weeks={Weeks}
                  />
                )}
              </TabPane>
              <TabPane tab="单双周" key="two">
                {keys === 'two' && (
                  <AddArrangingDS
                    campus={campus}
                    campusId={campusId}
                    curXNXQId={curXNXQId}
                    xXSJPZData={xXSJPZData}
                    cdmcData={cdmcData}
                    processingData={processingDataDS}
                    formValues={recordValue}
                    kcmcData={kcmcData}
                    currentUser={currentUser}
                    TimeData={TimeData}
                    setRqDisable={setRqDisable}
                    Weeks={Weeks}
                  />
                )}
              </TabPane>
              <TabPane tab="按天" key="three">
                {keys === 'three' && (
                  <AddArranging
                    campus={campus}
                    campusId={campusId}
                    curXNXQId={curXNXQId}
                    xXSJPZData={xXSJPZData}
                    cdmcData={cdmcData}
                    processingData={processingData}
                    formValues={recordValue}
                    kcmcData={kcmcData}
                    currentUser={currentUser}
                    TimeData={TimeData}
                    setRqDisable={setRqDisable}
                  />
                )}
              </TabPane>
            </Tabs>
          </>
        )}

        <Modal
          visible={VisiblePKXZ}
          title="排课须知"
          onOk={() => {
            setVisiblePKXZ(true);
          }}
          onCancel={() => {
            setVisiblePKXZ(false);
          }}
          footer={null}
          className={styles.PKXZ}
        >
          <p className={styles.titles}>
            <div /> <span>排课规则</span>{' '}
          </p>
          <p>1. 排课支持两种模式：第一种，循环排课，即“按周”、“单双周”排课；第二种，“按天”排课。</p>
          <p>
            2.
            循环排课时必须先清除其他类型下的排课信息，且“按周”排课与“单双周”排课不可同时使用，即选择“按周”进行排课时，如果该班级存在的“单双周”排课信息，则需先清除已有排课信息后方可操作，反之亦然。
          </p>
          <p>3. 当循环排课模式无法满足排课需求时，可使用“按天”排课模式。</p>
          <p>
            4.
            “按天”排课也可作为循环排课的补充，可以先进行循环排课，然后使用“按天”排课进行细节调整。
          </p>
          <p className={styles.titles} style={{ marginTop: 15 }}>
            <div /> <span>操作建议</span>{' '}
          </p>
          <p>
            建议您先依据学校课表安排，选择一种适合的循环排课方式，在“按周”或“单双周”页签下完成排课后，可在“按天”排课中进行细节调整。
          </p>
          <p>例如：</p>
          <p>1. 每周循环上课，选择“按周”进行排课，随后在“按天”排课中进行调整；</p>
          <p>2. 单双周循环上课，选择“单双周”进行排课，随后在“按天”排课中进行调整；</p>
          <p>3. 无循环规律，选择“按天”排课，完成本学期排课安排。</p>
        </Modal>
      </PageContainer>
    </div>
  );
};

export default Index;
