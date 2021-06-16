/*
 * @description: 
 * @author: txx
 * @Date: 2021-06-16 17:09:29
 * @LastEditTime: 2021-06-16 18:24:30
 * @LastEditors: txx
 */
import React from 'react'
import PageContainer from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import styles from "./index.less"
import { Button } from 'antd';
import { theme } from '@/theme-default';
import { PlusOutlined } from '@ant-design/icons';
import type { SignUpTime } from './data';

const handleOperation = () => {
};
const columns: ProColumns<SignUpTime>[] = [
  {
    title: '序号',
    dataIndex: 'id',
    key: "id",
    align: 'center',
  },
  {
    title: '报名名称',
    dataIndex: 'BMMC',
    key: 'BMMC',
    align: 'center',
  },
  {
    title: '开课时间',
    dataIndex: 'KKSJ',
    key: 'KKSJ',
    align: 'center',
  },
  {
    title: '结课时间',
    key: 'JKSJ',
    dataIndex: 'JKSJ',
    align: 'center',
  },
  {
    title: '报名开始时间',
    key: 'BMKSSJ',
    dataIndex: 'BMKSSJ',
    align: 'center',
  },
  {
    title: '报名结束时间',
    key: 'BMJSSJ',
    dataIndex: 'BMJSSJ',
    align: 'center',
  },
]

const SignUpTimeManagement = () => {
  return (
    <PageContainer cls={styles.SignUpTimeBox}>
      <ProTable<SignUpTime>
        columns={columns}
        search={false}
        options={{
          setting: false,
          fullScreen: false,
          density: false,
          reload: false,
        }}
        toolBarRender={() => [
          <Button
            style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
            type="primary"
            key="add"
            onClick={() => handleOperation()}
          >
            <PlusOutlined />新增报名
          </Button>,
        ]}
      />
    </PageContainer>
  )
}

export default SignUpTimeManagement
