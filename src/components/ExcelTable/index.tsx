import React, { useState } from 'react';
import type { FC } from 'react';
import styles from './index.less';
import { Button } from 'antd';

type IndexPropsType = {
  /** 表格列 */
  columns: any[];
  /** 表格的数据 */
  dataSource: any[];
  /** 选中的值 */
  chosenData?: { cla: string; teacher: string };
  /** 选中项发生变化时的回调 */
  onExcelTableClick?: (value: any) => void;
  /** see: 单元格中不存在disable属性，edit： 单元格中存在disable属性  */
  type?: 'see' | 'edit';
  /** 切换页面  仅在type='see'起作用 */
  switchPages: any;
};

const Index: FC<IndexPropsType> = ({
  columns,
  dataSource,
  chosenData,
  onExcelTableClick,
  type = 'see',
  switchPages,
}) => {
  const [row, setRowKey] = useState<number>(0);
  const [col, setColKey] = useState<number>(0);
  const [isShow, setIsShow] = useState<boolean>(false);
  let [stateTableData] = useState<any>();

  const onTdClick = (rowKey: number, colKey: number, isShows: boolean) => {
    stateTableData = stateTableData || [...dataSource];
    const colItem = columns[colKey] || {};
    const rowData = stateTableData[rowKey] || {};
    if (type === 'see') {
      switchPages();
    } else if (type === 'edit') {
      if (isShows && chosenData) {
        rowData[colItem.dataIndex] = {
          cla: chosenData?.cla,
          teacher: chosenData?.teacher,
          key: '8',
          dis: false,
        };
      } else {
        rowData[colItem.dataIndex] = '';
      }
    }
    setRowKey(rowKey);
    setColKey(colKey);
    setIsShow(isShows);
    if (typeof onExcelTableClick === 'function') {
      onExcelTableClick(stateTableData);
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
                <th key={item.key} style={{ width: item.width }}>
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
                  // 获取到点击的单元格
                  if (row === dataKey && col === itemKey && isShow && chosenData) {
                    return (
                      <td
                        key={`${item.key}-${data.key}`}
                        style={{ width: item.width }}
                        onClick={
                          //
                          () => {
                            if (item.dataIndex !== 'room' && item.dataIndex !== 'course') {
                              onTdClick(dataKey, itemKey, false);
                            }
                          }
                        }
                      >
                        <div className="classCard">
                          <div
                            className={`cardTop`}
                            style={{ backgroundColor: 'rgba(139,87,42,1)' }}
                          />
                          <div
                            className={`cardcontent`}
                            style={{
                              backgroundColor: 'rgba(139,87,42,0.1)',
                              color: 'rgba(139,87,42,1)',
                            }}
                          >
                            <div className="cla">{chosenData?.cla}</div>
                            <div className="teacher">{chosenData?.teacher}</div>
                          </div>
                        </div>
                      </td>
                    );
                  }

                  // 前两列没有事件
                  if (item.dataIndex === 'room' || item.dataIndex === 'course') {
                    return (
                      <td key={`${item.key}-${data.key}`} style={{ width: item.width }}>
                        <div className="classCard">
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
                        disabled={type === 'see' ? false : data[item.dataIndex].dis}
                        onClick={() => {
                          onTdClick(dataKey, itemKey, true);
                        }}
                        style={{
                          height: 70,
                          padding: 0,
                          border: 0,
                          background: 'transparent',
                          width: '100%',
                        }}
                      >
                        <div className="classCard">
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
