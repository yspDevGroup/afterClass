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

const CourseManagement = () => {
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState<CourseItem>();

    const showDrawer = () => {
        setVisible(true);
    };
    
    const handleEdit = (data: CourseItem) => {
        setVisible(true);
        setCurrent(data);
    };

    const onClose = () => {
        setVisible(false);
    };
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
            width:80,
        },
        {
            title: '类型',
            dataIndex: 'LX',
            align: 'center',
            width:100,
        },
        {
            title: '时长',
            dataIndex: 'SC',
            align: 'center',
            width:50,
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
            width:100,
            render:(dom,index)=>{
                return(
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
            render: (_,record) => (
                <>
                    <a onClick={() => handleEdit(record)}>编辑</a>
                    <Divider type="vertical" />
                    <a>删除</a>
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
                            style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
                            type="primary"
                            key="add"
                            onClick={() => showDrawer()}
                        >
                             新增课程
            </Button>,
                    ]}
                />
                <AddCourse visible={visible} onClose={onClose} formValues={current}/>
            </PageContainer>
        </>
    );
};

export default CourseManagement;
