/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-01 11:07:27
 * @LastEditTime: 2021-09-05 11:10:00
 * @LastEditors: Sissle Lynn
 */
import React from 'react';
import { Col, Empty, Row } from 'antd';
import noData from '@/assets/noData.png';

import styles from './index.less';

const DobuleList = (props: { type: string, data?: any, noDataImg?: any, noDataText?: string }) => {
  const { data, noDataImg = noData, noDataText = '暂无信息' } = props;
  return (
    <div className={styles.dobuleList}>
      {data?.length ? <Row gutter={[24,0]}>
        {data.map((item: { KCMC?: string }) => {
          return <Col key={item.KCMC} span={12}>
            <span>
              {item.KCMC}
            </span>
          </Col>
        })}
      </Row> : <Empty
        image={noDataImg}
        imageStyle={{
          height: 80,
        }}
        description={noDataText} />}
    </div>
  );
};
export default DobuleList;
