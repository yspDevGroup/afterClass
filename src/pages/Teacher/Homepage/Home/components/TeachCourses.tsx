import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Link } from 'umi';
import { Tabs } from 'antd';
import IconFont from '@/components/CustomIcon';
import ListComponent from '@/components/ListComponent';

import styles from '../index.less';
import noData from '@/assets/noCourses1.png';

const { TabPane } = Tabs;
const TeachCourses = (props: { dataResource: any; }) => {
  const { dataResource } = props;
  const { yxkc } = dataResource;
  const [dataSource, setDataSource] = useState<any>();
  const [allDataSource, setAllDataSource] = useState<any>();
  const getDataList = (data: any) => {
    return [].map.call(data, (item: any) => {
      return {
        id: item.id,
        title: `${item.KHKCSJ.KCMC} - ${item.BJMC}`,
        img: item.KCTP ? item.KCTP : item.KHKCSJ.KCTP,
        link: `/teacher/home/courseIntro?classid=${item.id}`,
        desc: [
          {
            left: [
              `课程时段：${item.KKRQ
                ? moment(item.KKRQ).format('YYYY.MM.DD')
                : moment(item.KHKCSJ.KKRQ).format('YYYY.MM.DD')
              }-${item.JKRQ
                ? moment(item.JKRQ).format('YYYY.MM.DD')
                : moment(item.KHKCSJ.JKRQ).format('YYYY.MM.DD')
              }`,
            ],
          },
          {
            left: [`${item.ISFW === 1 ? '课后服务课程，课时不限':`共${item.KSS}课时`}`],
          },
        ],
        introduction: item.KHKCSJ.KCMS,
      };
    });
  };
  useEffect(() => {
    const newData = {
      type: 'picList',
      cls: 'picList',
      list: yxkc ? getDataList(yxkc).slice(0, 3) : [],
      noDataText: '暂无课程',
      noDataImg: noData,
    };
    setAllDataSource(yxkc ? getDataList(yxkc) : []);
    setDataSource(newData);
  }, [yxkc]);
  return (
    <div className={`${styles.tabHeader}`}>
      <div className={styles.title}>
        <div />
        <span>任教课程班</span>
        <Link to={{ pathname: '/teacher/home/course', state: { allDataSource } }}>
          全部 <IconFont type="icon-gengduo" />
        </Link>
      </div>

      <ListComponent listData={dataSource} />
    </div >
  );
};

export default TeachCourses;
