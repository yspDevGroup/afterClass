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
          <Tooltip title={
            // eslint-disable-next-line no-nested-ternary
            item.title === '课程总数' ? '本校课程与引入课程总数' : (item.title === '课程班总数' ? '已生效服务课堂与缤纷课堂总数' : (item.title === '参与班级数' ? '参与课后服务行政班总数' : ''))
          } defaultVisible={false}>
            <div className={styles.headerItem} style={{ background: `linear-gradient(180deg, ${bgColor[index].begin} 0%, ${bgColor[index].end} 100%)` }}>
              <h3>{data?.[item.type] || 0}</h3>
              <p style={{ cursor: 'pointer' }} title={item.title}>{item.title}</p>
            </div>
          </Tooltip>
        </Col>
      })}
    </Row >
  );
};
export default Topbar;
