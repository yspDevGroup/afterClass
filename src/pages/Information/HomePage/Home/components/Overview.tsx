/* eslint-disable no-nested-ternary */
import React, { useContext, useEffect, useState } from 'react';
import styles from '../index.less';
import { Link, useModel } from 'umi';
import { Card, Col, Row, Tabs } from 'antd';
import { topNum } from './utils';
import { homePage } from '@/services/after-class/xxjbsj';
import { queryXNXQList } from '@/services/local-services/xnxq';

const { TabPane } = Tabs;
const Overview = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [homeData, setHomeData] = useState<any>();
  useEffect(() => {
    async function fetchData() {
      const result = await queryXNXQList(currentUser?.xxId);
      const res = await homePage({
        XXJBSJId: currentUser?.xxId,
        XNXQId: result.current?.id,
      });
      if (res.status === 'ok') {
        setHomeData({
          ...res.data,
          xs_counts: Number(res?.data?.xs_count + res?.data?.khfwxs_count),
          tk_amounts: Number(res?.data?.tk_amount + res?.data?.khtk_amount),
          bjdd_amount: Number(
            res?.data?.bjdd_amount + res?.data?.khfw_amount + res?.data?.zzfw_amount,
          ),
        });
      }
    }
    fetchData();
  }, []);

  const ItemCard = (props: any) => {
    const { title, count, bgImg, zzfw } = props;
    return (
      <Card
        className={styles.card}
        bordered={false}
        bodyStyle={{ paddingTop: 8.8, paddingLeft: 8.8, minHeight: '101.7px' }}
      >
        <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
        </p>
        <p>
          {title.indexOf('元') !== -1
            ? title.indexOf('收费') !== -1
              ? ((count || 0) + (zzfw || 0)).toFixed(2)
              : parseFloat(count || 0).toFixed(2)
            : count || 0}
        </p>
        <img className={styles.bgImg} src={bgImg} alt="" />
      </Card>
    );
  };

  return (
    <div className={styles.overview}>
      <Tabs centered={false}>
        <TabPane tab="本学期概述" key="semester">
          <Row gutter={[8, 8]}>
            {topNum.map((item, index) => {
              return (
                <Col className="gutter-row" span={8}>
                  <ItemCard
                    title={item.title}
                    count={homeData ? homeData[item.type] : 0}
                    bgImg={item.bgImg}
                    key={index}
                    zzfw={homeData?.zzfw_amount ? homeData?.zzfw_amount : 0}
                  />
                </Col>
              );
            })}
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Overview;

