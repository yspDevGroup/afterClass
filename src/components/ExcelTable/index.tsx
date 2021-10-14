/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-const */
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import type { FC } from 'react';
// import WWOpenDataCom from '@/pages/Manager/ClassManagement/components/WWOpenDataCom';
import styles from './index.less';
import EllipsisHint from '../EllipsisHint';
import WWOpenDataCom from '../WWOpenDataCom';

type KBItemProps = {
  mode: 'see' | 'edit';
  data:
    | {
        cla: string;
        teacher: string;
        teacherWechatId?: string;
        color: string;
        bjzt: string;
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
        }}
      >
        <div className={styles.disImage}>&nbsp;</div>
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
        height: mode === 'see' ? 78 : 48,
        padding: mode === 'see' ? 4 : 2,
        border: 0,
        background: 'transparent',
        width: '100%',
      }}
    >
      {!data ? (
        <>&nbsp;</>
      ) : (
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
            <div className="cla">
              <EllipsisHint text={data?.cla} width={mode === 'see' ? '100%' : '100%'} />
              {/* {data?.cla} */}
            </div>
            {mode === 'see' ? (
              <div className="teacher">
                {data.teacher === '未知' && data.teacherWechatId ? (
                  <WWOpenDataCom type="userName" openid={data.teacherWechatId} />
                ) : (
                  data.teacher
                )}
                {/* <WWOpenDataCom
                  type="userName"
                  style={{ color: data?.color }}
                  openid={data?.teacher}
                /> */}
              </div>
            ) : (
              ''
            )}
            {mode === 'see' && data?.bjzt === '已开班' ? (
              <div className={styles.duihao}>√</div>
            ) : (
              ''
            )}
          </div>
        </div>
      )}
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
  /** 表格接口没有处理的数据 */
  basicData?: any[];
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
  radioValue,
  // basicData,
  tearchId,
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
      } else {
        seeChosenItem = {
          XQ: rowData[colItem.dataIndex]?.xqId, // 校区ID
          NJ: rowData[colItem.dataIndex]?.njId, // 年级ID
          KC: rowData[colItem.dataIndex]?.kcId, // 课程ID
          BJId: rowData[colItem.dataIndex]?.bjId, //  课程班ID
          CDLX: rowData.room?.FJLXId, // 场地类型ID
          CDMC: rowData.room?.jsId, // 场地名称
          weekId: rowData[colItem.dataIndex]?.weekId, // 排课ID
          jsId: rowData.room?.jsId, // 教室ID
          hjId: rowData.course?.hjId, // 时间ID
        };
        if (typeof switchPages === 'function') {
          switchPages();
        }
      }
    } else if (type === 'edit') {
      if (chosenData && !rowData[colItem.dataIndex]) {
        let connst = -1;
        newData?.forEach((item: any, key: any) => {
          if (
            item[colItem.dataIndex] &&
            item.course.hjId === rowData.course?.hjId &&
            item[colItem.dataIndex]?.teacherID === tearchId
          ) {
            connst = key;
          }
        });
        if (connst === -1) {
          rowData[colItem.dataIndex] = {
            cla: chosenData?.cla,
            teacher: chosenData?.teacher,
            teacherID: chosenData?.teacherID,
            dis: false,
            color: chosenData.color,
          };
        } else if (connst !== -1) {
          Modal.warning({
            title: '不能将同一个老师安排在同一天的同一时段内上课',
            onOk() {
              rowData[colItem.dataIndex] = '';
            },
          });
        }
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
    let pkData = null;
    if (type === 'edit') {
      pkData = {
        KHBJSJId: chosenData?.KHBJSJId, // 班级ID
        FJSJId: rowData.room?.jsId, // 教室ID
        WEEKDAY: weekDay[colItem.dataIndex], // 周
        XXSJPZId: rowData.course?.hjId, // 时间ID
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
      <table>
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
        <div className={styles.tableContent}>
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
        <div className={styles.noContent}>
          {radioValue ? '当前暂无课程安排' : '当前暂无排课的场地'}
        </div>
      )}
    </div>
  );
};

export default Index;
