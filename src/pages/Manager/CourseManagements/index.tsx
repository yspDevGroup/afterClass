import PageContainer from "@/components/PageContainer";
import { paginationConfig } from "@/constant";
import { theme } from "@/theme-default";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { FormInstance} from "antd";
import { Button, Modal, Popconfirm } from "antd";
import { Divider } from "antd";
import React, { useRef } from "react";
import { useState } from "react";
import type { classType } from "./data";
import NewCourses from "./components/NewCourses";
import styles from './index.less'
import { list } from "./mock";
import { Link } from "umi";
import Sitclass from "./components/Sitclass";


const NewClassManagement = () => {
    const actionRef = useRef<ActionType>();
    const [current, setCurrent] = useState<classType>();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalType, setModalType] = useState<string>('add');
    const [form, setForm] = useState<FormInstance<any>>();
    console.log(form)
    const getModelTitle = () => {
        if (modalType === 'uphold') {
            return '课程类型维护';
          }
        if (current) {
          return '编辑信息';
        }
        return '新增信息';
      };
    const handleOperation = (type: string, data?: classType) => {
        if (data) {
          setCurrent(data)
        } else {
          setCurrent(undefined);
        }
        setModalType(type);
        getModelTitle();
        setModalVisible(true);
    };
    const handleSubmit = () => {
        console.log(666)
      };
    const maintain = () => {
        setModalType('uphold')
        setModalVisible(true);
    };
    const columns: ProColumns<classType>[] = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            valueType: 'index',
            width: 48,
        },
        {
            title: '课程名称',
            dataIndex: 'KCMC',
            key: 'KCMC',
            align: 'center',
            width: '12%',
        },
        {
            title: '类型',
            dataIndex: 'KHKCLX',
            key: 'KHKCLX',
            align: 'center',
            width: '10%',
        },
        {
            title: '班级数',
            dataIndex: 'BJS',
            key: 'BJS',
            align: 'center',
            width: '10%',
            render:(dom)=>{
                return(
                    <Link to='/basicalSettings/courseManagement'>
                    <a>{dom}</a>
                    </Link>
                )
            }
        },
        {
            title: '简介',
            dataIndex: 'BJMS',
            key: 'BJMS',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            width: 100,
            render: (_, record) => (
                <>
                    <a onClick={() => handleOperation('add', record)}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="删除之后，数据不可恢复，确定要删除吗?"
                        okText="确定"
                        cancelText="取消"
                        placement="topLeft"
                    >
                    <a>删除</a>
                    </Popconfirm>
                </>
            ),
            align: 'center',
        },
    ];
    return (
        <>
            <PageContainer cls={styles.roomWrapper}>
                <ProTable<classType>
                    actionRef={actionRef}
                    columns={columns}
                    rowKey="id"
                    options={{
                        setting: false,
                        fullScreen: false,
                        density: false,
                        reload: false,
                    }}
                    search={false}
                    dataSource={list}
                    pagination={paginationConfig}
                    toolBarRender={() => [
                        <Button key="wh" onClick={() => maintain()}>
                            课程类型维护
                        </Button>,
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
                <Modal
                     title={getModelTitle()}
                     destroyOnClose
                     width='30vw'
                     visible={modalVisible}
                     onCancel={() => setModalVisible(false)}
                     footer={[
                       <Button key="back" onClick={() => setModalVisible(false)}>
                         取消
                       </Button>,
                       <Button key="submit" type="primary" onClick={handleSubmit}>
                         确定
                       </Button>
                     ]}
                     centered
                     maskClosable={false}
                     bodyStyle={{
                       maxHeight: '65vh',
                       overflowY: 'auto',
                     }}
                >
                {modalType === 'uphold' ?<Sitclass/>:<NewCourses current={current} setForm={setForm} />}   
                </Modal>
            </PageContainer>
        </>
    )
}

export default NewClassManagement