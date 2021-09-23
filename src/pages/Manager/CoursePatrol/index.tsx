/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-23 10:01:58
 * @LastEditTime: 2021-09-23 10:28:16
 * @LastEditors: Sissle Lynn
 */
import React from 'react';
import { useModel } from 'umi';
import PageContainer from '@/components/PageContainer';

const Index = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  return (
    <PageContainer type="homepage">
      值班管理
    </PageContainer>
  );
};

export default Index;

