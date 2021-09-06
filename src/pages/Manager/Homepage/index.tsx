/*
 * @description:
 * @author: Sissle Lynn
 * @Date: 2021-09-04 15:37:44
 * @LastEditTime: 2021-09-06 09:31:39
 * @LastEditors: Sissle Lynn
 */
import React, { useState } from 'react';
import IndexComp from '@/components/IndexComp';
import { useModel } from 'umi';
import PageContainer from '@/components/PageContainer';


const Index = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  return <PageContainer>
    <IndexComp />
  </PageContainer>
};

export default Index;
