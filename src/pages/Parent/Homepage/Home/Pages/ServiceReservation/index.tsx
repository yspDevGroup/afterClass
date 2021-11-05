/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Tabs } from 'antd';
import noPic from '@/assets/noPic.png';
import GoBack from '@/components/GoBack';
import { Link, useModel } from 'umi';
import { getStudent } from '@/services/after-class/khxxzzfw';
import moment from 'moment';
import ListComponent from '@/components/ListComponent';
import noData from '@/assets/noCourses.png';
import type { ListData } from '@/components/ListComponent/data';

const defaultMsg: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [],
  noDataText: '暂无课程',
  noDataImg: noData,
};
const defaultMsgs: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [],
  noDataText: '暂无服务',
  noDataImg: noData,
};

const { TabPane } = Tabs;
const ServiceReservation = (props: any) => {
  const { yxkcAllData, keys} = props.location.state;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [YxserviceData, setYxserviceData] = useState<any>();
  const [yxkcData, setYxkcData] = useState<ListData>(defaultMsg);

  useEffect(() => {
    if (yxkcAllData?.length) {
      const newData = { ...defaultMsg };
      yxkcAllData?.forEach((item: any) => {
        // eslint-disable-next-line no-param-reassign
        item.link += '&index=all';
      });
      newData.list = yxkcAllData;
      setYxkcData(newData);
    }
  }, [yxkcAllData]);

  const StorageXSId = localStorage.getItem('studentId');
  useEffect(() => {
    (async () => {
      const res = await getStudent({
        XSJBSJId: StorageXSId || currentUser?.student?.[0].XSJBSJId || testStudentId,
      });
      if (res.status === 'ok') {
        setYxserviceData(res.data?.rows);
      }
    })();
  }, [StorageXSId]);
  return (
    <div className={styles.ServiceReservation}>
      <GoBack title={'我的服务'} onclick="/parent/home?index=index" />
      <Tabs type="card" defaultActiveKey={keys}>
        <TabPane tab="已选课程" key="yxkc">
          {yxkcAllData && yxkcAllData.length ? (
            <ListComponent listData={yxkcData} />
          ) : (
            <ListComponent listData={defaultMsg} />
          )}
        </TabPane>
        <TabPane tab="已选服务" key="yxfw">
          <>
            {YxserviceData && YxserviceData?.length === 0 ? (
              <ListComponent listData={defaultMsgs} />
            ) : (
              <div className={styles.Selected}>
                <div className={styles.wrap}>
                  {YxserviceData &&
                    YxserviceData?.map((item: any) => {
                      const hrefs = `/parent/home/serviceReservation/details?type=YX&id=${item?.KHXXZZFW?.id}`;
                      return (
                        <Link to={hrefs} key={item?.KHXXZZFW?.id}>
                          {' '}
                          <div className={styles.box}>
                            <div>
                              {' '}
                              <img
                                src={item?.KHXXZZFW?.FWTP || noPic}
                                style={{ width: item?.KHXXZZFW?.FWTP ? '110px' : '70px' }}
                                alt=""
                              />
                            </div>
                            <div>
                              <p className={styles.title}> {item?.KHXXZZFW?.FWMC} </p>
                              <p>
                                预定时段：{moment(item?.KHXXZZFW?.BMKSSJ).format('YYYY.MM.DD')}~
                                {moment(item?.KHXXZZFW?.BMJSSJ).format('YYYY.MM.DD')}
                              </p>
                              <p>
                                服务时段：{moment(item?.KSRQ).format('YYYY.MM.DD')}~
                                {moment(item?.JSRQ).format('YYYY.MM.DD')}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              </div>
            )}
          </>
        </TabPane>

      </Tabs>
    </div>
  );
};

export default ServiceReservation;
