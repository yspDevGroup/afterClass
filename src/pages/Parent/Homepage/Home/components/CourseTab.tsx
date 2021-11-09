/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import styles from '../index.less';
import ListComponent from '@/components/ListComponent';
import noData from '@/assets/noCourses.png';
import { Link, useModel } from 'umi';
import type { ListData, ListItem } from '@/components/ListComponent/data';
import IconFont from '@/components/CustomIcon';
import moment from 'moment';
import noPic from '@/assets/noPic.png';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { getAllFWByschooId } from '@/services/after-class/khzzfw';
import { getKHXXZZFW } from '@/services/after-class/khxxzzfw';

const { TabPane } = Tabs;
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
const CourseTab = (props: { dataResource: any; }) => {
  const { dataResource } = props;
  // 获取首页数据
  const { courseStatus, kskc, yxkc } = dataResource;
  const [yxkcData, setYxkcData] = useState<ListData>(defaultMsg);
  const [yxkcAllData, setYxkcAllData] = useState<ListData>(defaultMsg);
  const centered = false;
  const [keys, setKeys] = useState('kskc');
  const [LBData, setLBData] = useState<any>([]);
  const [DataSource, setDataSource] = useState<any>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  useEffect(() => {
    if (yxkc) {
      const listData: any = [].map.call(yxkc, (record: any) => {
        const nodeData: ListItem = {
          id: record.id,
          title: record.KHKCSJ.KCMC,
          img: record.KCTP ? record.KCTP : record.KHKCSJ.KCTP,
          link: `/parent/home/courseIntro?classid=${record.id}`,
          desc: [
            {
              left: [
                `课程时段：${record.KKRQ
                  ? moment(record.KKRQ).format('YYYY.MM.DD')
                  : moment(record.KHKCSJ.KKRQ).format('YYYY.MM.DD')
                }-${record.JKRQ
                  ? moment(record.JKRQ).format('YYYY.MM.DD')
                  : moment(record.KHKCSJ.JKRQ).format('YYYY.MM.DD')
                }`,
              ],
            },
            {
              left: [`共${record.KSS}课时`],
            },
          ],
          introduction: record.KHKCSJ.KCMS,
        };
        return nodeData;
      });
      const { list, ...rest } = { ...defaultMsg };
      setYxkcAllData(listData);
      setYxkcData({
        list: listData.slice(0, 3),
        ...rest,
      });
    }
  }, [yxkc]);
  const oncuechange = (key: string) => {
    setKeys(key);
  };
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
            KHZZFWId: result?.data?.rows?.[0].id,
          });
          if (resGetKHXXZZFW.status === 'ok') {
            const NewData = resGetKHXXZZFW?.data?.rows?.filter((value: any) => {
              const JSSJDate = moment(value?.BMJSSJ).format("YYYY/MM/DD HH:mm:ss")
              return new Date(JSSJDate).getTime() > new Date().getTime()
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
          return new Date(value?.BMJSSJ).getTime() > new Date().getTime();
        });
        setDataSource(NewData);
      }
    }
  };

  return (
    <div className={`${styles.tabHeader}`}>
      {
        courseStatus ? <Tabs
          centered={centered}
          onTabClick={(key: string) => oncuechange(key)}
          defaultActiveKey='kskc'
          tabBarExtraContent={
            !centered
              ? {
                right: (
                  <Link
                    to={{
                      pathname: '/parent/home/course',
                      state: { courseStatus, kskc, yxkcAllData, keys },
                    }}
                  >
                    全部 <IconFont type="icon-gengduo" className={styles.gengduo} />
                  </Link>
                ),
              }
              : ''
          }
          className={styles.courseTab}
        >

          {courseStatus === 'enroll' || courseStatus === 'enrolling' ? (
            <TabPane tab="开设课程" key="kskc">
              {kskc && kskc.length ? (
                <Tabs className={styles.courseType}>
                  {kskc.map((item: any) => {
                    const courseData: any = [].map.call(
                      item.KHKCSJs,
                      (record: any, index: number) => {
                        if (index < 3) {
                          const nodeData: ListItem = {
                            id: record.id,
                            title: record.KCMC,
                            img: record.KCTP,
                            link: `/parent/home/courseDetails?courseid=${record.id}`,
                            desc: [
                              {
                                left: [
                                  record.KCMS ? `简介：${record.KCMS}` : "",

                                ],
                              },
                            ],
                            introduction: record.KCMS,
                          };
                          return nodeData;
                        }
                        return {
                          title: 'null',
                        };
                      },
                    );

                    const { list, ...rest } = { ...defaultMsg };
                    return (
                      <TabPane tab={item.KCTAG} key={item.KCTAG} style={{ margin: '8px 0' }}>
                        <ListComponent
                          listData={{
                            list: courseData.filter((it: ListItem) => it.title !== 'null'),
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
        </Tabs> : <></>
      }
    </div>
  );
};

export default CourseTab;
