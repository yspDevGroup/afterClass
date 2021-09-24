import React from 'react';
import { Tabs } from 'antd';
import Calendar from '@/components/Calendar';
import { customConfig1, customConfig2,customConfig3} from './CalendarConfig';
import { CalendarData } from './CalendarData';

const { TabPane } = Tabs;

const CalendarDemo = () => {
  const handleClick = (type: string, value?: string) => {
    console.log('点击事件-----', type);
    console.log('传递参数-----', value);
  };
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="校历" key="1">
        <Calendar config={customConfig1} data={CalendarData} handleEvents={handleClick} />
      </TabPane>
      <TabPane tab="日程" key="2">
        <Calendar config={customConfig2} data={CalendarData} handleEvents={handleClick} />
      </TabPane>
      <TabPane tab="日程+事件" key="3">
        <Calendar config={customConfig3} data={CalendarData} handleEvents={handleClick} />
      </TabPane>
    </Tabs>

  );
};

export default CalendarDemo;
