import type { FC } from 'react';
import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { paginationConfig } from '@/constant';

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
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 58,
      align: 'center'
    },
    {
      title: '学号',
      dataIndex: 'XH',
      key: 'XH',
      align: 'center',
      width: 160,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return record?.XSJBSJ?.XH
      },
    },
    {
      title: '学生姓名',
      dataIndex: 'XSXM',
      key: 'XSXM',
      align: 'center',
      width: 100,
      render: (_text: any, record: any) => {
        return record?.XSJBSJ?.XM
      },
    },
    {
      title: '行政班名称',
      dataIndex: 'XZBJSJ',
      key: 'XZBJSJ',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: (_text: any, record: any) => {
        return `${record?.XSJBSJ?.BJSJ?.NJSJ?.NJMC}${record?.XSJBSJ?.BJSJ?.BJ}`
      },
    },
    {
      title: '报名时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      width: 150,
      render: (_text: any, record: any) => {
        return record?.createdAt?.substring(0,16)
      },
    },
  ];
  return (
    <div>
      <div style={{ marginBottom: 16 }}>课程班名称：{BJMC}</div>
      <ProTable
        search={false}
        dataSource={KHXSBJs}
        columns={columns}
        pagination={paginationConfig}
        options={{
          setting: false,
          fullScreen: false,
          density: false,
          reload: false,
        }}
      />
    </div>
  );
};

export default ApplicantInfoTable;
