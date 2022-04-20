import React, { useEffect, useState } from 'react';
import ListComp from '@/components/ListComponent';
import styles from './index.less';
import type { ListData, ListItem } from '@/components/ListComponent/data';
import moment from 'moment';
import Nodata from '@/components/Nodata';
import noData from '@/assets/noTzgg1.png';
import Pagina from '../../components/Pagination/Pagination';
import GoBack from '@/components/GoBack';
import { Tabs } from 'antd';
import { getJYJGTZGG } from '@/services/after-class/jyjgtzgg';
import { getXXTZGG } from '@/services/after-class/xxtzgg';
import { enHenceMsg } from '@/utils/utils';
import { useModel } from 'umi';
import MobileCon from '@/components/MobileCon';

const defaultList: ListData = {
  type: 'onlyList',
  cls: 'onlyOneList',
  list: [],
};
const { TabPane } = Tabs;
const Notice = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [annoceList, setAnnoceList] = useState<ListData>(defaultList);
  const [ZCDataList, setZCDataList] = useState<ListData>(defaultList);
  const [pages, setPages] = useState<number>(1);
  const [ZCpages, setZCPages] = useState<number>(1);
  const [notification, setNotification] = useState<any[]>();
  const [policyData, setPolicyData] = useState<any>();

  // 校内通知
  const getAnnoceData = async () => {
    const res = await getXXTZGG({
      ZT: ['已发布'],
      XXJBSJId: currentUser?.xxId,
      LX: ['0'],
      page: 0,
      pageSize: 0,
    });
    if (res.status === 'ok') {
      if (!(res.data?.rows?.length === 0)) {
        setNotification(res.data?.rows);
      }
    } else {
      enHenceMsg(res.message);
    }
  };
  // 政策公告
  const getPolicyData = async () => {
    const resgetXXTZGG = await getJYJGTZGG({
      BT: '',
      LX: 1,
      ZT: ['已发布'],
      XZQHM: currentUser?.XZQHM,
      page: 1,
      pageSize: 3,
    });
    if (resgetXXTZGG.status === 'ok') {
      setPolicyData(resgetXXTZGG.data?.rows);
    }
  };
  useEffect(() => {
    getAnnoceData();
    getPolicyData();
  }, [currentUser]);
  useEffect(() => {
    if (notification && notification.length) {
      const data: ListItem[] = [];
      for (let i = 0; i < notification.length; i += 1) {
        const listdata: ListItem = {
          title: notification[i].BT,
          link: `/teacher/home/notice/announcement?listid=${notification[i].id}&index=true&type=xntz`,
          titleRight: {
            text: moment(notification[i].RQ).format('YYYY-MM-DD'),
          },
        };
        if (i >= (pages - 1) * 10 && i < pages * 10) {
          data.push(listdata);
        }
      }
      const newData = { ...defaultList };
      newData.list = data;
      setAnnoceList(newData);
    }
    if (policyData && policyData.length) {
      const data: ListItem[] = [];
      for (let i = 0; i < policyData.length; i += 1) {
        const listdata: ListItem = {
          title: policyData[i].BT,
          link: `/teacher/home/notice/announcement?listid=${policyData[i].id}&index=true&type=zcgg&ly=${policyData[i].JYJGSJ.BMMC}`,
          titleRight: {
            text: moment(policyData[i].RQ).format('YYYY-MM-DD'),
          },
        };
        if (i >= (ZCpages - 1) * 10 && i < ZCpages * 10) {
          data.push(listdata);
        }
      }
      const newData = { ...defaultList };
      newData.list = data;
      setZCDataList(newData);
    }
  }, [policyData, notification, pages, ZCpages]);

  return (
    <MobileCon>
      <div className={styles.gonggao}>
        <GoBack title={'公告'} onclick="/teacher/home?index=index" teacher />
        <Tabs type="card">
          <TabPane tab="校内通知" key="xntz">
            {notification && notification.length ? (
              <div className={styles.NoticeBox}>
                <ListComp listData={annoceList} />
                <Pagina total={notification.length} setPages={setPages} />
              </div>
            ) : (
              <Nodata imgSrc={noData} desc="暂无公告" />
            )}
          </TabPane>
          <TabPane tab="政策公告" key="zcgg">
            {policyData && policyData.length ? (
              <div className={styles.NoticeBox}>
                <ListComp listData={ZCDataList} />
                <Pagina total={policyData.length} setPages={setZCPages} />
              </div>
            ) : (
              <Nodata imgSrc={noData} desc="暂无公告" />
            )}
          </TabPane>
        </Tabs>
      </div>
    </MobileCon>
  );
};

export default Notice;
