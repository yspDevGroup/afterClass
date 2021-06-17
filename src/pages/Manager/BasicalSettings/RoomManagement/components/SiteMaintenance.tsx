import { createFJLX, deleteFJLX, getAllFJLX, updateFJLX } from "@/services/after-class/fjlx";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import { EditableProTable } from "@ant-design/pro-table";
import { Button, message, Popconfirm  } from "antd";
import React, { useRef, useState } from "react";
import type { TableListParams } from "../../RoomManagement/data";
import type { DataSourceType } from "../data";


const SiteMaintenance = () => {
    const actionRef = useRef<ActionType>();
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<DataSourceType[]>([]);

    const columns: ProColumns<DataSourceType>[] = [
        {
            title: '序号',
            dataIndex: 'index',
            valueType: 'index',
            ellipsis: true,
            width: 48,
        },
        {
            title: '名称',
            dataIndex: 'FJLX',
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
                            const result = await deleteFJLX({ id: `${record.id}` });
                            if (result.status === 'ok') {
                                message.success('信息删除成功');
                                actionRef.current?.reload();
                            } else {
                                message.error(`${result.message},请联系管理员或稍后再试`);
                            }
                        }
                    } catch (err) {
                        message.error('删除失败，请联系管理员或稍后重试。');
                    }
                }}
                okText="确定"
                cancelText="取消"
                placement="leftBottom"
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
                style={{marginLeft:"25px",marginBottom:'16px'}}
            >
                新建
            </Button>
            <EditableProTable<DataSourceType>
                // style={{minWidth:'600px'}}
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
                    return getAllFJLX({ name: '' }, opts);
                }}
                recordCreatorProps={false}
                onChange={setDataSource}
                editable={{
                    type: 'multiple',
                    editableKeys,
                    onChange: setEditableRowKeys,
                    onSave: async (key, row) => {
                        try {
                            // 更新或新增场地信息
                            const result = row.title ? await createFJLX({
                                FJLX: row.FJLX!
                            }) : await updateFJLX({
                                id: row.id!
                            }, {
                                FJLX: row.FJLX!
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
export default SiteMaintenance