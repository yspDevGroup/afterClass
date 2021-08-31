/* eslint-disable react-hooks/rules-of-hooks */
import { getAllKHKCLX } from '@/services/after-class/khkclx';
import { getHistoriesBySchool } from '@/services/after-class/khkcsq';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import React, { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import type { classType, TableListParams } from './data';

/**
 * 课程历史记录
 * @returns
 */
const CourseHistory = () => {
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // 课程类型
  const [kclxOptions, setOptions] = useState<any[]>([]);
  useEffect(() => {
    // 课程类型
    const res = getAllKHKCLX({ name: '' });
    Promise.resolve(res).then((data) => {
      if (data.status === 'ok') {
        const opt: any[] = [];
        data.data?.map((item: any) => {
          return opt.push({
            label: item.KCTAG,
            value: item.id,
          });
        });
        setOptions(opt);
      }
    });
  }, []);
  const columns: ProColumns<any>[] = [
    {
      title: '课程名称',
      dataIndex: 'KCMC',
      key: 'KCMC',
      align: 'center',
      width: 150,
      ellipsis: true,
    },
    {
      title: '机构名称',
      align: 'center',
      width: 200,
      key: 'KHJYJG',
      // search: false,
      render: (_, record) => {
        return <>{record.KHJYJG?.QYMC || '-'}</>;
      },
    },
    {
      title: '课程类型',
      align: 'center',
      width: 110,
      key: 'KHKCLXId',
      valueType: 'select',
      fieldProps: {
        options: kclxOptions,
      },
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
    },
    {
      title: '适用年级',
      key: 'NJSJs',
      dataIndex: 'NJSJs',
      search: false,
      align: 'center',
      // render: (text: any) => {
      //   return (
      //     <EllipsisHint
      //       width="100%"
      //       text={text?.map((item: any) => {
      //         return <Tag key={item.id}>{item.XD === '初中' ? `${item.NJMC}` : `${item.XD}${item.NJMC}`}</Tag>;
      //       })}
      //     />
      //   );
      // }
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
              data: resAll.data.rows,
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
