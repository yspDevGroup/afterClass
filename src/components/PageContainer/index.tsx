import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import RightContent from '@/components/RightContent';
import styles from './index.less';

type pageProp = { children?: React.ReactNode; cls?: string };
const PageContain = ({ children, cls }: pageProp) => {
  return (
    <PageContainer
      className={`${styles.customPageHeader} ${cls}`}
      header={{
        title: '',
        extra: <RightContent />,
      }}
      fixedHeader
    >
      {children}
    </PageContainer>
  );
};

export default PageContain;
