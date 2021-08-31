/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import EllipsisHint from '@/components/EllipsisHint';
import { getAllKHKCLX } from '@/services/after-class/khkclx';
import { getToIntroduceBySchool, updateKHKCSQ } from '@/services/after-class/khkcsq';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { message, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import type { classType, TableListParams } from './data';

/**
 * 未引入课程
 * @returns
 */
const courseNotIntroduced = () => {
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
      // render: (_, record) => {
      //   return <>{record.KHKCLX?.KCLX}</>;
      // },
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
    {
      title: '状态',
      align: 'center',
      ellipsis: true,
      dataIndex: 'KHKCSQs',
      key: 'KHKCSQs',
      search: false,
      width: 110,
      render: (text, record) => {
        return record.KHKCSQs?.length === 0 ? '未引入' : '已引入';
      },
    },
    {
      title: '操作',
      valueType: 'option',
      search: false,
      key: 'option',
      width: 300,
      align: 'center',
      render: (text, record, index, action) => {
        return (
          <Space size="middle">
            <a>课程详情</a>
            <a>机构详情</a>
            <a
              onClick={async () => {
                const res = await updateKHKCSQ({ id: record?.id }, { ZT: 1 });
                if (res.status === 'ok') {
                  message.success('操作成功');
                  action?.reload();
                } else {
                  message.error('操作失败');
                }
              }}
            >
              引入
            </a>
          </Space>
        );
      },
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
          const resAll = await getToIntroduceBySchool(opts);
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

export default courseNotIntroduced;
