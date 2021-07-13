import React, { useEffect, useState } from 'react';
import type { ListData } from "@/components/ListComponent/data";
import styles from "./index.less";
import ListComponent from '@/components/ListComponent';
import Nodata from '@/components/Nodata';
import noDataImg from '@/assets/noCourses1.png';

const defaultMsg: ListData = {
  type: 'picList',
  cls: 'picList',
  list: []
};
const Course = (props: any) => {
  const { allDataSource } = props.location.state;
  const [yxkcData, setYxkcData] = useState<ListData>(defaultMsg);
  useEffect(() => {
    if (allDataSource) {
      const { list, ...rest } = { ...defaultMsg };
      setYxkcData({
        list: allDataSource,
        ...rest,
      });
    }
  }, [allDataSource])
  return (
    <div className={styles.CourseBox}>
      <div className={styles.header}>
        <h3 className={styles.title}>任教课程</h3>
      </div>
      {allDataSource && allDataSource.length ? <ListComponent listData={yxkcData} /> :
        <Nodata imgSrc={noDataImg} desc='暂无课程' />}
    </div>
  )
}

export default Course
