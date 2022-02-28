/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-01 10:53:07
 * @LastEditTime: 2021-10-18 17:21:13
 * @LastEditors: Please set LastEditors
 */
import React from 'react';
import { Col, Row, Tooltip } from 'antd';
import { bgColor, topNum } from './utils';

import styles from './index.less';

const Topbar = (props: { data: any }) => {
  const { data } = props;
  return (
    <Row gutter={[24, 24]} className={styles.topHeader}>
      {topNum.map((item, index) => {
        return <Col span={4} key={item.title}>
          <div className={styles.headerItem} style={{ background: `linear-gradient(180deg, ${bgColor[index].begin} 0%, ${bgColor[index].end} 100%)` }}>
            <h3>{data?.[item.type] || 0}</h3>
            <Tooltip title={
              // eslint-disable-next-line no-nested-ternary
              item.title === '�γ�����' ? '��У�γ�������γ�����' : (item.title === '�γ̰�����' ? '����Ч����������ͷ׿�������' : (item.title === '����༶��' ? '����κ��������������' : ''))
            }
              defaultVisible={false}>
              <p title={item.title}>{item.title}</p>
            </Tooltip>

          </div>
        </Col>
      })}
    </Row>
  );
};
export default Topbar;
