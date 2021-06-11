import React from 'react';
import { Link } from 'umi';
import { Tabs } from 'antd';
import ListComponent from '@/components/ListComponent';
import { culturedata, artdata, techdata, sportsdata, selecteddata } from '../../listData';
import styles from '../index.less';
import type { ListData } from '@/components/ListComponent/data';

const { TabPane } = Tabs;
const CourseTab = (props: {
  cls?: string;
  centered?: boolean,
  cultureData?: ListData;
  artData?: ListData;
  techData?: ListData;
  sportsData?: ListData;
  selectedData?: ListData;
}) => {
  const {
    cls,
    centered = false,
    cultureData = culturedata,
    artData = artdata,
    techData = techdata,
    sportsData = sportsdata,
    selectedData = selecteddata,
  } = props;
  return <div className={`${styles.tabHeader} ${cls}`}>
    <Tabs centered={centered} tabBarExtraContent={ !centered ? { right: <Link to='/parent/home/course'>全部 {'>'}</Link> } : ''} className={styles.courseTab}>
      <TabPane tab="开设课程" key="setup">
        <Tabs className={styles.courseType}>
          <TabPane tab="文化" key="culture">
            <ListComponent listData={cultureData} />
          </TabPane>
          <TabPane tab="艺术" key="art">
            <ListComponent listData={artData} />
          </TabPane>
          <TabPane tab="科技" key="tech">
            <ListComponent listData={techData} />
          </TabPane>
          <TabPane tab="体育" key="sports">
            <ListComponent listData={sportsData} />
          </TabPane>
        </Tabs>
      </TabPane>
      <TabPane tab="已选课程" key="elective">
        <ListComponent listData={selectedData} />
      </TabPane>
    </Tabs>
  </div>;
};

export default CourseTab;
