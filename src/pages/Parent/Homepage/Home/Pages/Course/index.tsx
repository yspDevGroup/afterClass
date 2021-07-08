/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-09 10:30:23
 * @,@LastEditTime: ,: 2021-07-08 15:38:51
 * @,@LastEditors: ,: Please set LastEditors
 */

import React, { useEffect, useState } from 'react';
import styles from "./index.less";
import { Tabs } from 'antd';
import ListComponent from '@/components/ListComponent';
import { useModel } from 'umi';
import { queryXNXQList } from '@/services/local-services/xnxq';
import { homePageInfo } from '@/services/after-class/user';
import noData from '@/assets/noCourses.png';
import type { ListData, ListItem } from '@/components/ListComponent/data';
import { getQueryString } from '@/utils/utils';
import Nodata from '@/components/Nodata';


const defaultMsg: ListData = {
  type: 'picList',
  cls: 'picList',
  list: []
};

const Course = () => {
  const { TabPane } = Tabs;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [yxkc, setYxkc] = useState<any>();
  const [kskc, setKskc] = useState<any>();
  const [yxkcData, setYxkcData] = useState<ListData>(defaultMsg);
  const courseStatus = getQueryString('courseStatus');
  useEffect(() => {
    async function fetchData() {
      // 获取后台学年学期数据
      const result = await queryXNXQList();
      const { XN, XQ } = result.current;
      const res = await homePageInfo({
        xn: XN,
        xq: XQ,
        XSId: currentUser?.UserId || currentUser?.id,
        njId: '1'
      });
      if (res.status === 'ok' && res.data) {
        setYxkc(res.data.yxkc);
        setKskc(res.data.kskc);
      }
    }
    fetchData();
  }, [])
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
      const newData = { ...defaultMsg };
      newData.list = listData;
      setYxkcData(newData);
    }
  }, [yxkc])


  return (
    <div className={styles.CourseBox}>
      <div className={`${styles.tabHeader}`}>
        <Tabs centered={true} className={styles.courseTab}>
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
                  return (<TabPane tab={item.KCLX} key={item.KCLX} style={{marginTop:'5px'}}>
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
            {yxkc && yxkc.length ? <ListComponent listData={yxkcData} /> :
               <Nodata imgSrc={noData} desc='暂无课程' />}
          </TabPane>
        </Tabs>
      </div>

    </div>
  )
}

export default Course
