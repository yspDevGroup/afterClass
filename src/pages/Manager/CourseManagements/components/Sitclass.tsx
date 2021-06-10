import { createKHKCLX, getAllKHKCLX, updateKHKCLX } from '@/services/after-class/khkclx';
import { courseColorType } from '@/theme-default';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { Badge, message } from 'antd';
import { Button, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import type { classType, TableListParams } from '../data';

const Sitclass = () => {
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<classType[]>([]);
  const options = [
    { label: '绯红', value: courseColorType.crimson },
    { label: '橙色', value: courseColorType.orange },
    { label: '黄色', value: courseColorType.yellow },
    { label: '绿色', value: courseColorType.green },
    { label: '天空蓝', value: courseColorType.skyBlue },
    { label: '紫色', value: courseColorType.violet },
    { label: '紫红色', value: courseColorType.purplishRed },
  ];
  const columns: ProColumns<classType>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      ellipsis: true,
      width: 48,
    },
    {
      title: '名称',
      dataIndex: 'KCLX',
      align: 'center',
      ellipsis: true,
      width:100,
    },
    {
      title: '课程颜色',
      dataIndex: 'KBYS',
      align: 'center',
      valueType: 'select',
      fieldProps: {
        options,
      },
      render: (_, item) => {
        return options.map((oItem) => {
          if (oItem.value === item.KBYS) {
            return <Badge color={item.KBYS} text={oItem.label} />;
          }
          return '';
        });
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
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
          okText="确定"
          cancelText="取消"
          placement="topLeft"
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
      <EditableProTable<any>
        // style={{minWidth:'600px'}}
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        request={(params, sorter, filter) => {
          const opts: TableListParams = {
            ...params,
            sorter: sorter && Object.keys(sorter).length ? sorter : undefined,
            filter,
          };
          return getAllKHKCLX({ name: '' }, opts);
        }}
        value={dataSource}
        recordCreatorProps={false}
        onChange={setDataSource}
        editable={{
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys,
          onSave: async (key, row) => {
            try {
              const result = row.title
                ? await createKHKCLX({
                    KCLX: row.KCLX!,
                    KBYS: row.KBYS,
                  })
                : await updateKHKCLX(
                    {
                      id: row.id!,
                    },
                    {
                      KCLX: row.KCLX!,
                      KBYS: row.KBYS,
                    },
                  );
              if (result.status === 'ok') {
                message.success(row.title ? '信息新增成功' : '信息更新成功');
                actionRef.current?.reload();
              } else {
                message.error(`${result.message},请联系管理员或稍后再试`);
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

export default Sitclass;
