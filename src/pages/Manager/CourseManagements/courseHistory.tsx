/* eslint-disable react-hooks/rules-of-hooks */
import { getHistoriesBySchool } from '@/services/after-class/khkcsq';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import React, { useRef } from 'react';
import { Link, useModel } from 'umi';
import type { classType, TableListParams } from './data';

/**
 * 课程历史记录
 * @returns
 */
const CourseHistory = () => {
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const columns: ProColumns<classType>[] = [
    {
      title: '课程名称',
      dataIndex: 'KCMC',
      key: 'KCMC',
      align: 'center',
      width: 150,
      ellipsis: true,
    },
    {
      title: '课程类型',
      align: 'center',
      width: 110,
      key: 'KHKCLXId',
      search: false,
      render: (_, record) => {
        return <>{record.KHKCLX?.KCLX}</>;
      },
    },
    {
      title: '课程来源',
      align: 'center',
      width: 110,
      key: 'SSJGLX',
      dataIndex: 'SSJGLX',
      search: false,
      // render: (_, record) => {
      //   return <>{record.KHKCLX?.KCLX}</>;
      // },
    },
    {
      title: '班级数',
      align: 'center',
      search: false,
      width: 100,
      render: (_, record) => {
        const Url = `/courseManagements/classMaintenance?courseId=${record.id}`;
        const classes = record.KHBJSJs?.filter((item) => item.BJZT === '已发布');
        return (
          <Link to={Url}>
            {classes?.length}/{record.KHBJSJs?.length}
          </Link>
        );
      },
    },
    {
      title: '课程封面',
      align: 'center',
      width: 120,
      dataIndex: 'KCTP',
      search: false,
      ellipsis: true,
    },
    {
      title: '简介',
      dataIndex: 'KCMS',
      key: 'KCMS',
      align: 'center',
      search: false,
      ellipsis: true,
    },
    {
      title: '状态',
      align: 'center',
      ellipsis: true,
      dataIndex: 'KCZT',
      key: 'KCZT',
      search: false,
      width: 110,
    },
    {
      title: '操作',
      valueType: 'option',
      search: false,
      key: 'option',
      width: 150,
    },
  ];
  return (
    <div>
      <ProTable<classType>
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const opts: TableListParams = {
            ...params,
            sorter: sorter && Object.keys(sorter).length ? sorter : undefined,
            filter,
            name: params.keyword,
            pageSize: 0,
            page: 1,
            isRequired: false,
            XXJBSJId: currentUser?.xxId,
            XZQHM: '610324',
          };
          const resAll = await getHistoriesBySchool(opts);
          if (resAll.status === 'ok') {
            return {
              data: resAll.data,
              success: true,
              total: resAll.data.count,
            };
          }
          return {
            data: [],
            success: false,
            total: 0,
          };
        }}
        options={{
          setting: false,
          fullScreen: false,
          density: false,
          reload: false,
        }}
        // search={false}
      />
    </div>
  );
};

export default CourseHistory;
