import type { FC } from 'react';
import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';

/**
 *
 * 报名人详情
 * @return {*}
 */
type ApplicantPropsType = {
  dataSource: any[];
};

const ApplicantInfoTable: FC<ApplicantPropsType> = ({ dataSource }) => {
  const columns: ColumnsType<any> | undefined = [
    {
      title: '学生姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
    },
    {
      title: '班级',
      dataIndex: 'BJMC',
      key: 'BJMC',
      align: 'center',
    },
    {
      title: '年级',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    },
    {
      title: '校区',
      dataIndex: 'XQName',
      key: 'XQName',
      align: 'center',
    },
    {
      title: '报名时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
    },
  ];
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </div>
  );
};

export default ApplicantInfoTable;