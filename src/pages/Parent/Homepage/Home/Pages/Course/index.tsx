import React, { useEffect, useState } from 'react';
import styles from "./index.less";
import { Tabs } from 'antd';
import ListComponent from '@/components/ListComponent';
import noData from '@/assets/noCourses.png';
import type { ListData, ListItem } from '@/components/ListComponent/data';
import Nodata from '@/components/Nodata';
import moment from 'moment';


const defaultMsg: ListData = {
  type: 'picList',
  cls: 'picList',
  list: []
};

const Course = (props: any) => {
  const { TabPane } = Tabs;
  const { yxkc,kskc,courseStatus } = props.location.state;
  const [yxkcData, setYxkcData] = useState<ListData>(defaultMsg);

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
              left: [`课程时段：${record.KKRQ ?moment(record.KKRQ).format('YYYY.MM.DD'): moment(record.KHKCSJ.KKRQ).format('YYYY.MM.DD')}-${record.JKRQ ? moment(record.JKRQ).format('YYYY.MM.DD'): moment(record.KHKCSJ.JKRQ).format('YYYY.MM.DD')}`],
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
                  return (<TabPane tab={item.KCLX} key={item.KCLX} style={{margin:'8px 0'}}>
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
