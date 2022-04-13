import { Empty, Tabs } from 'antd';
import { useModel } from 'umi';
import ListComp from '../components/ListComponent';
import styles from '../index.less';
import TopNav from './../components/TopNav';
import noData from '@/assets/noData.png';
import { useEffect, useState } from 'react';
import { getJYJGTZGG } from '@/services/after-class/jyjgtzgg';
import { getXXTZGG } from '@/services/after-class/xxtzgg';

const { TabPane } = Tabs;
const AllNotice = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [dataTZGG, setTZGGData] = useState<any>();
  const [dataZCGG, setZCGGData] = useState<any>();

  useEffect(() => {
    async function fetchData() {
      // 通知公告
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
          list: resgetXXTZGG.data?.rows || [],
          noDataText: '暂无待办',
          noDataImg: noData,
        };
        setZCGGData(newData);
      }

      // 政策公告
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
          list: resgetXXZCGG.data?.rows || [],
          noDataText: '暂无待办',
          noDataImg: noData,
        };
        setTZGGData(newData);
      }
    }

    fetchData();
  }, []);

  return (
    <div className={styles.AllNotice}>
      <TopNav title="全部公告" state={true} />
      <div className={styles.allNotices}>
        <Tabs centered={true}>
          <TabPane tab="校内通知" key="notify">
            {dataTZGG?.list.length ? (
              <>
                <ListComp listData={dataTZGG} type="tz" />
              </>
            ) : (
              <Empty
                image={noData}
                imageStyle={{
                  minHeight: 135,
                }}
                style={{
                  minHeight: 200,
                  background: '#fff',
                  borderRadius: '8px',
                  marginTop: '10px',
                }}
                description={'暂无公告'}
              />
            )}
          </TabPane>
          <TabPane tab="政策公告" key="policy">
            {dataZCGG?.list.length ? (
              <>
                <ListComp listData={dataZCGG} type="zc" />
              </>
            ) : (
              <Empty
                image={noData}
                imageStyle={{
                  minHeight: 135,
                }}
                style={{
                  minHeight: 200,
                  background: '#fff',
                  borderRadius: '8px',
                  marginTop: '10px',
                }}
                description={'暂无公告'}
              />
            )}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default AllNotice;
