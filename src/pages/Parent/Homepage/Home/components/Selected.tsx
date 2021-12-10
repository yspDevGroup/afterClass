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
  const [keys, setKeys] = useState('yxkc');
  const [YxserviceData, setYxserviceData] = useState<any>();

  const StorageXSId = localStorage.getItem('studentId');
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
          link: `/parent/home/serviceReservation/details?type=YX&id=${record?.KHXXZZFW?.id}`,
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
      const listData: any = [].map.call(yxkc, (record: any) => {
        const nodeData: ListItem = {
          id: record.id,
          title: ` ${record.KHKCSJ.KCMC}【${record.BJMC}】`,
          img: record.KCTP ? record.KCTP : record.KHKCSJ.KCTP,
          link: `/parent/home/courseIntro?classid=${record.id}`,
          desc: [
            {
              left: [
                `课程时段：${
                  record.KKRQ
                    ? moment(record.KKRQ).format('YYYY.MM.DD')
                    : moment(record.KHKCSJ.KKRQ).format('YYYY.MM.DD')
                }-${
                  record.JKRQ
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

  return (
    <div className={`${styles.tabHeader}`}>
      <Tabs
        centered={centered}
        onTabClick={(key: string) => oncuechange(key)}
        tabBarExtraContent={
          !centered
            ? {
                right: (
                  <Link
                    to={{
                      pathname: '/parent/home/serviceReservation',
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
        <TabPane tab="已选课程" key="yxkc">
          {yxkc && yxkc?.length ? (
            <ListComponent listData={yxkcData} />
          ) : (
            <ListComponent listData={defaultMsg} />
          )}
        </TabPane>
        <TabPane tab="已选服务" key="yxfw">
          {YxserviceData && YxserviceData?.length ? (
            <ListComponent listData={yxfwData} />
          ) : (
            <ListComponent listData={defaultMsgs} />
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CourseTab;
