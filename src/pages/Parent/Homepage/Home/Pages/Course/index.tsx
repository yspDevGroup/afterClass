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

const Course = (props: any) => {
  const { TabPane } = Tabs;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { yxkcAllData, kskc, courseStatus, keys } = props.location.state;
  const [yxkcData, setYxkcData] = useState<ListData>(defaultMsg);
  const [DataSource, setDataSource] = useState<any>();
  const [LBData, setLBData] = useState<any>([]);

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
              return new Date(value?.BMJSSJ).getTime() > new Date().getTime()
            });
            setDataSource(NewData);
          }
        }
      }else{
        setLBData([])
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
          return new Date(value?.BMJSSJ).getTime() > new Date().getTime();
        });
        setDataSource(NewData);
      }
    }
  };
  return (
    <div className={styles.CourseBox}>
      <GoBack title={'我要报名'} onclick="/parent/home?index=index" />
      <div className={`${styles.tabHeader}`}>
        <Tabs centered={true} className={styles.courseTab} defaultActiveKey={keys}>
          {courseStatus === 'enroll' || courseStatus === 'enrolling' ? (
            <TabPane tab="开设课程" key="setup">
              {kskc && kskc.length ? (
                <Tabs className={styles.courseType}>
                  {kskc.map((item: any) => {
                    const courseData: any = [].map.call(item.KHKCSJs, (record: any) => {
                      const nodeData: any = {
                        id: record.id,
                        title: record.KCMC,
                        img: record.KCTP,
                        link: `/parent/home/courseDetails?courseid=${record.id}&index=all`,
                        desc: [
                          {
                            left: [
                              `课程时段：${moment(record.KKRQ).format('YYYY.MM.DD')}-${moment(
                                record.JKRQ,
                              ).format('YYYY.MM.DD')}`,
                            ],
                          },
                        ],
                        introduction: record.KCMS,
                      };
                      return nodeData;
                    });
                    const { list, ...rest } = { ...defaultMsg };
                    return (
                      <TabPane tab={item.KCTAG} key={item.KCTAG} style={{ margin: '8px 0' }}>
                        <ListComponent
                          listData={{
                            list: courseData,
                            ...rest,
                          }}
                        />
                      </TabPane>
                    );
                  })}
                </Tabs>
              ) : (
                <ListComponent listData={defaultMsg} />
              )}
            </TabPane>
          ) : (
            ''
          )}
          <TabPane tab="开设服务" key="ksfw">
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
        </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Course;
