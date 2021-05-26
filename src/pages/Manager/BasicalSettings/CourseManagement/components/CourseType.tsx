import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import { EditableProTable } from "@ant-design/pro-table";
import { message } from "antd";
import { Button, Popconfirm } from "antd";
import React, { useRef, useState } from "react";
import type { DataSourceType } from "../data";
import { defaultData } from "../mock";

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
            width: 48,
        },
        {
            title: '类型',
            key: 'state',
            dataIndex: 'KCLX',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '描述',
            dataIndex: 'KCMS',
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
                    title="删除之后，数据不可恢复，确定要删除吗?"
                    onConfirm={async () => {
                        try {
                            if (record.id) {
                                console.log('delete', [record.id])
                            }
                        } catch (err) {
                            message.error('删除失败，请联系管理员或稍后重试。');
                        }
                    }}
                    okText="确定"
                    cancelText="取消"
                    placement="topLeft"
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
                style={{ marginLeft: "25px" }}
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
export default CourseType