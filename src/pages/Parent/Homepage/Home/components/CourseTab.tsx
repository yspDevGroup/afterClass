/* eslint-disable no-param-reassign */
import React, { useContext } from 'react';
import { Tabs } from 'antd';
import styles from '../index.less';
import myContext from '@/utils/MyContext';
import ListComponent from '@/components/ListComponent';
import { Link } from 'umi';
import noData from '@/assets/noData.png';
import type { ListData, ListItem } from '@/components/ListComponent/data';

const { TabPane } = Tabs;
const defaultMsg: ListData = {
  type: 'picList',
  cls: 'picList',
  list: []
};
const CourseTab = () => {
  // 获取首页数据
  const { courseStatus, kskc, yxkc } = useContext(myContext);
  const centered = false;

  return (
    <div className={`${styles.tabHeader}`}>
      <Tabs centered={centered} tabBarExtraContent={!centered ? { right: <Link to='/parent/home/course'>全部 {'>'}</Link> } : ''} className={styles.courseTab}>
        {(courseStatus === 'enroll' || courseStatus === 'enrolling') ?
          <TabPane tab="开设课程" key="setup">
            {
              kskc && kskc.length ? <Tabs className={styles.courseType}>
                {kskc.map((item: any) => {
                  const listData: ListItem[] = [].map.call(item.KHKCSJs, (record: any) => {
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
                  })
                  defaultMsg.list = listData;
                  return (<TabPane tab={item.KCLX} key={item.KCLX}>
                    <ListComponent listData={defaultMsg} />
                  </TabPane>)
                })
                }
              </Tabs> : <div style={{ textAlign: 'center', background: "#eee", borderRadius: '8px', paddingBottom: '10px', width: '100%' }}>
                <img src={noData} alt="暂无数据" />
                <h4 style={{ color: '#999' }}>暂无开设课程</h4>
              </div>}
          </TabPane> : ''}
        <TabPane tab="已选课程" key="elective">
          {yxkc && yxkc.length ?
            yxkc.map((item: any) => {
              const listData: ListItem[] = [].map.call(item.KHKCSJs, (record: any) => {
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
              defaultMsg.list = listData;
              return <ListComponent listData={defaultMsg} />
            })
            :
            <div style={{ textAlign: 'center', background: "#eee", borderRadius: '8px', paddingBottom: '10px', width: '100%' }}>
              <img src={noData} alt="暂无数据" />
              <h4 style={{ color: '#999' }}>暂无已选课程</h4>
            </div>}
        </TabPane>
      </Tabs>
    </div>);
};

export default CourseTab;
