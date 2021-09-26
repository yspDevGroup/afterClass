import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Tabs } from 'antd';
import ListComponent from '@/components/ListComponent';
import noData from '@/assets/noCourses.png';
import type { ListData } from '@/components/ListComponent/data';
import Nodata from '@/components/Nodata';
import moment from 'moment';
import GoBack from '@/components/GoBack';

const defaultMsg: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [],
};

const Course = (props: any) => {
  const { TabPane } = Tabs;
  const { yxkcAllData, kskc, courseStatus, keys } = props.location.state;
  const [yxkcData, setYxkcData] = useState<ListData>(defaultMsg);

  useEffect(() => {
    if (yxkcAllData?.length) {
      const newData = { ...defaultMsg };
      yxkcAllData?.forEach((item: any) => {
        // eslint-disable-next-line no-param-reassign
        item.link += '&index=all';
      });
      newData.list = yxkcAllData;
      setYxkcData(newData);
    }
  }, [yxkcAllData]);

  return (
    <div className={styles.CourseBox}>
      <GoBack title={'课程列表'} onclick="/parent/home?index=index" />
      <div className={`${styles.tabHeader}`}>
        <Tabs centered={true} className={styles.courseTab} defaultActiveKey={keys}>
          {courseStatus === 'enroll' || courseStatus === 'enrolling' ? (
            <TabPane tab="开设课程" key="setup">
              {kskc && kskc.length ? (
                <Tabs className={styles.courseType}>
                  {kskc.map((item: any) => {
                    const courseData: any = [].map.call(item.KHKCSJs, (record: any) => {
                      const nodeData: any = {
                        id: record.id,
                        title: record.KCMC,
                        img: record.KCTP,
                        link: `/parent/home/courseDetails?courseid=${record.id}&index=all`,
                        desc: [
                          {
                            left: [
                              `课程时段：${moment(record.KKRQ).format('YYYY.MM.DD')}-${moment(
                                record.JKRQ,
                              ).format('YYYY.MM.DD')}`,
                            ],
                          },
                        ],
                        introduction: record.KCMS,
                      };
                      return nodeData;
                    });
                    const { list, ...rest } = { ...defaultMsg };
                    return (
                      <TabPane tab={item.KCTAG} key={item.KCTAG} style={{ margin: '8px 0' }}>
                        <ListComponent
                          listData={{
                            list: courseData,
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
            {yxkcAllData && yxkcAllData.length ? (
              <ListComponent listData={yxkcData} />
            ) : (
              <Nodata imgSrc={noData} desc="暂无课程" />
            )}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Course;
