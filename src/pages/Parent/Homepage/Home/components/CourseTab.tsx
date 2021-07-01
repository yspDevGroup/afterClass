/* eslint-disable no-param-reassign */
import React, { useContext } from 'react';
import { Tabs } from 'antd';
import styles from '../index.less';
import myContext from '@/utils/MyContext';
import ListComponent from '@/components/ListComponent';
import { Link } from 'umi';
import noData from '@/assets/noData.png';

const { TabPane } = Tabs;
const CourseTab = () => {
  // 获取首页数据
  const { courseStatus, kskc, yxkc } = useContext(myContext);
  const centered = false;
  return (
    <div className={`${styles.tabHeader}`}>
      <Tabs centered={centered} tabBarExtraContent={!centered ? { right: <Link to='/parent/home/course'>全部 {'>'}</Link> } : ''} className={styles.courseTab}>
        {(courseStatus === 'enroll' || courseStatus === 'enrolling') ?
          <TabPane tab="开设课程" key="setup">
            <Tabs className={styles.courseType}>
              {
                kskc?.map((item: any, index: number) => {
                  if (kskc.length > 0) {
                    if (index < 3) {
                      item.xx = item.KHKCSJs.map((record: any) => {
                        if (item.KHKCSJs.length > 0) {
                          record.yy = {
                            type: 'picList',
                            cls: 'picList',
                            list: [
                              {
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
                              },
                            ]
                          }
                          return <ListComponent listData={record.yy} />
                        }
                        return <div style={{ textAlign: 'center', background: "#eee", borderRadius: '8px', paddingBottom: '10px', width: '100%' }}>
                          <img src={noData} alt="暂无数据" />
                        </div>
                      })
                      return (<TabPane tab={item.KCLX} key={index}>
                        {item.xx}
                      </TabPane>)
                    }
                    return ''
                  }
                  return <div style={{ textAlign: 'center', background: "#eee", borderRadius: '8px', paddingBottom: '10px', width: '100%' }}>
                    <img src={noData} alt="暂无数据" />
                  </div>
                })
              }
            </Tabs>
          </TabPane> : ''}
        <TabPane tab="已选课程" key="elective">
          {
            yxkc?.map((item: any, index: number) => {
              if (yxkc.length > 0) {
                if (index < 3) {
                  item.yy = {
                    type: 'picList',
                    cls: 'picList',
                    list: [
                      {
                        id: item.id,
                        title: item.KHKCSJ.KCMC,
                        img: item.KCTP ? item.KCTP : item.KHKCSJ.KCTP,
                        link: `/parent/home/courseDetails?classid=${item.id}&courseid=${item.KHKCSJ.id}`,
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
                }
                return ''
              }
              return <div style={{ textAlign: 'center', background: "#eee", borderRadius: '8px', paddingBottom: '10px', width: '100%' }}>
                <img src={noData} alt="暂无数据" />
              </div>
            })
          }
        </TabPane>
      </Tabs>
    </div>);
};

export default CourseTab;
