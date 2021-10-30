/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import styles from '../index.less';
import ListComponent from '@/components/ListComponent';
import noData from '@/assets/noCourses.png';
import { Link } from 'umi';
import type { ListData, ListItem } from '@/components/ListComponent/data';
import IconFont from '@/components/CustomIcon';
import moment from 'moment';

const { TabPane } = Tabs;
const defaultMsg: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [],
  noDataText: '暂无课程',
  noDataImg: noData,
};
const CourseTab = (props: { dataResource: any; }) => {
  const { dataResource } = props;
  // 获取首页数据
  const { courseStatus, kskc, yxkc } = dataResource;
  const [yxkcData, setYxkcData] = useState<ListData>(defaultMsg);
  const [yxkcAllData, setYxkcAllData] = useState<ListData>(defaultMsg);
  const centered = false;
  const [keys, setKeys] = useState('setup');

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
          <TabPane tab="开设课程" key="setup">
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
                                record.KCMS ? `简介：${record.KCMS}` :"",

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
        <TabPane tab="已选课程" key="elective">
          <ListComponent listData={yxkcData} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CourseTab;
