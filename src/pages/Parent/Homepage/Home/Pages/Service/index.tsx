/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Tabs } from 'antd';
import noPic from '@/assets/noPic.png';
import noOrder from '@/assets/noOrder.png';
import GoBack from '@/components/GoBack';
import { getKHZZFW } from '@/services/after-class/khzzfw';
import { Link, useModel } from 'umi';
import { getKHXXZZFW, getStudent } from '@/services/after-class/khxxzzfw';
import { queryXNXQList } from '@/services/local-services/xnxq';
import moment from 'moment';


const { TabPane } = Tabs;
const ServiceReservation = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [LBData, setLBData] = useState<any>([]);
  const [DataSource, setDataSource] = useState<any>();
  const [state, setstate] = useState('yxfw');
  const [YxserviceData, setYxserviceData] = useState<any>()

  useEffect(() => {
    (
      async () => {
        const res = await queryXNXQList(currentUser?.xxId);
        const result = await getKHZZFW({
          XXJBSJId: currentUser?.xxId,
          FWMC: '',
          FWZT: 1,
          page: 0,
          pageSize: 0
        })
        if (result.status === 'ok') {
          setLBData(result!.data!.rows!)
          if (res.current) {
            const resGetKHXXZZFW = await getKHXXZZFW({
              XXJBSJId: currentUser?.xxId,
              XNXQId: res?.current?.id || '',
              FWZT: 1,
              KHZZFWId: result!.data!.rows![0].id
            })
            if (resGetKHXXZZFW.status === 'ok') {
              const NewData = resGetKHXXZZFW?.data?.rows?.filter((value: any) => {
                return new Date(value?.BMJSSJ).getTime() > new Date().getTime()
              })
              setDataSource(NewData)
            }
          }
        }
      }
    )()
    setstate('yxfu')
  }, []);
  const callback = async (key: any) => {
    const res = await queryXNXQList(currentUser?.xxId);
    if (res.current) {
      const result = await getKHXXZZFW({
        XXJBSJId: currentUser?.xxId,
        XNXQId: res?.current?.id || '',
        FWZT: 1,
        KHZZFWId: key
      })
      if (result.status === 'ok') {
        const NewData = result?.data?.rows?.filter((value: any) => {
          const Time = new Date(value?.BMJSSJ).getTime() + 86400000;
          return Time > new Date().getTime()
        })
        setDataSource(NewData)
      }
    }
  }
  useEffect(() => {
    (
      async () => {
        const res = await getStudent({
          XSId: currentUser?.student?.student_userid || '20210901',
        })
        if (res.status === 'ok') {
          setYxserviceData(res.data?.rows)
        }
      }
    )()
  }, []);
  const onchange = (key: any) => {
    setstate(key)
  }
  return (
    <div className={styles.ServiceReservation}>
      <GoBack title={'服务'} onclick="/parent/home?index=index" />
      <Tabs type="card"
        activeKey={state}
        onChange={onchange}
      >
        <TabPane tab="已选服务" key="yxfu">
          <>
            {
              YxserviceData?.length === 0 ?
                <div className={styles.Selected}>
                  <div className={styles.noOrder}>
                    <div>
                      <p>您当前未选择任何服务</p>
                      <a onClick={() => {
                        setstate('ksfw')
                      }}>开始选择</a>
                    </div>
                    <img src={noOrder} alt="" />
                  </div>
                </div> :
                <div className={styles.Selected}>
                  <div className={styles.wrap}>
                    {
                      YxserviceData?.map((item: any) => {
                        const hrefs = `/parent/home/serviceReservation/details?type=YX&id=${item?.KHXXZZFW?.id}`;
                        return <Link to={hrefs} key={item?.KHXXZZFW?.id}> <div className={styles.box} >
                          <div> <img src={item?.KHXXZZFW?.FWTP || noPic} style={{ width: item?.KHXXZZFW?.FWTP ? '110px' : '70px' }} alt="" /></div>
                          <div>
                            <p className={styles.title}> {item?.KHXXZZFW?.FWMC} </p>
                            <p>预定时段：{moment(item?.KHXXZZFW?.BMKSSJ).format('YYYY.MM.DD')}~{moment(item?.KHXXZZFW?.BMJSSJ).format('YYYY.MM.DD')}</p>
                            <p>服务时段：{moment(item?.KSRQ).format('YYYY.MM.DD')}~{moment(item?.JSRQ).format('YYYY.MM.DD')}</p>
                          </div>
                        </div>
                        </Link>
                      })
                    }
                  </div>
                </div>
            }</>
        </TabPane>
        <TabPane tab="开设服务" key="ksfw">
          <div className={styles.category}>
            {
               LBData?.length === 0 ? <div className={styles.Selected}>
                <div className={styles.noOrder}>
                  <div>
                    <p>当前暂未开设服务</p>
                  </div>
                  <img src={noOrder} alt="" />
                </div>
              </div> :
                <Tabs type="card" onChange={callback}
                >
                  <>
                  {
                    LBData?.map((value: any) => {
                      return <TabPane tab={value.FWMC} key={value?.id}>
                        <div className={styles.wrap}>
                          {
                            DataSource && DataSource?.map((item: any) => {
                              const hrefs = `/parent/home/service/details?type=KS&id=${item.id}`;
                              return <><Link to={hrefs} key={item?.id}> <div className={styles.box} >
                                <div> <img src={item?.FWTP || noPic} style={{ width: item?.FWTP ? '110px' : '70px' }} alt="" /></div>
                                <div>
                                  <p className={styles.title}> {item?.FWMC} </p>
                                  <p>预定时段：{moment(item?.BMKSSJ).format('YYYY.MM.DD')}~{moment(item?.BMJSSJ).format('YYYY.MM.DD')}</p>
                                  <p>服务时段：{moment(item?.KSRQ).format('YYYY.MM.DD')}~{moment(item?.JSRQ).format('YYYY.MM.DD')}</p>
                                </div>
                              </div>
                              </Link>
                              </>
                            })
                          }
                        </div>
                      </TabPane>
                    })
                  }
                   </>
                </Tabs>

            }
          </div>
        </TabPane>

      </Tabs>
    </div>
  );
};

export default ServiceReservation;
