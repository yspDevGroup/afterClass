/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-const */
import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import { Button, Modal, Tooltip } from 'antd';
import EllipsisHint from '../EllipsisHint';

import styles from './index.less';

type KBItemProps = {
  mode: 'see' | 'edit';
  data: any;
  disabled: boolean;
  onClick?: () => void;
  Weeks: any;
  chosenData: {
    cla: string;
    teacher: string;
    teacherWechatId?: string | undefined;
    KHBJSJId?: string | undefined;
    XNXQId?: string | undefined;
    color: string;
    teacherID: string;
  } | undefined
};

type WeenType = {
  /** 班级名称 */
  cla: string;
  /** 主教师 */
  teacher: string;
  key: string;
  /** 是否禁用 */
  dis: boolean;
  /** 班级ID */
  bjId: string;
  color: string;
  /** 校区 */
  XQ: string;
  /** 年级 */
  NJS: string;
  /** 课程 */
  KCId: string;
};

export type DataSourceType = {
  key: string;
  /** 场地 */
  room: {
    /** 场地名称 */
    cla: string;
    teacher: string;
    teacherWechatId?: string;
    keys?: number;
    rowspan?: number;
    // 场地ID
    jsId: string;
    /** 场地类型ID */
    FJLXId: string;
  };
  /** 课次 */
  course: {
    /** 课次名称 */
    cla: string;
    /** 时间 */
    teacher: string;
    teacherWechatId?: string;
    /** 时间ID */
    hjId: string;
  };
  monday: WeenType | '';
  tuesday: WeenType | '';
  wednesday: WeenType | '';
  thursday: WeenType | '';
  friday: WeenType | '';
  saturday: WeenType | '';
  sunday: WeenType | '';
}[];

const KBItem: FC<KBItemProps> = ({ mode, data, disabled, onClick, chosenData, Weeks }) => {
  let arr2;
  let BJMC;
  let BJId;

  if (data?.length) {
    arr2 = data?.filter((item: any, index: number) => {
      let temArr: any[] = []
      data?.forEach((item2: { bjId: string; }) => temArr.push(item2.bjId))
      return temArr.indexOf(item.bjId) === index
    })
    BJMC = arr2.map((value: any, index: number) => {
      if (index < 5) {
        return `${value?.cla}  `
      }
      return ''
    })
    BJId = data?.find((items: any) => items?.bjId === chosenData?.KHBJSJId);
  }
  if ((mode === 'edit' && disabled && data?.length && BJId === undefined)) {
    return (
      <Tooltip title={
        arr2?.length > 5 ? `${BJMC}...` : BJMC
      }>
        <Button
          type="text"
          disabled={disabled}
          style={{
            height: 48,
            padding: 0,
            border: 0,
            background: 'transparent',
            width: '100%',
            lineHeight: '48px',
          }}
        >
          <div className={styles.disImage}>
            已占用
            <EllipsisHint text={data?.cla} width={'100%'} />
          </div>
        </Button>
      </Tooltip>
    );
  }
  if (mode === 'edit' && disabled && data?.length && BJId) {
    return (
      <Button
        type="text"
        disabled={false}
        onClick={() => {
          if (typeof onClick === 'function') {
            onClick();
          }
        }}
        style={{
          height: 48,
          padding: 2,
          border: 0,
          background: 'transparent',
          width: '100%',
        }}
      >
        <div className="classCard">
          <div
            className={`cardTop`}
            style={{
              background: data?.[0]?.color,
            }}
          />
          <div
            className={`cardcontent`}
            style={{
              color: data?.[0]?.color,
              background: data?.[0]?.color?.replace('1)', '0.1)'),
              position: 'relative',
            }}
          >
            <div className="cla">
              <EllipsisHint text={data?.[0]?.cla} width='100%' />
            </div>
          </div>
        </div>
      </Button>
    );
  }


  return (
    <Button
      type="text"
      disabled={false}
      onClick={() => {
        if (typeof onClick === 'function') {
          onClick();
        }
      }}
      style={{
        height: 48,
        padding: 2,
        border: 0,
        background: 'transparent',
        width: '100%',
      }}
    >
      <div className="classCard">
        <div
          className={`cardTop`}
          style={{
            background: data?.[0]?.color,
          }}
        />
        <div
          className={`cardcontent`}
          style={{
            color: data?.[0]?.color,
            background: data?.[0]?.color?.replace('1)', '0.1)'),
            position: 'relative',
          }}
        >
          <div className="cla">
            <EllipsisHint text={data?.[0]?.cla} width='100%' />
          </div>
        </div>
      </div>
    </Button>
  );
};

