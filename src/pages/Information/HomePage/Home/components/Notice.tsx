import React, { useContext, useEffect, useState } from 'react';
import myContext from '@/utils/MyContext';
import noData from '@/assets/noData.png';
import moment from 'moment';
import styles from '../index.less';
import { Link, useModel } from 'umi';
import { Button, Col, Empty, Row, Tabs } from 'antd';
import IconFont from '@/components/CustomIcon';
import ListComp from './ListComponent';
import { JYJGSJ } from '@/services/after-class/jyjgsj';
import { getJYJGTZGG } from '@/services/after-class/jyjgtzgg';
import ArrowDownOutlined from '@ant-design/icons/lib/icons/ArrowDownOutlined';
import { getXXTZGG } from '@/services/after-class/xxtzgg';

const { TabPane } = Tabs;
const Notice = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { jyjId } = currentUser!;
  const [dataTZGG, setTZGGData] = useState<any>();
  const [dataZCGG, setZCGGData] = useState<any>();
  const [tabSelect, setTabSelect] = useState<any>('policy');
  const [loadings, setLoadings] = useState<Array<any>>([]);
  const [allTZDataSource, setAllTZDataSource] = useState<any>();
  const [allZCDataSource, setAllZCDataSource] = useState<any>();

  const handalTabClick = (key: string) => {
    setTabSelect(key);
  }

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
    async function fetchData() {
      //通知公告
      const resgetXXTZGG = await getJYJGTZGG({
        BT: '',
        LX: 1,
        ZT: ['已发布'],
        XZQHM: currentUser?.XZQHM,
        page: 0,
        pageSize: 0,
      });
      if (resgetXXTZGG.status === 'ok') {
        let newData = {
          type: 'actList',
          cls: 'actList',
          list: resgetXXTZGG.data?.rows?.slice(0, 3) || [],
          noDataText: '暂无待办',
          noDataImg: noData,
        };
        setZCGGData(newData);
        newData.list = resgetXXTZGG.data?.rows || [];
        console.log('TZnewData: ', newData);
        setAllZCDataSource(newData)
      }

      //政策公告
      const resgetXXZCGG = await getXXTZGG({
        XXJBSJId: currentUser?.xxId,
        BT: '',
        LX: ['0','1'],
        ZT: ['已发布', '草稿'],
        page: 0,
        pageSize: 0,
      });
      if (resgetXXZCGG.status === 'ok') {
        console.log('resgetXXZCGG: ', resgetXXZCGG);
        let newData = {
          type: 'azeList',
          cls: 'azeList',
          list: resgetXXZCGG.data?.rows?.slice(0, 3) || [],
          noDataText: '暂无待办',
          noDataImg: noData,
        };
        setTZGGData(newData);
        newData.list = resgetXXZCGG.data?.rows || [];
        console.log('ZCnewData: ', newData);
        setAllTZDataSource(newData);
      }
    }


    fetchData();
  }, [tabSelect]);

  return (
    <div className={styles.notice}>
      <Tabs
        centered={true}
        onTabClick={handalTabClick}
      >
        <TabPane tab="政策公告" key="policy">
          {
            dataZCGG?.list.length ?  <>
              <ListComp listData={dataZCGG} type='zc'/>
              <Link to={{ pathname: '/information/allNotice', state: { allDataSource: allZCDataSource, type: 'zc'} }}>
                <Col span={12} offset={8}><Button type="primary" onClick={() => enterLoading(1)} className={styles.moreBtn} loading={loadings[1]} ghost={true} icon={<ArrowDownOutlined />}>查看更多</Button></Col>
              </Link>
            </> : <Empty
            image={noData}
            imageStyle={{
              minHeight: 135
            }}
            style={{ minHeight: 200,background: '#fff',borderRadius: '8px' }}
            description={'暂无公告'} />
          }

        </TabPane>
        <TabPane tab="通知公告" key="notify">
          {
            dataTZGG?.list.length ? <>
              <ListComp listData={dataTZGG} type='tz'/>
              <Link to={{ pathname: '/information/allNotice', state: { allDataSource: allTZDataSource , type: 'tz' } }}>
                <Col span={12} offset={8}><Button type="primary" onClick={() => enterLoading(2)} className={styles.moreBtn} loading={loadings[2]} ghost={true} icon={<ArrowDownOutlined />}>查看更多</Button></Col>
              </Link>
            </> : <Empty
              image={noData}
              imageStyle={{
                minHeight: 135
              }}
              style={{ minHeight: 200,background: '#fff',borderRadius: '8px' }}
              description={'暂无公告'} />
          }

        </TabPane>
      </Tabs>
    </div>
  );
};

export default Notice;
