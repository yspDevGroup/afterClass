/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import type { FC } from 'react';
import { ModalForm } from '@ant-design/pro-form';
import '../index.less';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { StudentType } from '../data';
import {studentList} from '../mock';

type listProps ={
    dom: any;
}

const StudentInformation: FC<listProps> = (props) => {
    const {dom} = props;
    const columns: ProColumns<StudentType>[] = [
        {
            title: '序号',
            dataIndex: 'index',
            valueType: 'index',
            key:'index',
            width: 45,
        },
        {
            title: '姓名',
            dataIndex: 'XM',
            key:'XM',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '学号',
            dataIndex: 'XH',
            key: 'XH',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '所属年级',
            dataIndex: 'SSNJ',
            key: 'SSNJ',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '所属班级',
            dataIndex: 'SSBJ',
            key: 'SSBJ',
            align: 'center',
            ellipsis: true,
        },
    ];
    return (
        <ModalForm
            className='StudentInformation'
            title="学生信息"
            trigger={<span>{dom}</span>}
            submitter={{
            }}
        >
            <ProTable<StudentType>
                columns={columns}
                dataSource={studentList}
                // request={(params, sorter, filter) => {
                //     // 表单搜索项会从 params 传入，传递给后端接口。
                //     console.log(params, sorter, filter);
                //     return Promise.resolve({
                //         data: tableListDataSource,
                //         success: true,
                //     });
                // }}
                rowKey="outUserNo"
                pagination={{
                    pageSize: 5,
                }}
                toolBarRender={false}
                search={false}
            />

        </ModalForm>)
        ;
};

export default StudentInformation;
