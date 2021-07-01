/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-09 10:30:23
 * @,@LastEditTime: ,: 2021-07-01 14:48:41
 * @,@LastEditors: ,: Please set LastEditors
 */

import React, { useEffect, useState } from 'react';
import styles from "./index.less";
import Pagina from '../../components/Pagination/Pagination';
import { Tabs } from 'antd';
import ListComponent from '@/components/ListComponent';
import { useModel } from 'umi';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { homePageInfo } from '@/services/after-class/user';
import noData from '@/assets/noData.png';


const Course = () => {
  const { TabPane } = Tabs;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [yxkc, setYxkc] = useState<any>();
  const [kskc, setKskc] = useState<any>()
  useEffect(() => {
    async function fetchData() {
      // 获取后台学年学期数据
      const result = await queryXNXQList();
      const { XN, XQ } = result.current;
      const res = await homePageInfo({
        xn: XN,
        xq: XQ,
        XSId: currentUser?.userId || currentUser?.id,
        njId: '1'
      });
      if (res.status === 'ok' && res.data) {
        setYxkc(res.data.yxkc);
        setKskc(res.data.kskc);
      }
    }
    fetchData();
  }, [])


  return (
    <div className={styles.CourseBox}>
      <div className={`${styles.tabHeader}`}>
        <Tabs className={styles.courseTab} centered={true}>
          <TabPane tab="开设课程" key="setup">
            <Tabs className={styles.courseType}>
              {
                kskc?.map((item: any, index: number) => {
                  if (kskc.length > 0) {
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
                      return <div style={{ textAlign: 'center', background: "#eee", borderRadius: '8px', paddingBottom: '10px' }}>
                        <img src={noData} alt="暂无数据" />
                      </div>
                    })
                    return (<TabPane tab={item.KCLX} key={index}>
                      {item.xx}
                    </TabPane>)
                  }
                  return <div style={{ textAlign: 'center', background: "#eee", borderRadius: '8px', paddingBottom: '10px' }}>
                    <img src={noData} alt="暂无数据" />
                  </div>
                })
              }
            </Tabs>
          </TabPane>
          <TabPane tab="已选课程" key="elective">
            {
              yxkc?.map((item: any) => {
                if (yxkc.length > 0) {
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
                return <div style={{ textAlign: 'center', background: "#eee", borderRadius: '8px', paddingBottom: '10px' }}>
                  <img src={noData} alt="暂无数据" />
                </div>
              })
            }
          </TabPane>
        </Tabs>
      </div>


      <Pagina total={5} />
    </div>
  )
}

export default Course
