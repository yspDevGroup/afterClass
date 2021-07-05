import { createKHKCLX, deleteKHKCLX, getAllKHKCLX, updateKHKCLX } from "@/services/after-class/khkclx";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import { EditableProTable } from "@ant-design/pro-table";
import { message } from "antd";
import { Button, Popconfirm } from "antd";
import React, { useRef, useState } from "react";
import type { DataSourceType, TableListParams } from "../data";


const CourseType = () => {
    const actionRef = useRef<ActionType>();
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
    const columns: ProColumns<DataSourceType>[] = [
        {
            title: '序号',
            dataIndex: 'index',
            valueType: 'index',
            ellipsis: true,
            align: 'center',
            width: 100,
        },
        {
            title: '类型',
            dataIndex: 'KCLX',
            align: 'center',
            ellipsis: true,
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
                                const result = await deleteKHKCLX({ id: `${record.id}` });
                                if (result.status === 'ok') {
                                    message.success('信息删除成功');
                                    actionRef.current?.reload();
                                } else {
                                    if ((result.message!).indexOf('Cannot') > -1) {
                                      message.error(`删除失败，请先删除关联数据,请联系管理员或稍后再试`);
                                    } else {
                                      message.error(`${result.message},请联系管理员或稍后再试`);
                                    }
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
                    <a>
                        删除
               </a>
                </Popconfirm>
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
                style={{ marginLeft: "25px" ,marginBottom:'16px'}}
            >
                新建
            </Button>
            <EditableProTable<DataSourceType>
                rowKey="id"
                actionRef={actionRef}
                columns={columns}
                request={(params, sorter, filter) => {
                    // 表单搜索项会从 params 传入，传递给后端接口。
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
                            // 更新或新增场地信息
                            const result = row.title ? await createKHKCLX({
                                KCLX: row.KCLX!
                            }) : await updateKHKCLX({
                                id: row.id!
                            }, {
                                KCLX: row.KCLX!
                            });
                            if (result.status === 'ok') {
                                message.success(row.title ?'信息新增成功':'信息更新成功');
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
    )
}
export default CourseType