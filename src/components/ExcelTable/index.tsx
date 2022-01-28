/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-const */
import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import { Button, Modal } from 'antd';
import ShowName from '@/components/ShowName';
import EllipsisHint from '../EllipsisHint';

import styles from './index.less';
import moment from 'moment';

type KBItemProps = {
  mode: 'see' | 'edit';
  data:
  | {
    cla: string;
    teacher: string;
    teacherWechatId?: string;
    color: string;
    bjzt: string;
    jcmc: string;
    fjmc: string;
  }
  | '';
  disabled: boolean;
  onClick?: () => void;
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

const KBItem: FC<KBItemProps> = ({ mode, data, disabled, onClick }) => {
  if (mode === 'edit' && disabled) {
    return (
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
          <EllipsisHint text={data?.cla} width={'100%'} />
        </div>
      </Button>
    );
  }
  return (
    <Button
      type="text"
      disabled={mode === 'see' ? false : disabled}
      onClick={() => {
        if (typeof onClick === 'function') {
          onClick();
        }
      }}
      style={{
        height: mode === 'see' ? 98 : 48,
        padding: mode === 'see' ? 4 : 2,
        border: 0,
        background: 'transparent',
        width: '100%',
      }}
    >
      {!data ? (
        <>&nbsp;</>
      ) : <>
        {
          data?.cla === '无法排课' ? <div className={styles.NoPk}><p>超出学年学期</p><span>无法排课</span></div> :
            <div className="classCard">
              <div
                className={`cardTop`}
                style={{
                  background: data?.color,
                }}
              />
              <div
                className={`cardcontent`}
                style={{
                  color: data?.color,
                  background: data?.color.replace('1)', '0.1)'),
                  position: 'relative',
                }}
              >
                {mode === 'see' ? (
                  <div className="teacher" style={{
                    width: '100%',
                    height: 22,
                    display: 'flex',
                    justifyContent: 'space-between',
                    overflow: 'hidden'
                  }}>
                    <span style={{
                      width: 'calc(100% - 54px)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>{data?.jcmc}</span>
                    <ShowName
                      XM={data.teacher}
                      type="userName"
                      openid={data.teacherWechatId}
                      style={{
                        color: data?.color,
                      }}
                    />
                  </div>
                ) : (
                  <span />
                )}
                <div className="cla">
                  <EllipsisHint text={data?.cla} width={mode === 'see' ? '100%' : '100%'} />
                  {/* {data?.cla} */}
                </div>

                {mode === 'see' ? (
                  <div className="teacher" style={{ height: 22 }}>
                    <span>{data?.fjmc}</span>
                  </div>
                ) : (
                  <span />
                )}
                {mode === 'see' && data?.bjzt === '已开班' ? (
                  <div className={styles.duihao}>√</div>
                ) : (
                  ''
                )}
              </div>
            </div>
        }
      </>}
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
  };
  /** 选中项发生变化时的回调 value: type='edit'时的数据； record：type='see'时的数据； bjId： 班级ID */
  onExcelTableClick?: (value: any, record: any, bjId: any) => void;
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

  const onTdClick = (rowKey: number, colKey: number) => {
    //  不能直接操作表格的数据
    // 需要复制一份数据出来进行修改  不然在操作表格时容易触发state 导致重新渲染
    const newData = stateTableData ? [...stateTableData] : [...dataSource];

    // 表头数据： 根据在表格上点击获取到的key值来获取此单元格的表头数据
    const colItem = columns[colKey] || {};


    // 一行的数据：根据在表格上点击获取到的key值来获取此单元格的行数据
    const rowData = newData[rowKey] || {};

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
        // let connst = -1;
        // newData?.forEach((item: any, key: any) => {
        //   if (
        //     item[colItem.dataIndex] &&
        //     item.course.hjId === rowData.course?.hjId &&
        //     item[colItem.dataIndex]?.teacherID === tearchId
        //   ) {
        //     connst = key;
        //   }
        // });
        // if (connst === -1) {
        rowData[colItem.dataIndex] = {
          cla: chosenData?.cla,
          teacher: chosenData?.teacher,
          teacherID: chosenData?.teacherID,
          dis: false,
          color: chosenData.color,
        };
        // } else if (connst !== -1) {
        //   Modal.warning({
        //     title: '不能将同一个老师安排在同一天的同一时段内上课',
        //     onOk() {
        //       rowData[colItem.dataIndex] = '';
        //     },
        //   });
        // }
      } else {
        rowData[colItem.dataIndex] = '';
      }
      setStateTableData(newData);
    }

    // 选中班级后 单元格的数据
    let selectList = null;
    if (rowData[colItem.dataIndex]) {
      selectList = {
        WEEKDAY: weekDay[colItem.dataIndex], // 周
        XXSJPZId: rowData.course?.hjId, // 时间ID
        KHBJSJId: chosenData?.KHBJSJId, // 班级ID
        FJSJId: rowData.room?.jsId, // 教室ID
        XNXQId: chosenData?.XNXQId, // 学年学期ID
      };
    }

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

    const weekDays = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
      sunday: 7,
    };
    // 学年学期开始日期
    const start = new Date(TimeData?.KSRQ);
    // 获取学年学期开始日期为当周的周几
    const staetWeek = Number(moment(start).format('E'));
    const Num = Number(rowData?.room.keys) * 7 + weekDays[colItem.dataIndex] - staetWeek;
    // 计算点击格子的日期
    const newDay = moment(start).add(Num, "days").format("YYYY-MM-DD");

    let pkData = null;
    if (type === 'edit') {
      pkData = {
        KHBJSJId: chosenData?.KHBJSJId, // 班级ID
        FJSJId: rowData.room?.jsId, // 教室ID
        WEEKDAY: weekDay[colItem.dataIndex], // 周
        XXSJPZId: rowData.course?.hjId, // 时间ID
        RQ: newDay,
        IsDSZ: (Number(rowData?.room.cla + 1) % 2 === 0) ? 1 : 0,
        PKBZ: rowData?.room.cla
      };
    } else if (type === 'see') {
      pkData = rowData[colItem.dataIndex]?.bjId;
    }
    // 将表格的所有数据传输到父级的方法
    if (typeof onExcelTableClick === 'function') {
      onExcelTableClick(selectList, seeChosenItem, pkData);
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
                  <tr key={Math.random()}>
                    {columns.map((item, itemKey) => {
                      // 前两列没有事件
                      if (item.dataIndex === 'room' || item.dataIndex === 'course') {
                        if (item.dataIndex === 'room' && data.room.rowspan === 0) {
                          return '';
                        }
                        return (
                          <td
                            key={`${item.key}-${data.key}`}
                            style={{ width: item.width, textAlign: item.align }}
                            rowSpan={item.dataIndex === 'room' ? data.room.rowspan : undefined}
                          >
                            {type === 'edit' ? (
                              <div className="classCard" style={{ textAlign: 'center' }}>
                                <div className={`cardcontent`}>
                                  <div
                                    className="cla"
                                    style={{
                                      width: item.dataIndex === 'room' ? 40 : '100%',
                                      margin: '0 auto',
                                      wordBreak: 'break-word',
                                    }}
                                  >
                                    {data[item.dataIndex].cla}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="classCard" style={{ textAlign: item.align }}>
                                <div className={`cardTop`} />
                                <div className={`cardcontent`}>
                                  <div
                                    className="cla"
                                    style={{
                                      width: item.dataIndex === 'room' ? 40 : '100%',
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
                            disabled={!!data[item.dataIndex]?.dis}
                            onClick={() => {
                              onTdClick(dataKey, itemKey);
                            }}
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
