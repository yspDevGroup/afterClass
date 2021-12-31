import React, { useEffect } from 'react';
import styles from './index.less';
import { Tabs } from 'antd';
import ListComponent from '@/components/ListComponent';
import type { ListData } from '@/components/ListComponent/data';
import GoBack from '@/components/GoBack';
import noData from '@/assets/noCourses.png';

const defaultMsg: ListData = {
  type: 'picList',
  cls: 'picList',
  list: [],
  noDataText: '暂无课程',
  noDataImg: noData,
};
const Course = (props: any) => {
  const { TabPane } = Tabs;
  const { yxkcAllData, kskc, courseStatus } = props.location.state.totalData;
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
    const newArr = kskc.filter((value: any) => {
      return value?.KHKCSJs.length !== 0
    })
    setKSKCData(newArr);
    console.log(newArr, 'newArr')
  }, [kskc])

  return (
    <div className={styles.CourseBox}>
      <GoBack title={'缤纷课堂'} onclick="/parent/home?index=index" />
      <div className={`${styles.tabHeader}`}>
        {courseStatus === 'enroll' || courseStatus === 'enrolling' ? (
          <>
            {KSKCData && KSKCData?.length === 0 ? (
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
                          left: [
                            record.KCMS ? `简介：${record.KCMS}` : "",
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
            )}
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default Course;
