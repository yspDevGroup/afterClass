import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Tabs } from 'antd';
import ListComponent from '@/components/ListComponent';
import type { ListData } from '@/components/ListComponent/data';
import GoBack from '@/components/GoBack';
import noData from '@/assets/noCourses.png';
import MobileCon from '@/components/MobileCon';

const defaultMsg: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [],
  noDataText: '暂无课程',
  noDataImg: noData,
};
const Course = (props: any) => {
  const { TabPane } = Tabs;
  const { yxkcAllData, kskc } = props.location.state.totalData;
  const [KSKCData, setKSKCData] = useState([]);

  useEffect(() => {
    if (yxkcAllData?.length) {
      const newData = { ...defaultMsg };
      yxkcAllData?.forEach((item: any) => {
        // eslint-disable-next-line no-param-reassign
        item.link += '&index=all';
      });
      newData.list = yxkcAllData;
    }
  }, [yxkcAllData]);
  useEffect(() => {
    const newArr = kskc?.filter((value: any) => {
      return value?.KHKCSJs?.length !== 0;
    });
    setKSKCData(newArr);
  }, [kskc]);
  return (
    <MobileCon>
      <div className={styles.CourseBox}>
        <GoBack title={'缤纷课堂'} onclick="/parent/home?index=index" />
        <div className={`${styles.tabHeader}`}>
          <>
            {KSKCData?.length === 0 || !KSKCData ? (
              <ListComponent listData={defaultMsg} />
            ) : (
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
                          left: [record.KCMS ? `简介：${record.KCMS}` : ''],
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
            )}
          </>
        </div>
      </div>
    </MobileCon>
  );
};

export default Course;
