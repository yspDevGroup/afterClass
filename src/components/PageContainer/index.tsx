import React, { useCallback } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import RightContent from '@/components/RightContent';
import styles from './index.less';
import { Link } from 'umi';
import type { PageHeaderProps } from 'antd/lib/page-header';

type pageProp = { children?: React.ReactNode; cls?: string };
const PageContain = ({ children, cls }: pageProp) => {
    // 获取当前页面大小的方法
   const getWidHei=()=>{
    let width; let height;
    if(window.innerWidth){
        width = window.innerWidth;
        height = window.innerHeight;
    }else if(document.compatMode === "BackCompat"){
        width = document.body.clientWidth;
        height = document.body.clientHeight;
    }else{
        width = document.documentElement.clientWidth;
        height = document.documentElement.clientHeight;
    }
    return {
        width,
        height
    }
}
const {width} = getWidHei();
const xx=1;
useCallback(
  () => {
      if(width<1200){
        alert('当前窗口尺寸过小，无法展示全部内容，请将窗口调至最大')
      }
  },
  [xx],
)
  return (
    <PageContainer
      style={{minWidth:'990px'}}
      className={`${styles.customPageHeader} ${cls}`}
      header={{
        title: '',
        breadcrumbRender: (props, defaultDom) => {
          const { breadcrumb, currentMenu } = props as PageHeaderProps & {currentMenu: any};
          if (breadcrumb?.routes === undefined && currentMenu.name !== '首页') {
            return <div className="ant-breadcrumb">
              <span>
                <span className="ant-breadcrumb-link">
                  <Link to={currentMenu.path}>
                    {currentMenu.name}
                  </Link>
                </span>
              </span>
            </div>
          }
          return <>{defaultDom}</>
        },
        extra: <RightContent />,
      }}
      fixedHeader
    >
      {children}
    </PageContainer>
  );
};

export default PageContain;
