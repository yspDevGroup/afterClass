/* eslint-disable no-param-reassign */
import React, { useContext, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import styles from '../index.less';
import myContext from '@/utils/MyContext';
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
  noDataImg: noData
};
const CourseTab = () => {
  // 获取首页数据
  const { courseStatus, kskc, yxkc } = useContext(myContext);
  const [yxkcData, setYxkcData] = useState<ListData>(defaultMsg);
  const centered = false;
  const [keys, setKeys] = useState('setup');

  useEffect(() => {
    if (yxkc) {
      const listData: ListItem[] = [].map.call(yxkc, (record: any) => {
        const nodeData: ListItem = {
          id: record.id,
          title: record.KHKCSJ.KCMC,
          img: record.KCTP ? record.KCTP : record.KHKCSJ.KCTP,
          link: `/parent/home/courseDetails?classid=${record.id}&courseid=${record.KHKCSJ.id}&index=all`,
          desc: [
            {
              left: [`课程时段：${record.KKRQ ? moment(record.KKRQ).format('YYYY.MM.DD') : moment(record.KHKCSJ.KKRQ).format('YYYY.MM.DD')}-${record.JKRQ ? moment(record.JKRQ).format('YYYY.MM.DD') : moment(record.KHKCSJ.JKRQ).format('YYYY.MM.DD')}`],
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
      setYxkcData({
        list: listData,
        ...rest,
      });
    }
  }, [yxkc])
  const oncuechange = (key: string) => {
    setKeys(key);
  };

  return (
    <div className={`${styles.tabHeader}`}>
     
      <Tabs centered={centered}
        onTabClick={(key: string) => oncuechange(key)}
        tabBarExtraContent={!centered ?
          {
            right: <Link to={{ pathname: '/parent/home/course', state: { courseStatus: courseStatus, kskc: kskc, yxkc: yxkc, keys: keys } }} >
              全部 <IconFont type="icon-gengduo" className={styles.gengduo} />
            </Link>
          } : ''} className={styles.courseTab}>
        {(courseStatus === 'enroll' || courseStatus === 'enrolling') ?
          <TabPane tab="开设课程" key="setup">
            {
              kskc && kskc.length ? <Tabs className={styles.courseType}>
                {kskc.map((item: any) => {
                  const courseData: ListItem[] = [].map.call(item.KHKCSJs, (record: any, index: number) => {
                    if (index < 3) {
                      const nodeData: ListItem = {
                        id: record.id,
                        title: record.KCMC,
                        img: record.KCTP,
                        link: `/parent/home/courseDetails?courseid=${record.id}`,
                        desc: [
                          {
                            left: [`课程时段：${moment(record.KKRQ).format('YYYY.MM.DD')}-${moment(record.JKRQ).format('YYYY.MM.DD')}`],
                          },
                        ],
                        introduction: record.KCMS,
                      };
                      return nodeData;
                    };
                    return {
                      title: 'null'
                    };
                  });

                  const { list, ...rest } = { ...defaultMsg };
                  return (<TabPane tab={item.KCLX} key={item.KCLX} style={{ margin: '8px 0' }}>
                    <ListComponent listData={{
                      list: courseData.filter((it: ListItem) => it.title !== 'null'),
                      ...rest
                    }} />
                  </TabPane>)
                })
                }
              </Tabs> : <ListComponent listData={defaultMsg} />}
          </TabPane> : ''}
        <TabPane tab="已选课程" key="elective">
          <ListComponent listData={yxkcData} />
        </TabPane>
      </Tabs>
    </div>);
};

export default CourseTab;
