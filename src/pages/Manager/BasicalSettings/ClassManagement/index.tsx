/* eslint-disable no-console */
import PageContainer from "@/components/PageContainer";
import type { ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import { Divider } from "antd";
import styles from './index.less';
import type { ClassItem } from "./data";
import { Button } from "antd";
import { theme } from "@/theme-default";
import { listData } from "./mock";
import { paginationConfig } from '@/constant';
import { Popconfirm } from "antd";
import React, { useState } from "react";
import AddClass from "./components/AddClass";
import StudentInformation from "./components/StudentInformation";


const ClassManagement = () => {
    const [modalType, setModalType] = useState<string>('add');
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [current, setCurrent] = useState<ClassItem>();

    const getModelTitle = () => {
        if (modalType === 'preview') {
            return '作息时间表预览';
        }
        if (modalType === 'classReset') {
            return '节次维护';
        }
        if (current) {
            return '编辑信息';
        }
        return '新增';
    };
    const handleOperation = (type: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        type === 'add' ? setCurrent(undefined) : '';
        setModalType(type);
        setModalVisible(true);
    };

    const handleEdit = (data: ClassItem) => {
        setModalType('add');
        setCurrent(data);
        getModelTitle();
        setModalVisible(true);
    };

    const onClose = () => {
        setModalVisible(false);
    };
    const sc = (record: any) => {
        console.log(record.id)
    }

    const columns: ProColumns<ClassItem>[] = [
        {
            title: '序号',
            dataIndex: 'index',
            valueType: 'index',
            width: 48,
        },
        {
            title: '班级名称',
            dataIndex: 'BJMC',
            align: 'center',
            width:100,
        },
        {
            title: '上课地点',
            dataIndex: 'SKDD',
            align: 'center',
           
            ellipsis: true,
            width:100,
        },
        {
            title: '授课老师',
            dataIndex: 'SKLS',
            align: 'center',
            width:80,
        },
        {
            title: `助教老师`,
            dataIndex: 'ZJLS',
            align: 'center',
            ellipsis: true,
            width:100,
        },
        {
            title: '学生人数',
            dataIndex: 'XSRS',
            align: 'center',
            width:80,
            render: (dom) => {
                return (
                     <a >
                         <StudentInformation dom={dom}/>
                     </a>
                )
            }

        },
        {
            title: '简介',
            dataIndex: 'JJ',
            align: 'center',
            ellipsis: true,
            width:100,
        },
        {
            title: '状态',
            dataIndex: 'ZT',
            align: 'center',
            width: 70,
        },
        {
            title: '操作',
            valueType: 'option',
            width: 100,
            render: (_, record) => (
                <>
                    <a onClick={() => handleEdit(record)} >编辑</a>
                    <Divider type="vertical" />
                    <a onClick={() => sc(record)}>
                        <Popconfirm title="确定删除吗？" okText="是" cancelText="否">删除
                        </Popconfirm>
                    </a>
                </>
            ),
            align: 'center',
        },
    ];

    return (
        <>
            <PageContainer cls={styles.roomWrapper} >
                <ProTable<ClassItem>
                    columns={columns}
                    search={false}
                    options={{
                        setting: false,
                        fullScreen: false,
                        density: false,
                        reload: false,
                    }}
                    pagination={paginationConfig}
                    dataSource={listData}
                    toolBarRender={() => [
                        <Button
                            style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
                            type="primary"
                            key="add"
                            onClick={() => handleOperation('add')}
                        >
                            新增课程
                         </Button>,
                    ]}
                />
                <AddClass visible={modalVisible} onClose={onClose} formValues={current} />
            </PageContainer>
        </>

    )
}
export default ClassManagement