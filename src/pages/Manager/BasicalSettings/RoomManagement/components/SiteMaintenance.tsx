import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import { EditableProTable } from "@ant-design/pro-table";
import { Button, Popconfirm  } from "antd";
import React, { useRef, useState } from "react";
import type { DataSourceType } from "../data";
import { defaultData } from "../mock";

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
            dataIndex: 'FJMC',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '描述',
            dataIndex: 'BZXX',
            align: 'center',
            ellipsis: true,
            fieldProps: (from, { rowKey, rowIndex }) => {
                if (from.getFieldValue([rowKey || '', 'title']) === '不好玩') {
                    return {
                        disabled: true,
                    };
                }
                if (rowIndex > 9) {
                    return {
                        disabled: true,
                    };
                }
                return {};
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
                        action?.startEditable?.(record.id);
                    }}
                >
                    编辑
                </a>,
                <Popconfirm
                    title='确定删除？'
                >
                    <a
                        key="delete"
                    >
                        删除
            </a>
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
                style={{marginLeft:"25px"}}
            >
                新建一行
            </Button>
            <EditableProTable<DataSourceType>
                // style={{minWidth:'600px'}}
                rowKey="id"
                actionRef={actionRef}
                columns={columns}
                request={async () => ({
                    data: defaultData,
                    total: 3,
                    success: true,
                })}
                value={dataSource}
                recordCreatorProps={false}
                onChange={setDataSource}
                editable={{
                    type: 'multiple',
                    editableKeys,
                    onChange: setEditableRowKeys,
                }}
            />
        </>
    )
}
export default SiteMaintenance