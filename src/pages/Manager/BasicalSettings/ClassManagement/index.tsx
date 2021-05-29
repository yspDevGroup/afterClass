/* eslint-disable no-console */
import React, { useEffect, useRef, useState } from "react";
import PageContainer from "@/components/PageContainer";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import { Divider, message, Tag, Tooltip, Button, Popconfirm } from "antd";
import styles from './index.less';
import type { ClassItem } from "./data";
import { theme } from "@/theme-default";
import { paginationConfig } from '@/constant';
import AddClass from "./components/AddClass";
import StudentInformation from "./components/StudentInformation";
import { getAllXNXQ } from '@/services/after-class/xnxq';
import { deleteKHPKSJ, getAllKHPKSJ } from "@/services/after-class/khpksj";
import SearchComponent from "@/components/Search";
import {
    convertData,
    //  convertSelectData 
} from "@/components/Search/util";
import { searchData } from "./serarchConfig";
import { getAllNJSJ } from "@/services/after-class/njsj";
import type { SearchDataType } from "@/components/Search/data";

const ClassManagement = (
) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [current, setCurrent] = useState<ClassItem>();
    const [dataSource, setDataSource] = useState<SearchDataType>(searchData);
    const actionRef = useRef<ActionType>();
    useEffect(() => {
        (async () => {
            // 学年学期数据的获取
            const res = await getAllXNXQ({});
            if (res.status === 'ok') {
                const { data = [] } = res;
                const defaultData = [...searchData];
                const newData = convertData(data);
                const term = newData.subData[newData.data[0].key];
                const chainSel = defaultData.find((item) => item.type === 'chainSelect');
                if (chainSel && chainSel.defaultValue) {
                    chainSel.defaultValue.first = newData.data[0].key;
                    chainSel.defaultValue.second = term[0].key;
                    chainSel.data = newData;
                }
                setDataSource(defaultData);
            } else {
                console.log(res.message);
            }
            // 年级数据的获取
            const result = await getAllNJSJ();
            if (result.status === 'ok') {
                const { data = [] } = result;
                const defaultData = [...searchData];
                const grideSel = defaultData.find((item: any) => item.type === 'select');
                if (grideSel && grideSel.data) {
                    grideSel.defaultValue!.first = data[0].NJMC;
                    grideSel.data = data;
                }
                setDataSource(defaultData);
            } else {
                console.log(result.message);
            }
            // 年级数据的获取
            // const result = await getAllNJSJ();
            // if (result.status === 'ok') {
            //     const { data = [] } = result;
            //     const defaultData = [...searchData];
            //     const selsetNewData = convertSelectData(data)
            //     const grideSels = defaultData.find((item: any) => item.type === 'select');
            //     grideSels!.data = selsetNewData
            //     setDataSource(defaultData);
            // } else {
            //     console.log(result.message);
            // }

        })()
    }, [])
    // 头部input事件
    const handlerSearch = (type: string, value: string) => {
        console.log(type, value);

    };
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
            width: 100,
        },
        {
            title: '上课地点',
            dataIndex: 'FJSJ',
            align: 'center',
            ellipsis: true,
            width: 100,
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
            width: 80,
        },
        {
            title: `助教老师`,
            dataIndex: 'FJS',
            align: 'center',
            ellipsis: true,
            width: 100,
            render: (_, record) => {
                return (
                    <div className='ui-table-col-elp'>
                        <Tooltip title={record.FJS} arrowPointAtCenter>
                            {
                                record.FJS?.split(',').map((item) => {
                                    return (
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
            width: 80,
            render: (dom) => {
                return (
                    <a >
                        <StudentInformation dom={dom} />
                    </a>
                )
            }

        },
        {
            title: '简介',
            dataIndex: 'BJMS',
            align: 'center',
            ellipsis: true,
            width: 100,
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
                    headerTitle={
                        <SearchComponent
                            dataSource={dataSource}
                            onChange={(type: string, value: string) => handlerSearch(type, value)} />
                    }
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
                            name: '',
                        };
                        return getAllKHPKSJ(obj);
                    }}
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
                <AddClass visible={modalVisible} onClose={onClose} formValues={current} actionRef={actionRef} />
            </PageContainer>
        </>

    )
}
export default ClassManagement;
