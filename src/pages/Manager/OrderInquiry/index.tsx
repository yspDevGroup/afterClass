/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef } from 'react';
import { Space, Table } from 'antd';

import PageContainer from '@/components/PageContainer';

/**
 *
 * 订单查询页面
 * @return
 */
const OrderInquiry = () => {
  const columns = [
    {
      title: '学年学期',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '课程名称',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '班级',
      dataIndex: 'addressq',
      key: 'addressq',
    },
    {
      title: '学生姓名',
      dataIndex: 'address2',
      key: 'address2',
    },
    {
      title: '订单状态',
      dataIndex: 'addres1s',
      key: 'addres1s',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <a>去付款</a>
          {/* <a>退款申请</a> */}
        </Space>
      ),
    },
  ];
  return (
    <PageContainer>
      <Table dataSource={[]} columns={columns} pagination={false} />
    </PageContainer>
  );
};

export default OrderInquiry;
