/* eslint-disable no-param-reassign */
import React, { useContext, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import styles from '../index.less';
import myContext from '@/utils/MyContext';
import ListComponent from '@/components/ListComponent';
import { Link } from 'umi';
import type { ListData, ListItem } from '@/components/ListComponent/data';
import IconFont from '@/components/CustomIcon';

const { TabPane } = Tabs;
const defaultMsg: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [],
  noDataText: '暂无课程信息'
};
const CourseTab = () => {
  // 获取首页数据
  const { courseStatus, kskc, yxkc } = useContext(myContext);
  const [yxkcData, setYxkcData] = useState<ListData>(defaultMsg);
  const centered = false;

  useEffect(() => {
    if (yxkc) {
      const listData: ListItem[] = [].map.call(yxkc, (record: any) => {
        const nodeData: ListItem = {
          id: record.id,
          title: record.KHKCSJ.KCMC,
          img: record.KCTP ? record.KCTP : record.KHKCSJ.KCTP,
          link: `/parent/home/courseDetails?classid=${record.id}&courseid=${record.KHKCSJ.id}`,
          desc: [
            {
              left: [`课程时段：${record.KKRQ ? record.KKRQ : record.KHKCSJ.KKRQ}-${record.JKRQ ? record.JKRQ : record.KHKCSJ.JKRQ}`],
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
  const url=`/parent/home/course?courseStatus=${courseStatus}`
  return (
    <div className={`${styles.tabHeader}`}>
      <Tabs centered={centered} tabBarExtraContent={!centered ? { right: <Link to={url}>全部 <IconFont type="icon-gengduo" className={styles.gengduo} /></Link> } : ''} className={styles.courseTab}>
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
                            left: [`课程时段：${record.KKRQ}-${record.JKRQ}`],
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
                  return (<TabPane tab={item.KCLX} key={item.KCLX}>
                    <ListComponent listData={{
                      list:courseData.filter((it: ListItem)=>it.title!=='null'),
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
