/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-const */
import React, { useState } from 'react';
import type { FC } from 'react';
import styles from './index.less';
import { Button } from 'antd';

type KBItemProps = {
  mode: 'see' | 'edit';
  data:
    | {
        cla: string;
        teacher: string;
        color: string;
      }
    | '';
  disabled: boolean;
  onClick?: () => void;
};

type WeenType = {
  cla: string;
  teacher: string;
  key: string;
  dis: boolean;
  bjId: string;
  color: string;
};

type DataSourceType = {
  key: string;
  room: { cla: string; teacher: string; rowspan?: number; jsId: string };
  course: { cla: string; teacher: string; hjId: string };
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
      {data === '' ? (
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
            }}
          >
            <div className="cla">{data?.cla}</div>
            {mode === 'see' ? <div className="teacher">{data?.teacher}</div> : ''}
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
  chosenData?: { cla: string; teacher: string; KHBJSJId?: string; XNXQId?: string; color: string };
  /** 选中项发生变化时的回调 */
  onExcelTableClick?: (value: any) => void;
  /** see: 单元格中不存在disable属性，edit： 单元格中存在disable属性  */
  type?: 'see' | 'edit';
  /** 切换页面  仅在type='see'起作用 */
  switchPages?: () => void;
  className: '' | undefined;
};

const Index: FC<IndexPropsType> = ({
  className,
  columns,
  dataSource,
  chosenData,
  onExcelTableClick,
  type = 'see',
  switchPages,
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
  const onTdClick = (rowKey: number, colKey: number) => {
    const newData = stateTableData ? [...stateTableData] : [...dataSource];
    const colItem = columns[colKey] || {};

    const rowData = newData[rowKey] || {};

    if (type === 'see' && !chosenData) {
      if (typeof switchPages === 'function') {
        switchPages();
      }
    } else if (type === 'edit') {
      if (chosenData && !rowData[colItem.dataIndex]) {
        rowData[colItem.dataIndex] = {
          cla: chosenData?.cla,
          teacher: chosenData?.teacher,
          dis: false,
          color: chosenData.color,
        };
      } else {
        rowData[colItem.dataIndex] = '';
      }
      setStateTableData(newData);
    }

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

    if (typeof onExcelTableClick === 'function') {
      onExcelTableClick(selectList);
    }
  };

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
      {dataSource && dataSource.length > 0 ? (
        <div className={styles.tableContent}>
          <table>
            <tbody>
              {dataSource.map((data, dataKey: any) => {
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
                                      width: item.dataIndex === 'room' ? 20 : '100%',
                                      margin: '0 auto',
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
                                      width: item.dataIndex === 'room' ? 20 : '100%',
                                      margin: '0 auto',
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
        <div className={styles.noContent}>当前暂无课程安排</div>
      )}
    </div>
  );
};

export default Index;
