import PageContainer from '@/components/PageContainer';
import { Space, Table } from 'antd';
import React from 'react';

/**
 * 机构课程
 * @returns
 */
const index = () => {
  const columns = [
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '所属机构',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '任课老师',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '适用年级',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '引入状态',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '操作',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
      render: () => {
        return (
          <Space size="middle">
            <a>课程详情</a>
            <a>机构详情</a>
            <a>引入</a>
          </Space>
        );
      },
    },
  ];
  const dataSource = [{}, {}];
  return (
    <PageContainer>
      <div>
        <Table dataSource={dataSource} columns={columns} />
      </div>
    </PageContainer>
  );
};

export default index;
