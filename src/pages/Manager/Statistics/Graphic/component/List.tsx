/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-29 11:17:44
 * @LastEditTime: 2021-10-26 08:41:08
 * @LastEditors: Sissle Lynn
 */
import React from 'react';
import { Col, Row } from 'antd';

import styles from '../index.less';

const List = (props: { data: any, col?: number, }) => {
  const { data, col = 3, } = props;
  return (
    <Row className={styles.serviceList} style={{ height: '20vh', alignContent: 'flex-start' }}>
      {data?.map((item: any, index: number) => {
        if (index < col*5) {
          return <Col span={24 / col} key={item.title} style={{ marginTop: index >= col ? 24 : 0 }}>
            <p style={{textIndent:'16px'}}>{item}</p>
          </Col>
        }
        return ''
      })}
    </Row>
  );
};
export default List;
