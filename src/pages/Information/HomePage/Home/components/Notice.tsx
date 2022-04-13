/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useState } from 'react';
import noData from '@/assets/noData.png';
import styles from '../index.less';
import { Link, useModel } from 'umi';
import { Button, Col, Empty, Tabs } from 'antd';
import ListComp from './ListComponent';
import { getJYJGTZGG } from '@/services/after-class/jyjgtzgg';
import ArrowDownOutlined from '@ant-design/icons/lib/icons/ArrowDownOutlined';
import { getXXTZGG } from '@/services/after-class/xxtzgg';

const { TabPane } = Tabs;
const Notice = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [dataTZGG, setTZGGData] = useState<any>();
  const [dataZCGG, setZCGGData] = useState<any>();
  const [loadings, setLoadings] = useState<any[]>([]);
  const [allTZDataSource, setAllTZDataSource] = useState<any>();
  const [allZCDataSource, setAllZCDataSource] = useState<any>();

  const enterLoading = (index: number) => {
    const newLoadings = [...loadings];
    newLoadings[index] = true;
    setLoadings(newLoadings);
    setTimeout(() => {
      const newLoadings = [...loadings];
      newLoadings[index] = false;
      setLoadings(newLoadings);
    }, 3000);
  };

  useEffect(() => {
    (async () => {
      // 政策公告
      const resgetXXTZGG = await getJYJGTZGG({
        BT: '',
        LX: 1,
        ZT: ['已发布'],
        XZQHM: currentUser?.XZQHM,
        page: 0,
        pageSize: 0,
      });
      if (resgetXXTZGG.status === 'ok') {
        const newData = {
          type: 'azeList',
          cls: 'azeList',
          list: resgetXXTZGG.data?.rows?.slice(0, 3) || [],
          noDataText: '暂无待办',
          noDataImg: noData,
        };
        setZCGGData(newData);
        const newAllData = {
          type: 'azeList',
          cls: 'azeList',
          list: resgetXXTZGG.data?.rows || [],
          noDataText: '暂无待办',
          noDataImg: noData,
        };
        setAllZCDataSource(newAllData);
      }
      // 通知公告
      const resgetXXZCGG = await getXXTZGG({
        XXJBSJId: currentUser?.xxId,
        BT: '',
        LX: ['0'],
        ZT: ['已发布'],
        page: 0,
        pageSize: 0,
      });
      if (resgetXXZCGG.status === 'ok') {
        const newData = {
          type: 'azeList',
          cls: 'azeList',
          list: resgetXXZCGG.data?.rows?.slice(0, 3) || [],
          noDataText: '暂无待办',
          noDataImg: noData,
        };
        setTZGGData(newData);
        const newAllData = {
          type: 'azeList',
          cls: 'azeList',
          list: resgetXXZCGG.data?.rows || [],
          noDataText: '暂无待办',
          noDataImg: noData,
        };
        setAllTZDataSource(newAllData);
      }
    })();
  }, []);

  return (
    <div className={styles.notice}>
      <Tabs centered={true}>
        <TabPane tab="校内通知" key="notify">
          {dataTZGG?.list.length ? (
            <>
              <ListComp listData={dataTZGG} type="tz" />
              <Link
                to={{
                  pathname: '/information/allNotice',
                  state: {
                    allZCDataSource,
                    allTZDataSource,
                    type: 'tz',
                  },
                }}
              >
                <Col span={12} offset={8}>
                  <Button
                    type="primary"
                    onClick={() => enterLoading(2)}
                    className={styles.moreBtn}
                    loading={loadings[2]}
                    ghost={true}
                    icon={<ArrowDownOutlined />}
                  >
                    查看更多
                  </Button>
                </Col>
              </Link>
            </>
          ) : (
            <Empty
              image={noData}
              imageStyle={{
                minHeight: 135,
              }}
              style={{ minHeight: 200, background: '#fff', borderRadius: '8px', marginTop: '10px' }}
              description={'暂无公告'}
            />
          )}
        </TabPane>
        <TabPane tab="政策公告" key="policy">
          {dataZCGG?.list.length ? (
            <>
              <ListComp listData={dataZCGG} type="zc" />
              <Link
                to={{
                  pathname: '/information/allNotice',
                  state: {
                    allZCDataSource,
                    allTZDataSource,
                    type: 'zc',
                  },
                }}
              >
                <Col span={12} offset={8}>
                  <Button
                    type="primary"
                    onClick={() => enterLoading(1)}
                    className={styles.moreBtn}
                    loading={loadings[1]}
                    ghost={true}
                    icon={<ArrowDownOutlined />}
                  >
                    查看更多
                  </Button>
                </Col>
              </Link>
            </>
          ) : (
            <Empty
              image={noData}
              imageStyle={{
                minHeight: 135,
              }}
              style={{ minHeight: 200, background: '#fff', borderRadius: '8px', marginTop: '10px' }}
              description={'暂无公告'}
            />
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Notice;
