/* eslint-disable no-console */
import PageContainer from "@/components/PageContainer";
import type { ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import { Divider, message, Tag, Tooltip } from "antd";
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
// import SelectComponent from "@/components/SelectComponent"

// const downOneData = [
//     { key: "1", Field: "学年学期：", oneData1: "2020 - 2021", oneData2: "2019 - 2020" },
//     { key: "1", Field: "年级：", oneData1: "六年级", oneData2: "五年级" },
// ]

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
            dataIndex: 'FJSJ',
            align: 'center', 
            ellipsis: true,
            width:100,
            render: (_, record) => {
                return <div >    
                    {record.FJSJ?.FJMC}
                 </div>
              }
        },
        {
            title: '授课老师',
            dataIndex: 'ZJS',
            align: 'center',
            width:80,    
        },
        {
            title: `助教老师`,
            dataIndex: 'FJS',
            align: 'center',
            ellipsis: true,
            width:100,
            render:(_,record)=>{
                return(
                    <div className='ui-table-col-elp'>
                    <Tooltip title={record.FJS} arrowPointAtCenter>
                    {
                        record.FJS?.split(',').map((item)=>{
                            return(
                                <>
                                <Tag>{item}</Tag>
                                </>
                            )
                        })
                    }
                    </Tooltip>
                    </div>
                )
            }
        },
        {
            title: '学生人数',
            dataIndex: 'BJRS',
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
            dataIndex: 'BJMS',
            align: 'center',
            ellipsis: true,
            width:100,
        },
        {
            title: '状态',
            dataIndex: 'BJZT',
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
                    // headerTitle={
                    //     <SelectComponent
                    //         onlySearch={false}
                    //         fieldData={downOneData}
                    //         placeholder="班级名称"
                    //         filedSelectTwo={false}
                    //     />
                    // }
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