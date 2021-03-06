/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-04 15:37:44
 * @LastEditTime: 2021-12-09 15:42:29
 * @LastEditors: Wu Zhan
 */
import React from 'react';
import IndexComp from '@/components/IndexComp';
import { useModel } from 'umi';
import PageContainer from '@/components/PageContainer';
import Register from '@/components/IndexComp/Register';

const Index = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  return (
    <PageContainer type="homepage">
      {currentUser?.XZQHM ? <IndexComp /> : <Register />}
    </PageContainer>
  );
};

export default Index;
