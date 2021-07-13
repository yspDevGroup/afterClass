import React, { useContext, useEffect, useState } from 'react';
import myContext from '@/utils/MyContext';
import noData from '@/assets/noCourses1.png';
import moment from 'moment';
import styles from '../index.less';
import { Link } from 'umi';
import { Tabs } from 'antd';
import IconFont from '@/components/CustomIcon';
import ListComponent from '@/components/ListComponent';

const { TabPane } = Tabs;
const TeachCourses = () => {
  const { yxkc } = useContext(myContext);
  const [dataSource, setDataSource] = useState<any>();
  const [allDataSource, setAllDataSource] = useState<any>();
  const getDataList = (data: any) => {
    return [].map.call(data, (item: any) => {
      return {
        id: item.id,
        title: item.KHKCSJ.KCMC,
        img: item.KCTP ? item.KCTP : item.KHKCSJ.KCTP,
        link: `/teacher/home/courseDetails?classid=${item.id}&courseid=${item.KHKCSJ.id}`,
        desc: [
          {
            left: [`课程时段：${item.KKRQ ? moment(item.KKRQ).format('YYYY.MM.DD') : moment(item.KHKCSJ.KKRQ).format('YYYY.MM.DD')}-${item.JKRQ ? moment(item.JKRQ).format('YYYY.MM.DD') : moment(item.KHKCSJ.JKRQ).format('YYYY.MM.DD')}`],
          },
          {
            left: [`共${item.KSS}课时`],
          },
        ],
        introduction: item.KHKCSJ.KCMS,
      }
    })
  };
  useEffect(() => {
    const newData = {
      type: 'picList',
      cls: 'picList',
      list: yxkc && getDataList(yxkc).slice(0,3) || [],
      noDataText: '暂无课程',
      noDataImg: noData
    };
    setAllDataSource(getDataList(yxkc));
    setDataSource(newData);
  }, [yxkc])
  return (
    <div className={`${styles.tabHeader}`}>
      <Tabs centered={false}
        tabBarExtraContent={{ right: <Link to={{ pathname: '/teacher/home/course', state: { allDataSource } }} >全部 <IconFont type="icon-gengduo" className={styles.gengduo} /></Link> }}
        className={styles.courseTab}>
        <TabPane tab="任教课程" key="elective">
          <ListComponent listData={dataSource} />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default TeachCourses;


