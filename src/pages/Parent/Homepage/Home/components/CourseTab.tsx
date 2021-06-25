/* eslint-disable no-param-reassign */
import React, { useContext } from 'react';
import { Tabs } from 'antd';
import styles from '../index.less';
import myContext from '../../myContext';
import ListComponent from '@/components/ListComponent';
import { Link } from 'umi';

const { TabPane } = Tabs;
const CourseTab = () => {
  // 获取首页数据
  const { courseStatus, kskc, yxkc } = useContext(myContext);
  const centered=false;
  return (
    <div className={`${styles.tabHeader}`}>
      <Tabs centered={centered} tabBarExtraContent={!centered ? { right: <Link to='/parent/home/course'>全部 {'>'}</Link> } : ''} className={styles.courseTab}>
        {(courseStatus==='enroll'||courseStatus==='enrolling' )?
          <TabPane tab="开设课程" key="setup">
            <Tabs className={styles.courseType}>
              {
                kskc?.map((item: any, index: number) => {
                  item.xx = item.KHKCSJs.map((record: any) => {
                    record.yy = {
                      type: 'picList',
                      cls: 'picList',
                      list: [
                        {
                          id: record.id,
                          title: record.KCMC,
                          img: record.KCTP,
                          link: `/parent/home/courseDetails?id=${record.id}&type=true`,
                          desc: [
                            {
                              left: [`课程时段：${record.KKRQ}-${record.JKRQ}`],
                            },
                          ],
                          introduction: record.KCMS,
                        },
                      ]
                    }
                    return <ListComponent listData={record.yy} />
                  })
                  return (<TabPane tab={item.KCLX} key={index}>
                    {item.xx}
                  </TabPane>)
                })
              }
            </Tabs>
          </TabPane>:''}
        <TabPane tab="已选课程" key="elective">
          {
            yxkc?.map((item: any) => {
              item.yy = {
                type: 'picList',
                cls: 'picList',
                list: [
                  {
                    id: item.id,
                    title: item.KHKCSJ.KCMC,
                    img: item.KCTP ? item.KCTP : item.KHKCSJ.KCTP,
                    link: `/parent/home/courseDetails?id=${item.KHKCSJ.id}&type=false`,
                    desc: [
                      {
                        left: [`课程时段：${item.KKRQ ? item.KKRQ : item.KHKCSJ.KKRQ}-${item.JKRQ ? item.JKRQ : item.KHKCSJ.JKRQ}`],
                      },
                      {
                        left: [`共${item.KSS}课时`],
                      },
                    ],
                    introduction: item.KHKCSJ.KCMS,
                  },
                ]
              }
              return <ListComponent listData={item.yy} />
            })
          }
        </TabPane>
      </Tabs>
    </div>);
};

export default CourseTab;
