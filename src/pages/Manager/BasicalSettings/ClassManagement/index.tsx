/* eslint-disable no-console */
import PageContainer from "@/components/PageContainer";
import type { ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import { Divider, message } from "antd";
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
import SearchComponent from "@/components/Search"


const ClassManagement = () => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [current, setCurrent] = useState<ClassItem>();

    const getModelTitle = () => {
        if (current) {
            return '编辑信息';
        }
        return '新增';
    };
    const showDrawer = () => {
        setCurrent(undefined);
        setModalVisible(true);
    };

    const handleEdit = (data: ClassItem) => {
        setCurrent(data);
        getModelTitle();
        setModalVisible(true);
    };

    const onClose = () => {
        setModalVisible(false);
    };

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
                    headerTitle={<SearchComponent
                        placeholder="班级名称"
                        fieldOne="学年学期 :"
                        fieldTwo="年级 :"
                        one="2020-2021"
                        two="第一学期"
                        three="六年级"
                        HeaderFieldTitleNum={false}
                        onlySearch={false}
                    />}
                    toolBarRender={() => [

                        <Button
                            style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
                            type="primary"
                            key="add"
                            onClick={() => showDrawer()}
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