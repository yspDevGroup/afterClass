import { deleteKHKCSJ, updateKHKCSJ } from "@/services/after-class/khkcsj";
import { ActionType } from "@ant-design/pro-table";
import { Divider, message, notification } from "antd";
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
    const Url = `/courseManagements/classMaintenance?courseId=${record.id}`;
    // 发布按钮事件
    const release = async (record: any) => {
        const classes = [];
        record.KHBJSJs?.map((item: any) => {
            if (item.BJZT === '已发布') {
                return classes.push(item)
            };
            return false;
        });
        if (classes.length === 0) {
            return notification['warning']({
                message: '没有班级可以发布',
                description:
                    '当前没有已经排课的班级可以发布，请维护班级后再来发布课程.',
                onClick: () => {
                    console.log('Notification Clicked!');
                },
            });
        }
        const res = await updateKHKCSJ(record.id, { KCZT: '已发布' })
        if (res.status === 'ok') {
            actionRef?.current?.reload()
        } return false
    };
    //  下架事件
    const Offtheshelf = async (record: any) => {
        const res = await updateKHKCSJ(record.id, { KCZT: '已下架' })
        if (res.status === 'ok') {
            actionRef?.current?.reload()
        } return false
    }

    switch (record.KCZT) {
        case '待发布':
            return (
                <>
                    <a onClick={() => release(record)}>发布</a>
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
                        placement="topRight"
                    >
                        <a>删除</a>
                    </Popconfirm>
                </>)
        case '已发布':
            return (
                <>
                    <a onClick={() => Offtheshelf(record)}>下架</a>
                    <Divider type="vertical" />
                    <a onClick={() => handleOperation('chakan', record)}>查看</a>
                </>)
        case '未排课':
        case '已下架':
            return (
                <>
                    <Link to={Url} >排课</Link>
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
                        placement="topRight"
                    >
                        <a>删除</a>
                    </Popconfirm>
                </>)
        default:
            return (
                <>
                    <a onClick={() => handleOperation('chakan', record)}>查看</a>
                </>
            )
    }


}

export default Operation