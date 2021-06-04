import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import RightContent from '@/components/RightContent';
import styles from './index.less';
import { Link } from 'umi';
import type { PageHeaderProps } from 'antd/lib/page-header';

type pageProp = { children?: React.ReactNode; cls?: string };
const PageContain = ({ children, cls }: pageProp) => {
  return (
    <PageContainer
      className={`${styles.customPageHeader} ${cls}`}
      header={{
        title: '',
        breadcrumbRender: (props, defaultDom) => {
          const { breadcrumb, currentMenu } = props as PageHeaderProps & {currentMenu: any};
          console.log(props);

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
