/*
 * @Author: your name
 * @Date: 2021-10-26 08:30:24
 * @LastEditTime: 2021-11-18 11:48:54
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \afterClass\src\pages\Manager\CourseManagements\index.tsx
 */
// import React from 'react';
import { Tabs } from 'antd';
import PageContainer from '@/components/PageContainer';
import CourseList from './courseList';
// import CourseHistory from './courseHistory';
import CourseNotIntroduced from './courseNotIntroduced';

const { TabPane } = Tabs;
/**
 * 课程管理
 * @returns
 */
const index = () => {
  return (
    <PageContainer>
      <Tabs>
        <TabPane tab="本校课程" key="1">
          <CourseList />
        </TabPane>
        <TabPane tab="可选课程" key="2">
          <CourseNotIntroduced />
        </TabPane>
        {/* <TabPane tab="课程历史记录" key="3">
          <CourseHistory />
        </TabPane> */}
      </Tabs>
    </PageContainer>
  );
};

export default index;
