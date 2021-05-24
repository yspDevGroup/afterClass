import PageContainer from "@/components/PageContainer";
import type { ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import { Divider, Modal } from "antd";
import styles from './index.less';
import React from "react";
import type { RoomItem } from "./data";
import { Button } from "antd";
import { theme } from "@/theme-default";


const CourseManagement = () => {

    const columns: ProColumns<RoomItem>[] = [
        {
            title: '序号',
            dataIndex: 'index',
            valueType: 'index',
            width: 48,
        },
        {
            title: '课程名称',
            dataIndex: 'CDMC',
            align: 'center',
        },
        {
            title: '类型',
            dataIndex: 'CDLX',
            align: 'center',
        },
        {
            title: '时长',
            dataIndex: 'SSXQ',
            align: 'center',
        },
        {
            title: '费用',
            dataIndex: 'RNRS',
            align: 'center',
        },
        {
            title: '课程封面',
            dataIndex: 'CDDZ',
            align: 'center',
        },
        {
            title: '简介',
            dataIndex: 'BZ',
            align: 'center',
            width: 220,
        },
        {
            title: '状态',
            dataIndex: 'BZ',
            align: 'center',
            width: 220,
        },
        {
            title: '操作',
            valueType: 'option',
            width: 100,
            render: () => (
                <>
                    <a >编辑</a>
                    <Divider type="vertical" />
                    <a >删除</a>
                </>
            ),
            align: 'center',
        },
    ];

    return (
        <>
            <PageContainer cls={styles.roomWrapper} >
                <ProTable<RoomItem>
                    columns={columns}
                    toolBarRender={() => [
                        <Button
                            style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
                            type="primary"
                            key="add"
                            // onClick={() => handleOperation('add')}
                        >
                            新增
                         </Button>,
                    ]}
                />
                <Modal

                >

                </Modal>
            </PageContainer>
        </>

    )
}

export default CourseManagement