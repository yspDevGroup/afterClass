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
import { getStudent } from '@/services/after-class/khxxzzfw';
import { getKHFWBJ, getStudentListByBjid } from '@/services/after-class/khfwbj';

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
const CourseTab = (props: { dataResource: any }) => {
  const { dataResource } = props;
  // 获取首页数据
  const { courseStatus, kskc, yxkc } = dataResource;
  const [yxkcData, setYxkcData] = useState<ListData>(defaultMsg);
  const [yxkcAllData, setYxkcAllData] = useState<ListData>(defaultMsg);
  const [yxfwData, setYxfwData] = useState<ListData>(defaultMsg);
  const centered = false;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [keys, setKeys] = useState('yxkcs');
  const [YxserviceData, setYxserviceData] = useState<any>();
  const StorageBjId = localStorage.getItem('studentBJId') || currentUser?.student?.[0].BJSJId || testStudentBJId;
  // 获取报名的课后服务
  const [BaoMinData, setBaoMinData] = useState<any>();
  const StorageXSId = localStorage.getItem('studentId');
  const [KHFWDatas, setKHFWDatas] = useState<ListData>(defaultMsgs);
  const [KHFWAllDatas, setKHFWAllDatas] = useState<ListData>(defaultMsgs);
  useEffect(() => {
    (async () => {
      const res = await getStudent({
        XSJBSJId: StorageXSId || currentUser?.student?.[0].XSJBSJId || testStudentId,
        ZT: [0, 1],
      });
      if (res.status === 'ok') {
        setYxserviceData(res.data?.rows);
      }
    })();
  }, [StorageXSId]);

  useEffect(() => {
    if (YxserviceData) {
      const listData: any = [].map.call(YxserviceData, (record: any) => {
        const nodeData: ListItem = {
          id: record.KHXXZZFWId,
          title: record.KHXXZZFW.FWMC,
          img: record.KHXXZZFW?.FWTP,
          link: `/parent/home/serviceReservation/details?type=YX&id=${record?.KHXXZZFW?.id}&path=study`,
          desc: [
            {
              left: [
                `预定时段：${moment(record?.KHXXZZFW?.BMKSSJ).format('YYYY.MM.DD')}~${moment(
                  record?.KHXXZZFW?.BMJSSJ,
                ).format('YYYY.MM.DD')}`,
              ],
            },
            {
              left: [
                `服务时段：${moment(record?.KHXXZZFW?.KSRQ).format('YYYY.MM.DD')}~${moment(
                  record?.KHXXZZFW?.JSRQ,
                ).format('YYYY.MM.DD')}`,
              ],
            },
          ],
          // introduction: record.KHKCSJ.KCMS,
        };
        return nodeData;
      });
      const { list, ...rest } = { ...defaultMsg };
      setYxfwData({
        list: listData.slice(0, 3),
        ...rest,
      });
    }
  }, [YxserviceData]);
  useEffect(() => {
    if (yxkc) {
      const listData: any = [];
      const listDatas: any = [];
      yxkc.forEach((record: any) => {
        if (record?.ISFW === 0) {
          const nodeData: ListItem = {
            id: record.id,
            title: ` ${record.KHKCSJ.KCMC}【${record.BJMC}】`,
            img: record.KCTP ? record.KCTP : record.KHKCSJ.KCTP,
            link: `/parent/home/courseTable?classid=${record.id}&path=study`,
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
            fkzt: record.KHXSBJs?.[0]?.ZT,
            introduction: record.KHKCSJ.KCMS,
          };
          listData.push(nodeData)
          const nodeDatas: ListItem = {
            id: record.id,
            title: ` ${record.KHKCSJ.KCMC}【${record.BJMC}】`,
            img: record.KCTP ? record.KCTP : record.KHKCSJ.KCTP,
            link: `/parent/home/courseTable?classid=${record.id}`,
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
            fkzt: record.KHXSBJs?.[0]?.ZT,
            introduction: record.KHKCSJ.KCMS,
          };
          listDatas.push(nodeDatas)
        }
      })
      const { list, ...rest } = { ...defaultMsg };
      setYxkcAllData(listDatas);
      setYxkcData({
        list: listData.slice(0, 3),
        ...rest,
      });
    }
  }, [yxkc]);
  useEffect(() => {
    if (BaoMinData) {
      const NewArr = BaoMinData?.[0]?.XSFWBJs?.filter((item: any, index: number) => {
        const temArr: any[] = []
        BaoMinData?.[0]?.XSFWBJs?.forEach((item2: { KHFWSJPZId: any; }) => temArr.push(item2?.KHFWSJPZId))
        return temArr.indexOf(item?.KHFWSJPZId) == index
      })
      const listData: any = [];
      const listDatas: any = [];
      NewArr?.forEach((record: any) => {
        let KcState = '';
        switch (record?.ZT) {
          case 0:
            if (new Date() > new Date(record?.KHFWSJPZ?.JSRQ)) {
              KcState = "已结课";
            } else if (new Date() < new Date(record?.KHFWSJPZ?.KSRQ)) {
              KcState = "未开课";
            } else {
              KcState = "上课中";
            }
            break;
          case 1:
            KcState = "退课中";
            break;
          case 2:
            KcState = "已退课";
            break;
          case 3:
            KcState = "待付款";
            break;
        }
        const nodeData: ListItem = {
          id: record.id,
          title: record.KHFWBJ.FWMC,
          img: record?.KHFWBJ?.FWTP,
          link: `/parent/home/serviceReservation/afterClassDetails?classid=${record.KHFWSJPZId}&path=study`,
          desc: [
            {
              left: [
                `课程状态： ${KcState}`,
              ],
            },
            {
              left: [
                `服务时段： ${moment(record?.KHFWSJPZ.KSRQ).format('YYYY.MM.DD')}- ${moment(record?.KHFWSJPZ.JSRQ).format('YYYY.MM.DD')}`,
              ],
            },
          ],
        };
        listData.push(nodeData)
        const nodeDatas: ListItem = {
          id: record.id,
          title: record.KHFWBJ.FWMC,
          img: record?.KHFWBJ?.FWTP,
          link: `/parent/home/serviceReservation/afterClassDetails?classid=${record.KHFWSJPZId}`,
          desc: [
            {
              left: [
                `课程状态： ${KcState}`,
              ],
            },
            {
              left: [
                `服务时段： ${moment(record?.KHFWSJPZ.KSRQ).format('YYYY.MM.DD')}- ${moment(record?.KHFWSJPZ.JSRQ).format('YYYY.MM.DD')}`,
              ],
            },
          ],
        };
        listDatas.push(nodeDatas)
      })
      const { list, ...rest } = { ...defaultMsg };
      setKHFWAllDatas({
        list: listDatas,
        ...rest,
      });
      setKHFWDatas({
        list: listData.slice(0, 3),
        ...rest,
      });
    }
  }, [BaoMinData]);


  useEffect(() => {
    (
      async () => {
        const res = await getStudentListByBjid({
          BJSJId: StorageBjId,
          XSJBSJId: StorageXSId || currentUser?.student?.[0].XSJBSJId || testStudentId,
          page: 0,
          pageSize: 0
        })
        if (res.status === 'ok') {
          setBaoMinData(res.data.rows)
        }
      }
    )()
  }, [StorageXSId])
  const oncuechange = (key: string) => {
    setKeys(key);
  };

  return (
    <div className={`${styles.tabHeader}`}>
      <Tabs
        centered={centered}
        onTabClick={(key: string) => oncuechange(key)}
        // tabBarExtraContent={
        //   !centered
        //     ? {
        //       right: (
        //         <Link
        //           to={{
        //             pathname: '/parent/home/serviceReservation',
        //             state: { courseStatus, kskc, yxkcAllData, keys },
        //           }}
        //         >
        //           全部 <IconFont type="icon-gengduo" className={styles.gengduo} />
        //         </Link>
        //       ),
        //     }
        //     : ''
        // }
        className={styles.courseTab}
      >
        <TabPane tab="课后服务" key="yxkcs">
          {BaoMinData && BaoMinData?.length ? (
            <ListComponent listData={KHFWDatas} />
          ) : (
            <ListComponent listData={defaultMsg} />
          )}
        </TabPane>
        <TabPane tab="课程服务" key="yxkc">
          {yxkc && yxkc?.length ? (
            <ListComponent listData={yxkcData} />
          ) : (
            <ListComponent listData={defaultMsg} />
          )}
        </TabPane>
        <TabPane tab="增值服务" key="yxfw">
          {YxserviceData && YxserviceData?.length ? (
            <ListComponent listData={yxfwData} />
          ) : (
            <ListComponent listData={defaultMsgs} />
          )}
        </TabPane>
      </Tabs>
      <Link
        to={{
          pathname: '/parent/home/serviceReservation',
          state: { courseStatus, kskc, yxkcAllData, KHFWAllDatas, keys },
        }}
        style={{ textAlign: 'center', display: 'block', color: '#999' }}
      >
        查看更多
      </Link>
    </div >
  );
};

export default CourseTab;
