import PageContainer from '@/components/PageContainer';
import { LeftOutlined } from '@ant-design/icons';
import { useEffect, useState,useContext } from 'react';
import { Button,Modal ,Tabs} from 'antd';
// import type { TermItem } from '../../../BasicalSettings/TermManagement/data';
import  TabList from './compoents/TabList'
import { history} from 'umi';

const { TabPane } = Tabs;

const Detail = (props: any) => {
 const { state } = props.location;
 return (
    <div>
      <PageContainer>
        <Button 
          type="primary"
          onClick={() => {
            history.go(-1);
          }}
          style={{
            marginBottom: '24px',
          }}
        >
          <LeftOutlined />
          返回上一页
        </Button>
            <Tabs>
                <TabPane tab="学生评价" key="1">
                 <TabList ListData={{ListName:'学生评价',ListState:state.data}}></TabList>
                </TabPane>
                <TabPane tab="课程反馈" key="2">
                 <TabList ListData={{ListName:'课程反馈',ListState:state.data}}></TabList>
                </TabPane>
            </Tabs>
   
       
      </PageContainer>
    </div>
  );
};
export default Detail;
