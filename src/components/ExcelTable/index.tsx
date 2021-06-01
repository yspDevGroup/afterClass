import React, { useState } from 'react';
import type { FC } from 'react';
import styles from './index.less';

type IndexPropsType = {
  columns: any[];
  dataSource: any[];
};

const Index: FC<IndexPropsType> = ({ columns, dataSource }) => {
  const [row, setRowKey] = useState<number>();
  const [col, setColKey] = useState<number>();
  const [isShow, setIsShow] = useState<boolean>(false);
  const onTdClick = (rowKey: number, colKey: number, isShows: boolean) => {
    setRowKey(rowKey);
    setColKey(colKey);
    setIsShow(isShows);
  };
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
          {dataSource.map((data, dataKey) => {
            return (
              <tr key={Math.random()}>
                {columns.map((item, itemKey) => {
                  // 获取到点击的单元格
                  if (row === dataKey && col === itemKey && isShow) {
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
                        相同
                      </td>
                    );
                  }

                  return (
                    <td
                      key={`${item.key}-${data.key}`}
                      style={{ width: item.width }}
                      onClick={
                        //
                        () => {
                          if (item.dataIndex !== 'room' && item.dataIndex !== 'course') {
                            onTdClick(dataKey, itemKey, true);
                          }
                        }
                      }
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
