import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import PageContainer from '@/components/PageContainer';
import ClassScheduling from './ClassScheduling';
import CourseScheduling from './CourseScheduling';
import { getQueryString } from '@/utils/utils';

const { TabPane } = Tabs;

const Index = () => {
  const [key, setKey] = useState<string>('1');
  const [falg, setFalg] = useState<boolean>(true);

  useEffect(() => {
    const bjId = getQueryString('courseId');
    if (bjId !== null) {
      setFalg(false);
      setKey('2');
    }
  }, []);

  return (
    <PageContainer>
      {falg ? (
        <Tabs
          activeKey={key}
          onChange={(value: any) => {
            setKey(value);
          }}
        >
          {
            <TabPane tab="行政班排课" key="1">
              {key === '1' && <ClassScheduling />}
            </TabPane>
          }
          <TabPane tab="课程班排课" key="2">
            {key === '2' && <CourseScheduling />}
          </TabPane>
        </Tabs>
      ) : (
        <CourseScheduling />
      )}
    </PageContainer>
  );
};

export default Index;
