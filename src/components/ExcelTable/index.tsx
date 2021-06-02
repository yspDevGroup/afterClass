/* eslint-disable prefer-const */
import React, { useState } from 'react';
import type { FC } from 'react';
import styles from './index.less';
import { Button } from 'antd';

type IndexPropsType = {
  /** 表格列 */
  columns: any[];
  /** 表格的数据 */
  dataSource: any[];
  /** 选中的值  在type='edit'时必传  KHBJSJId: 班级ID，XNXQId： 学年学期ID  */
  chosenData?: { cla: string; teacher: string; KHBJSJId: string; XNXQId: string };
  /** 选中项发生变化时的回调 */
  onExcelTableClick?: (value: any) => void;
  /** see: 单元格中不存在disable属性，edit： 单元格中存在disable属性  */
  type?: 'see' | 'edit';
  /** 切换页面  仅在type='see'起作用 */
  switchPages?: () => void;
};

const Index: FC<IndexPropsType> = ({
  columns,
  dataSource,
  chosenData,
  onExcelTableClick,
  type = 'see',
  switchPages,
}) => {
  let [stateTableData, setStateTableData] = useState<any>();
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
    stateTableData = stateTableData || [...dataSource];
    const colItem = columns[colKey] || {};

    const newData = [...stateTableData];
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
          key: '8',
          dis: false,
        };
      } else {
        rowData[colItem.dataIndex] = '';
      }
      setStateTableData(newData);
    }

    let selectList = {};
    if (rowData[colItem.dataIndex]) {
      selectList = {
        WEEKDAY: weekDay[colItem.dataIndex], // 周
        XXSJPZId: rowData.course.hjId, // 时间ID
        KHBJSJId: chosenData?.KHBJSJId, // 班级ID
        FJSJId: rowData.room.jsId, // 教室ID
        XNXQId: chosenData?.XNXQId, // 学年学期ID
      };
    }

    if (typeof onExcelTableClick === 'function') {
      onExcelTableClick(selectList);
    }
  };

  const datas = stateTableData || dataSource;
  return (
    <div className={styles.excelTable}>
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
        <tbody>
          {datas.map((data: any, dataKey: any) => {
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
                        rowSpan={item.dataIndex === 'room' ? data.room.rowspan : ''}
                      >
                        <div className="classCard" style={{ textAlign: item.align }}>
                          <div className={`cardTop cardTop${data[item.dataIndex].key}`} />
                          <div
                            className={`cardcontent cardTop${data[item.dataIndex].key} cardcontent${
                              data[item.dataIndex].key
                            }`}
                          >
                            <div className="cla">{data[item.dataIndex].cla}</div>
                            <div className="teacher">{data[item.dataIndex].teacher}</div>
                          </div>
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td key={`${item.key}-${data.key}`} style={{ width: item.width }}>
                      <Button
                        type="text"
                        disabled={type === 'see' ? false : !!data[item.dataIndex]?.dis}
                        onClick={() => {
                          onTdClick(dataKey, itemKey);
                        }}
                        style={{
                          height: 70,
                          padding: 0,
                          border: 0,
                          background: 'transparent',
                          width: '100%',
                        }}
                      >
                        {data[item.dataIndex] ? (
                          <div className="classCard">
                            <div className={`cardTop cardTop${data[item.dataIndex].key}`} />
                            <div
                              className={`cardcontent cardTop${
                                data[item.dataIndex].key
                              } cardcontent${data[item.dataIndex].key}`}
                            >
                              <div className="cla">{data[item.dataIndex].cla}</div>
                              <div className="teacher">{data[item.dataIndex].teacher}</div>
                            </div>
                          </div>
                        ) : (
                          ' '
                        )}
                      </Button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Index;
