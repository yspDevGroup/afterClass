import PageContainer from '@/components/PageContainer';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Divider } from 'antd';
import styles from './index.less';
import { useState } from 'react';
import type { CourseItem } from './data';
import { Button } from 'antd';
import { theme } from '@/theme-default';
import AddCourse from './components/AddCourse';
import { listData } from './mock';
import { paginationConfig } from '@/constant';
import Modal from 'antd/lib/modal/Modal';
import React from 'react';
import { message, Popconfirm } from 'antd';
import CourseType from './components/CourseType';


const CourseManagement = () => {
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState<CourseItem>();
    const [openes, setopenes] = useState(false)

    const showDrawer = () => {
        setVisible(true);
        setCurrent(undefined)
    };

    const handleEdit = (data: CourseItem) => {
        setVisible(true);
        setCurrent(data);
    };

    const onClose = () => {
        setVisible(false);
    };
    const maintain = () => {
        setopenes(true)
    }
    const showmodal = () => {
        setopenes(false)
    }
    const columns: ProColumns<CourseItem>[] = [
        {
            title: '序号',
            dataIndex: 'index',
            valueType: 'index',
            width: 48,
        },
        {
            title: '课程名称',
            dataIndex: 'KCMC',
            align: 'center',
            width: 80,
        },
        {
            title: '类型',
            dataIndex: 'LX',
            align: 'center',
            width: 100,
        },
        {
            title: '时长',
            dataIndex: 'SC',
            align: 'center',
            width: 50,
        },
        {
            title: '费用(元)',
            dataIndex: 'FY',
            align: 'center',
        },
        {
            title: '课程封面',
            dataIndex: 'KCFM',
            align: 'center',
            width: 100,
            render: (dom, index) => {
                return (
                    <a href={index.KCFM} target="view_window" >
                        课程封面.png
                    </a>
                )
            }

        },
        {
            title: '简介',
            dataIndex: 'JJ',
            align: 'center',
            ellipsis: true,
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
                    <a onClick={() => handleEdit(record)}>编辑</a>
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
            <PageContainer cls={styles.roomWrapper}>
                <ProTable<CourseItem>
                    columns={columns}
                    dataSource={listData}
                    options={{
                        setting: false,
                        fullScreen: false,
                        density: false,
                        reload: false,
                    }}
                    search={false}
                    pagination={paginationConfig}
                    toolBarRender={() => [
                        <Button
                            key='wh'
                            onClick={() => maintain()}
                        >
                            课程类型维护
                        </Button>,
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
                <AddCourse visible={visible} onClose={onClose} formValues={current} />
                <Modal 
                    visible={openes}
                    onCancel={showmodal}
                    title='课程类型维护'
                    centered bodyStyle={{
                        maxHeight: '65vh',
                        overflowY: 'auto',
                    }}
                    width='40vw'
                    footer={[
                        <Button key="back" onClick={() => setopenes(false)}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary">
                            确定
                        </Button>
                    ]}
                >
                    <CourseType />
                </Modal>
            </PageContainer>
        </>
    );
};

export default CourseManagement;