type IndexPropsType = {
  /** 表格列 */
  columns: {
    title: string;
    dataIndex: string;
    key: string;
    align: 'center' | 'left' | 'right';
    width: number;
  }[];
  /** 表格的数据 */
  dataSource: DataSourceType;
  /** 选中的值  在type='edit'时必传  KHBJSJId: 班级ID，XNXQId： 学年学期ID  */
  chosenData?: {
    cla: string;
    teacher: string;
    teacherWechatId?: string;
    KHBJSJId?: string;
    XNXQId?: string;
    color: string;
    teacherID: string;
    KKRQ: string;
    JKRQ: string;
  };
  /** 选中项发生变化时的回调 value: type='edit'时的数据； record：type='see'时的数据； bjId： 班级ID */
  onExcelTableClick?: (value: any, record: any, pkData: any) => Promise<void>
  /** see: 单元格中不存在disable属性，edit： 单元格中存在disable属性  */
  type?: 'see' | 'edit';
  /** 切换页面  仅在type='see'起作用 */
  switchPages?: () => void;
  className: '' | undefined;
  getSelectdata?: (value: any) => void;
  radioValue?: boolean;
  tearchId?: string;
  TimeData?: any;
  /** 表格接口没有处理的数据 */
  basicData?: any[];
  style: any;
  xXSJPZData: any;
  Weeks: any;
};

