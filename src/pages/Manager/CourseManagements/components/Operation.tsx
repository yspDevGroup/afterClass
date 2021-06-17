import { deleteKHKCSJ } from "@/services/after-class/khkcsj";
import { ActionType } from "@ant-design/pro-table";
import { Divider, message } from "antd";
import Popconfirm from "antd/es/popconfirm";
import React from "react";
import { Link } from "umi";

type PropsType = {
    record: any;
    handleOperation: (type: string, data: any) => void;
    actionRef?: React.MutableRefObject<ActionType | undefined>;
};

const Operation = (props: PropsType) => {
    const { actionRef, handleOperation, record } = props;
    switch (record.KCZT) {
        case '待发布':
            return (
                <>
                    <Link to=''>发布</Link>
                    <Divider type="vertical" />
                    <a onClick={() => handleOperation('add', record)}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="删除之后，数据不可恢复，确定要删除吗?"
                        onConfirm={async () => {
                            try {
                                if (record.id) {
                                    const result = await deleteKHKCSJ({ id: record.id })
                                    if (result.status === 'ok') {
                                        message.success('信息删除成功');
                                        actionRef?.current?.reload();
                                    } else {
                                        message.error(`${result.message},请联系管理员或者稍后重试`)
                                    }
                                }

                            } catch (err) {
                                message.error('删除失败，请联系管理员或稍后重试')
                            }
                        }

                        }
                        okText="确定"
                        cancelText="取消"
                        placement="leftBottom"
                    >
                        <a>删除</a>
                    </Popconfirm>
                </>)
        default:
            return (
                <>
                    <a onClick={() => handleOperation('add', record)}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="删除之后，数据不可恢复，确定要删除吗?"
                        onConfirm={async () => {
                            try {
                                if (record.id) {
                                    const result = await deleteKHKCSJ({ id: record.id })
                                    if (result.status === 'ok') {
                                        message.success('信息删除成功');
                                        actionRef?.current?.reload();
                                    } else {
                                        message.error(`${result.message},请联系管理员或者稍后重试`)
                                    }
                                }

                            } catch (err) {
                                message.error('删除失败，请联系管理员或稍后重试')
                            }
                        }

                        }
                        okText="确定"
                        cancelText="取消"
                        placement="leftBottom"
                    >
                        <a>删除</a>
                    </Popconfirm>

                </>
            )
    }


}

export default Operation