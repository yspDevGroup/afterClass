import React, { useEffect, useState } from 'react';
import type { ListData } from "@/components/ListComponent/data";
import styles from "./index.less";
import ListComponent from '@/components/ListComponent';
import Nodata from '@/components/Nodata';
import noDataImg from '@/assets/noCourses1.png';
import GoBack from '@/components/GoBack';
import { ChangePageTitle } from '@/utils/utils';

const defaultMsg: ListData = {
  type: 'picList',
  cls: 'picList',
  list: []
};
const Course = (props: any) => {
  const { allDataSource } = props.location.state;
  const [yxkcData, setYxkcData] = useState<ListData>(defaultMsg);
  ChangePageTitle(ENV_subTitle);
  useEffect(() => {
    if (allDataSource) {
      const { list, ...rest } = { ...defaultMsg };
      allDataSource.forEach((item: any) => {
        // eslint-disable-next-line no-param-reassign
        item.link += '&index=all';
      });
      setYxkcData({
        list: allDataSource,
        ...rest,
      });
    }
  }, [allDataSource])
  return (
    <>
      <GoBack title={'任教课程'} onclick='/teacher/home?index=index' teacher />
      <div className={styles.CourseBox}>
        {allDataSource && allDataSource.length ? <ListComponent listData={yxkcData} /> :
          <Nodata imgSrc={noDataImg} desc='暂无课程' />}
      </div>
    </>
  )
}

export default Course