const Index: FC<IndexPropsType> = ({
  className,
  columns,
  dataSource,
  chosenData,
  onExcelTableClick,
  type = 'see',
  switchPages,
  getSelectdata,
  style,
  TimeData,
  xXSJPZData,
  Weeks,
  // radioValue,
  // basicData,
  // tearchId,
}) => {
  let [stateTableData, setStateTableData] = useState<DataSourceType>();

  const weekDay = {
    monday: '1',
    tuesday: '2',
    wednesday: '3',
    thursday: '4',
    friday: '5',
    saturday: '6',
    sunday: '0',
  };

  // 获取到最新的表格数据 以便渲染
  useEffect(() => {
    setStateTableData(dataSource);
  }, [dataSource]);


  const onTdClick = (rowKey: number, colKey: number,) => {
    //  不能直接操作表格的数据
    // 需要复制一份数据出来进行修改  不然在操作表格时容易触发state 导致重新渲染
    const newData = stateTableData ? [...stateTableData] : [...dataSource];

    // 表头数据： 根据在表格上点击获取到的key值来获取此单元格的表头数据
    const colItem = columns[colKey] || {};

    // 一行的数据：根据在表格上点击获取到的key值来获取此单元格的行数据
    const rowData = newData[rowKey] || {};

    // 区分编辑还是新增
    const types = rowData[colItem.dataIndex]?.length === 0 ? '新增' : '编辑';
    // type === 'see'时 获取到点击单元格的数据

    let seeChosenItem = null;
    if (type === 'see' && !chosenData) {
      if (rowData[colItem.dataIndex]?.bjzt === '已开班') {
        Modal.warning({
          title: '此课程班已开班，不能再进行排课操作',
        });
      } else if (rowData[colItem.dataIndex]?.bjzt === '已结课') {
        Modal.warning({
          title: '此课程班已结课，不能再进行排课操作',
        });
      } else if (
        rowData[colItem.dataIndex]?.isXZB &&
        rowData[colItem.dataIndex]?.bjzt === '未开班'
      ) {
        Modal.warning({
          title: '行政班排课不可编辑课程班课表，如有需要请在课程班排课中操作。',
        });
      } else {
        seeChosenItem = {
          XQ: rowData[colItem.dataIndex]?.xqId, // 校区ID
          NJ: rowData[colItem.dataIndex]?.njId, // 年级ID
          KC: rowData[colItem.dataIndex]?.kcId, // 课程ID
          XZBId: rowData[colItem.dataIndex]?.XZBId, // 行政班ID
          isXZB: rowData[colItem.dataIndex]?.isXZB, // 行政班ID
          BJId: rowData[colItem.dataIndex]?.bjId, //  课程班ID
          CDLX: rowData.room?.FJLXId, // 场地类型ID
          CDMC: rowData.room?.jsId, // 场地名称
          weekId: rowData[colItem.dataIndex]?.weekId, // 排课ID
          jsId: rowData.room?.jsId, // 教室ID
          hjId: rowData.course?.hjId, // 时间ID,
        };
        if (typeof switchPages === 'function') {
          switchPages();
        }
      }
    } else if (type === 'edit') {
      if (chosenData && !rowData[colItem.dataIndex]) {
        rowData[colItem.dataIndex] = {
          cla: chosenData?.cla,
          teacher: chosenData?.teacher,
          teacherID: chosenData?.teacherID,
          dis: false,
          color: chosenData.color,
        };
      }
      setStateTableData(newData);
    }
    console.log(chosenData,'chosenData')

    console.log(TimeData,'TimeData')

    /* 获取时间段内属于星期一(*)的日期们
     * begin: 开始时间
     * end：结束时间
     * weekNum：星期几 {number}
     */
    function getWeek(begin: any, end: any, weekNum: any) {
      let dateArr = new Array();
      let stimeArr = begin.split("-");//= >["2018", "01", "01"]
      let etimeArr = end.split("-");//= >["2018", "01", "30"]
      let stoday = new Date();
      stoday.setUTCFullYear(stimeArr[0], stimeArr[1] - 1, stimeArr[2]);
      let etoday = new Date();
      etoday.setUTCFullYear(etimeArr[0], etimeArr[1] - 1, etimeArr[2]);

      let unixDb = stoday.getTime();// 开始时间的毫秒数
      let unixDe = etoday.getTime();// 结束时间的毫秒数

      for (let k = unixDb; k <= unixDe;) {
        let needJudgeDate = msToDate(parseInt(k, 10)).withoutTime;

        // 不加这个if判断直接push的话就是已知时间段内的所有日期
        if (new Date(needJudgeDate).getDay() === Number(weekNum)) {
          dateArr.push(needJudgeDate);
        }
        k += 24 * 60 * 60 * 1000;
      }
      return dateArr;
    }

    // 根据毫秒数获取日期
    function msToDate(msec: string | number | Date) {
      let datetime = new Date(msec);
      let year = datetime.getFullYear();
      let month = datetime.getMonth();
      let date = datetime.getDate();
      let hour = datetime.getHours();
      let minute = datetime.getMinutes();
      let second = datetime.getSeconds();

      let result1 = `${year
        }-${(month + 1) >= 10 ? (month + 1) : `0${month + 1}`
        }-${(date + 1) < 10 ? `0${date}` : date
        } ${(hour + 1) < 10 ? `0${hour}` : hour
        }:${(minute + 1) < 10 ? `0${minute}` : minute
        }:${(second + 1) < 10 ? `0${second}` : second}`;

      let result2 = `${year
        }-${(month + 1) >= 10 ? (month + 1) : `0${month + 1}`
        }-${(date + 1) < 11 ? `0${date}` : date}`;

      let result = {
        hasTime: result1,
        withoutTime: result2
      };

      return result;
    }
    // 时段内所有周几的日期
    const AllRQ = getWeek(chosenData?.KKRQ, chosenData?.JKRQ, weekDay[colItem.dataIndex]);

    // 获取学期开始时间所在周一的日期
    const getFirstDay = (date: any) => {
      const day = date.getDay() || 7;
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - day);
    };
    console.log(new Date(TimeData?.KSRQ),'new Date(TimeData?.KSRQ)')
    // getFirstDay(new Date(TimeData?.KSRQ)).getTime()
    console.log(getFirstDay(new Date(TimeData?.KSRQ)).getTime(),'-----------------')
    console.log(new Date(AllRQ[0]).getTime(),'new Date(AllRQ[0]).getTime()')
    const times = new Date(AllRQ[0]).getTime() - getFirstDay(new Date(TimeData?.KSRQ)).getTime();
    console.log(times,'times-------')
    // 获取生成日期的第一个是时段内的第几周，由此判断单双周
    const zhoushu = Math.ceil(times / (7 * 24 * 60 * 60 * 1000));
    const singleArr: any[] = []; // 单周
    const doubleArr: any[] = []; // 双周
    console.log(zhoushu,'zhoushu-----')
    AllRQ.forEach((items: any, index: number) => {
      if (zhoushu === 1) {
        console.log('0000')
        if (index % 2 === 0) {
          console.log(1111)
          singleArr.push(items)
        } else {
          console.log(2222)
          doubleArr.push(items)
        }
      } else if (zhoushu === 2) {
        console.log(33333)
        if (index % 2 === 0) {
          doubleArr.push(items)
          console.log(44444)
        } else {
          console.log(5555)
          singleArr.push(items)
        }
      }

    })
    console.log(AllRQ,'AllRQ------')

    const pkDatas: any = [];
    if (rowData.room?.cla === '单周') {
      singleArr?.forEach((value: any, index: number) => {
        pkDatas.push({
          WEEKDAY: weekDay[colItem.dataIndex], // 周
          XXSJPZId: rowData.course?.hjId, // 时间ID
          KHBJSJId: chosenData?.KHBJSJId, // 班级ID
          PKBZ: zhoushu === 1 ? `第${(index + 1) + 1 * index}周` : `第${(index + 3) + 1 * index}周`, // 排课备注：第几周
          RQ: value,              // 日期
          PKTYPE: rowData.room?.cla === '单周' ? 2 : 3,
          XXSJPZ: {
            KSSJ: `${rowData?.course?.teacher?.substring(0, 5)}:00`
          }
        })
      })
    } else {
      doubleArr?.forEach((value: any, index: number) => {
        pkDatas.push({
          WEEKDAY: weekDay[colItem.dataIndex], // 周
          XXSJPZId: rowData.course?.hjId, // 时间ID
          KHBJSJId: chosenData?.KHBJSJId, // 班级ID
          PKBZ: `第${(index + 2) + 1 * index}周`, // 排课备注：第几周
          RQ: value,              // 日期
          PKTYPE: rowData.room?.cla === '单周' ? 2 : 3,
          XXSJPZ: {
            KSSJ: `${rowData?.course?.teacher?.substring(0, 5)}:00`
          }
        })
      })
    }
    console.log(singleArr,'singleArr')
    console.log(doubleArr,'doubleArr')
    let selectList = {
      WEEKDAY: weekDay[colItem.dataIndex], // 周
      XXSJPZId: rowData.course?.hjId, // 时间ID
      KHBJSJId: chosenData?.KHBJSJId, // 班级ID
      FJSJId: rowData.room?.jsId, // 教室ID
      XNXQId: chosenData?.XNXQId, // 学年学期ID
      PKTYPE: rowData.room?.cla === '单周' ? 2 : 3, // 排课类型,
      Type: types
    };

    if (type === 'edit') {
      // 将排好的课程再次点击可以取消时所需要的数据
      const selectdata = {
        WEEKDAY: weekDay[colItem.dataIndex], // 周
        XXSJPZId: rowData.course?.hjId, // 时间ID
        KHBJSJId: chosenData?.KHBJSJId, // 班级ID
        FJSJId: rowData.room?.jsId, // 教室ID
        XNXQId: chosenData?.XNXQId, // 学年学期ID
      };
      // 将获取取消单元格的数据传到父级
      if (typeof getSelectdata === 'function') {
        getSelectdata(selectdata);
      }
    }
    console.log(pkDatas,'pkDatas')

    // 将表格的所有数据传输到父级的方法
    if (typeof onExcelTableClick === 'function') {
      onExcelTableClick(selectList, seeChosenItem, pkDatas);
    }
  };
  const datas = stateTableData ? [...stateTableData] : [...dataSource];

  return (
    <div className={`${styles.excelTable} ${className}`}>
      <table style={{ boxShadow: '0px 5px 6px rgba(136,136,136,0.2)', marginBottom: '10px' }}>
        <thead>
          <tr>
            {columns.map((item) => {
              return (
                <th key={item.key} style={{ width: item.width, textAlign: item.align }}>
                  {item.title}
                </th>
              );
            })}
          </tr>
        </thead>
      </table>
      {datas && datas.length ? (
        <div className={styles.tableContent} style={style}>
          <table>
            <tbody>
              {datas.map((data, dataKey: any) => {
                return (
                  <tr key={Math.random()} style={{ borderBottom: Number.isInteger((dataKey + 1) / xXSJPZData?.length) ? '3px solid #e4e4e4' : '1px solid #e4e4e4' }}>
                    {columns.map((item, itemKey) => {
                      // 前两列没有事件
                      if (item.dataIndex === 'room' || item.dataIndex === 'course') {
                        if (item.dataIndex === 'room' && data.room.rowspan === 0) {
                          return '';
                        }
                        return (
                          <td
                            key={`${item.key}-${data.key}`}
                            style={{ width: item.width, textAlign: 'center' }}
                            rowSpan={item.dataIndex === 'room' ? data.room.rowspan : undefined}
                          >
                            {type === 'edit' ? (
                              <div className="classCard" style={{ textAlign: 'center' }}>
                                <div className={`cardcontent`}>
                                  <div
                                    className="cla"
                                    style={{
                                      width: item.dataIndex === 'room' ? 45 : '100%',
                                      margin: '0 auto',
                                      wordBreak: 'break-word',
                                    }}
                                  >
                                    {data[item.dataIndex].cla}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="classCard" style={{ textAlign: 'center' }}>
                                <div className={`cardTop`} />
                                <div className={`cardcontent`}>
                                  <div
                                    className="cla"
                                    style={{
                                      width: item.dataIndex === 'room' ? 45 : '100%',
                                      margin: '0 auto',
                                      wordBreak: 'break-word',
                                    }}
                                  >
                                    {data[item.dataIndex].cla}
                                  </div>
                                  <div className="teacher">{data[item.dataIndex].teacher}</div>
                                </div>
                              </div>
                            )}
                          </td>
                        );
                      }

                      return (
                        <td key={`${item.key}-${data.key}`} style={{ width: item.width }}>
                          <KBItem
                            mode={type}
                            data={data[item.dataIndex]}
                            disabled={data[item.dataIndex]?.length !== 0}
                            onClick={() => {
                              onTdClick(dataKey, itemKey);
                            }}
                            chosenData={chosenData}
                            Weeks={Weeks}
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.noContent}>暂无排课信息</div>
      )}
    </div>
  );
};

export default Index;
