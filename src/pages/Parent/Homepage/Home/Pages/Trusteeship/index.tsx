import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Tabs } from 'antd';
import ListComponent from '@/components/ListComponent';
import type { ListData } from '@/components/ListComponent/data';
import moment from 'moment';
import GoBack from '@/components/GoBack';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getKHXXZZFW } from '@/services/after-class/khxxzzfw';
import { getAllFWByschooId } from '@/services/after-class/khzzfw';
import { Link, useModel } from 'umi';
import noPic from '@/assets/noPic.png';
import noData from '@/assets/noCourses.png';

const defaultMsgs: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [],
  noDataText: '暂无服务',
  noDataImg: noData,
};

const Course = () => {
  const { TabPane } = Tabs;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [DataSource, setDataSource] = useState<any>();
  const [LBData, setLBData] = useState<any>([]);

  useEffect(() => {
    (async () => {
      const res = await queryXNXQList(currentUser?.xxId);
      const result = await getAllFWByschooId({
        XXJBSJId: currentUser?.xxId,
        FWMC: '',
        FWZT: 1,
        page: 0,
        pageSize: 0,
      });
      if (result.status === 'ok' && result.data.rows.length !== 0) {
        setLBData(result!.data!.rows!);
        if (res.current) {
          const resGetKHXXZZFW = await getKHXXZZFW({
            XXJBSJId: currentUser?.xxId,
            XNXQId: res?.current?.id || '',
            FWZT: 1,
            KHZZFWId: result!.data!.rows![0].id,
          });
          if (resGetKHXXZZFW.status === 'ok') {
            const NewData = resGetKHXXZZFW?.data?.rows?.filter((value: any) => {
              const JSSJDate = moment(value?.BMJSSJ).format('YYYY/MM/DD HH:mm:ss');
              return new Date(JSSJDate).getTime() > new Date().getTime();
            });
            setDataSource(NewData);
          }
        }
      } else {
        setLBData([]);
      }
    })();
  }, []);

  const callback = async (key: any) => {
    const res = await queryXNXQList(currentUser?.xxId);
    if (res.current) {
      const result = await getKHXXZZFW({
        XXJBSJId: currentUser?.xxId,
        XNXQId: res?.current?.id || '',
        FWZT: 1,
        KHZZFWId: key,
      });
      if (result.status === 'ok') {
        const NewData = result?.data?.rows?.filter((value: any) => {
          const JSSJDate = moment(value?.BMJSSJ).format('YYYY/MM/DD HH:mm:ss');
          return new Date(JSSJDate).getTime() > new Date().getTime();
        });
        setDataSource(NewData);
      }
    }
  };
  return (
    <div className={styles.CourseBox}>
      <GoBack title={'订餐&托管'} onclick="/parent/home?index=index" />
      <div className={`${styles.tabHeader}`}>
        <div className={styles.category}>
          {LBData && LBData.length === 0 ? (
            <ListComponent listData={defaultMsgs} />
          ) : (
            <Tabs type="card" onChange={callback}>
              {LBData?.map((value: any) => {
                return (
                  <TabPane tab={value.FWMC} key={value?.id}>
                    <div className={styles.wrap}>
                      {DataSource &&
                        DataSource?.map((item: any) => {
                          const hrefs = `/parent/home/serviceReservation/details?type=KS&id=${item.id}`;
                          return (
                            <Link to={hrefs} key={item?.id}>
                              <div className={styles.box}>
                                <div>
                                  <img
                                    src={item?.FWTP || noPic}
                                    style={{ width: item?.FWTP ? '110px' : '70px' }}
                                    alt=""
                                  />
                                </div>
                                <div>
                                  <p className={styles.title}> {item?.FWMC} </p>
                                  <p>
                                    预定时段：{moment(item?.BMKSSJ).format('YYYY.MM.DD')}~
                                    {moment(item?.BMJSSJ).format('YYYY.MM.DD')}
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
                  </TabPane>
                );
              })}
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default Course;
