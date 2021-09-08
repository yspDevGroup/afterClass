import { createFJLX, deleteFJLX, getAllFJLX, updateFJLX } from '@/services/after-class/fjlx';
import { enHenceMsg } from '@/utils/utils';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { Button, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import type { TableListParams } from '../../RoomManagement/data';
import type { DataSourceType } from '../data';
import { useModel } from 'umi';

const SiteMaintenance = () => {
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '名称',
      dataIndex: 'FJLX',
      align: 'center',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项是必填项',
          },
          {
            max: 12,
            message: '最长为 12 位',
          },
        ],
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      align: 'center',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id!);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          title="删除之后，数据不可恢复，确定要删除吗?"
          onConfirm={async () => {
            try {
              if (record.id) {
                const result = await deleteFJLX({ id: `${record.id}` });
                if (result.status === 'ok') {
                  message.success('信息删除成功');
                  actionRef.current?.reload();
                } else {
                  enHenceMsg(result.message);
                }
              }
            } catch (err) {
              message.error('删除失败，请联系管理员或稍后重试。');
            }
          }}
          okText="确定"
          cancelText="取消"
          placement="topRight"
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          actionRef.current?.addEditRecord?.({
            id: (Math.random() * 1000000).toFixed(0),
            title: '新的一行',
          });
        }}
        icon={<PlusOutlined />}
        style={{ marginLeft: '25px', marginBottom: '16px' }}
      >
        新建
      </Button>
      <EditableProTable<DataSourceType>
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        value={dataSource}
        request={(params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const opts: TableListParams = {
            ...params,
            sorter: sorter && Object.keys(sorter).length ? sorter : undefined,
            filter,
          };
          return getAllFJLX({ name: '', XXJBSJId: currentUser?.xxId }, opts);
        }}
        recordCreatorProps={false}
        onChange={setDataSource}
        editable={{
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys,
          onSave: async (_, row) => {
            try {
              // 更新或新增场地信息
              const result = row.title
                ? await createFJLX({
                    FJLX: row.FJLX!,
                    XXJBSJId: currentUser?.xxId,
                  })
                : await updateFJLX(
                    {
                      id: row.id!,
                    },
                    {
                      FJLX: row.FJLX!,
                      XXJBSJId: currentUser?.xxId,
                    },
                  );
              if (result.status === 'ok') {
                message.success(row.title ? '信息新增成功' : '信息更新成功');
                actionRef.current?.reload();
              } else {
                enHenceMsg(result.message);
              }
            } catch (errorInfo) {
              console.log('Failed:', errorInfo);
            }
          },
        }}
      />
    </>
  );
};
export default SiteMaintenance;
