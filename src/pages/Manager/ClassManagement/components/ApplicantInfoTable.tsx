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
  dataSource: Record<any, any>;
};

const ApplicantInfoTable: FC<ApplicantPropsType> = (props) => {
  const { KHXSBJs, BJMC } = props.dataSource;
  const columns: ColumnsType<any> | undefined = [
    {
      title: '学生姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
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
      <div style={{ marginBottom: 16 }}>班级名称：{BJMC}</div>
      <Table dataSource={KHXSBJs} columns={columns} pagination={false} />
    </div>
  );
};

export default ApplicantInfoTable;
