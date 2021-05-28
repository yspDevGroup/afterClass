/* eslint-disable no-console */
import PageContainer from "@/components/PageContainer";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import { Divider, message, Tag, Tooltip } from "antd";
import styles from './index.less';
import type { ClassItem } from "./data";
import { Button } from "antd";
import { theme } from "@/theme-default";
import { listData } from "./mock";
import { paginationConfig } from '@/constant';
import { Popconfirm } from "antd";
import React, { useEffect, useRef, useState } from "react";
import AddClass from "./components/AddClass";
import StudentInformation from "./components/StudentInformation";
import SearchComponent from "@/components/Search"
import { getInitialState } from "@/app";
import { getXXJBSJ } from "@/services/after-class/xxjbsj";
import { deleteKHPKSJ, getAllKHPKSJ } from "@/services/after-class/khpksj";


const ClassManagement = () => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [current, setCurrent] = useState<ClassItem>();
    const [xxjbData, setXxjbData] = useState<string | undefined>('')
    const actionRef = useRef<ActionType>();


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
    useEffect(() => {
        async function fetchData() {
          const response = await getInitialState();
          console.log('response', response);
          if (response.currentUser?.XXDM) {
            const params = {
              XXDM: response.currentUser.XXDM
            }
            const XXJB = await getXXJBSJ(params);
            if (XXJB.status === 'ok') {
              setXxjbData(XXJB.data.id);
            }
            console.log('XXJB', XXJB);
          }
        }
        fetchData();
      }, []);

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
                  const params = { id: record.id };
                  const res = deleteKHPKSJ(params);
                  new Promise((resolve) => {
                    resolve(res);
                  }).then((data: any) => {
                    if (data.status === 'ok') {
                      message.success('删除成功');
                      actionRef.current?.reload();
                    } else {
                      message.error('删除失败');
                    }
                  });
                }
              } catch (err) {
                message.error('删除失败，请联系管理员或稍后重试。');
              }
            }}
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
                    request={(param, sorter, filter) => {
                        const obj = {
                          param,
                          sorter,
                          filter,
                          njId: 'dd149420-7d4b-4191-8ddc-6b686a2bd63f',
                          xn: '2021学年',
                          xq: '第一学期',
                          xxId: xxjbData,
                          name: '',
                        };
                        return getAllKHPKSJ(obj);
                      }}
                    pagination={paginationConfig}
                    dataSource={listData}
                    headerTitle={
                        <SearchComponent
                            isChainSelect={true}
                            isSelect={true}
                            isSearch={true}
                        />
                    }
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
                <AddClass visible={modalVisible} onClose={onClose} formValues={current} actionRef={actionRef}/>
            </PageContainer>
        </>

    )
}
export default ClassManagement