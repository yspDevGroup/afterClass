import PageContainer from "@/components/PageContainer";
import { paginationConfig } from "@/constant";
import { theme } from "@/theme-default";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import { Button, Modal } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import React, { useRef, useEffect } from "react";
import { useState } from "react";
import type { classType, TableListParams } from "./data";
import NewCourses from "./components/NewCourses";
import styles from './index.less';
import Sitclass from "./components/Sitclass";
import { getAllKHKCSJ } from "@/services/after-class/khkcsj";
import type { SearchDataType } from "@/components/Search/data";
import { searchData } from "./searchConfig";
import { convertData } from "@/components/Search/util";
import { getAllXNXQ } from "@/services/after-class/xnxq";
import SearchComponent from "@/components/Search";
import Choice from "./components/Choice";
import { Link } from "umi";
import PromptInformation from "@/components/PromptInformation";
import Operation from "./components/Operation";



const NewClassManagement = () => {
    const actionRef = useRef<ActionType>();
    const [current, setCurrent] = useState<classType>();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [open, setopen] = useState<boolean>(false)
    const [modalType, setModalType] = useState<string>('add');
    const [dataSource, setDataSource] = useState<SearchDataType>(searchData);
    const [xn, setxn] = useState<string>('');
    const [xq, setxq] = useState<string>('');
    // 学年学期没有时的提示框控制
    const [kai, setkai] = useState<boolean>(false)
    // 设置表单的查询更新
    const [name, setName] = useState<string>('');
    // 关闭学期学年提示框
    const kaiguan = () => {
        setkai(false)
    }

    useEffect(() => {
        async function fetchData() {
            const res = await getAllXNXQ();
            if (res.status === 'ok') {
                const { data = [] } = res;
                const defaultData = [...searchData];
                const newData = convertData(data);
                if (newData.data && newData.data.length > 0) {
                    const term = newData.subData[newData.data[0].key];
                    const chainSel = defaultData.find((item) => item.type === 'chainSelect');
                    if (chainSel && chainSel.defaultValue) {            
                        chainSel.defaultValue.first = newData.data[0].key;
                        await setxn(chainSel.defaultValue.first);
                        chainSel.defaultValue.second = term[0].key;
                        await setxq(chainSel.defaultValue.second);
                        await setDataSource(defaultData);
                        chainSel.data = newData;
                        actionRef.current?.reload();
                    }
                } else {
                    setkai(true)
                }
            }
            else {
                console.log(res.message);
            }
        }
        fetchData();
    }, []);

    const handlerSearch = (type: string, value: string, term: string) => {
        if (type === 'year' || type === 'term') {
            setxn(value);
            setxq(term);
            return actionRef.current?.reload();
        }
        setName(value);
        return actionRef.current?.reload();
    };
    const getModelTitle = () => {
        if (modalType === 'uphold') {
            return '课程类型维护';
        }
        if (current) {
            return '编辑信息';
        }
        return '新增信息';
    };
    const handleOperation = (type: string, data?: any) => {
        if (data) {
            let KHKCLXId: any[] = [];
            KHKCLXId = data.KHKCLX.id;
            const KKRQ: any[] = [];
            KKRQ.push(data.KKRQ);
            KKRQ.push(data.JKRQ);
            const BMKSSJ: any[] = [];
            BMKSSJ.push(data.BMKSSJ);
            BMKSSJ.push(data.BMJSSJ);
            const XNXQ = {
                XN: data.XNXQ.XN,
                XQ: data.XNXQ.XQ
            };
            const list = { ...data, KHKCLXId, KKRQ, BMKSSJ, ...XNXQ }
            setCurrent(list)
        } else {
            setCurrent(undefined);
        }
        setModalType(type);
        getModelTitle();
        setopen(true);
    };
    const onClose = () => {
        setopen(false);
    };
    const maintain = () => {
        setModalType('uphold')
        setModalVisible(true);
    };

    const request = async (params: TableListParams, sorter: Record<string, any> | undefined, filter: any) => {
        const opts: TableListParams = {
            ...params,
            sorter: sorter && Object.keys(sorter).length ? sorter : undefined,
            filter,
        };
        if (xn === '' || xq === '') {
            return ''
        }
        return getAllKHKCSJ({ name, xn, xq, pageCount: 20, page: 1 }, opts)
    }

    const columns: ProColumns<classType>[] = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            valueType: 'index',
            width: 48,
            align: 'center',
        },
        {
            title: '课程名称',
            dataIndex: 'KCMC',
            key: 'KCMC',
            align: 'center',
            width: '12%',
        },
        {
            title: '课程类型',
            align: 'center',
            width: '10%',
            key: 'KHKCLXId',
            render: (_, record) => {
                return (
                    <>
                        {record.KHKCLX?.KCLX}
                    </>
                )
            }
        },
        {
            title: '班级数',
            align: 'center',
            width: '10%',
            render: (_, record) => {
                const Url = `/courseManagements/classMaintenance?courseId=${record.id}`;
                const classes=[];
                record.KHBJSJs?.map((item)=>{
                    if(item.BJZT==='已发布'){
                        classes.push(item)
                    }
                })
                return (
                    <Link to={Url} >{classes.length}</Link>
                )
            }
        },
        {
            title: '课程封面',
            align: 'center',
            width: '10%',
            dataIndex: 'KCTP',
            render: (_, record) => {
                return (
                    <>
                        <a href={record.KCTP} target='_blank'>课程封面.png</a>
                    </>
                )
            }
        },
        {
            title: '简介',
            dataIndex: 'KCMS',
            key: 'KCMS',
            align: 'center',
            width: '20%',
            ellipsis: true,
        },
        {
            title: '当前时段',
            align: 'center',
            ellipsis: true,
            render: (_, record) => {
                return (<Choice record={record} />)
            }
        },
        {
            title: '状态',
            align: 'center',
            ellipsis: true,
            dataIndex: 'KCZT',
            key: 'KCZT'
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            width: 150,
            render: (_, record) => (
                <Operation  record={record} handleOperation={handleOperation} actionRef={actionRef}/>
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
                    headerTitle={
                        <SearchComponent
                            dataSource={dataSource}
                            onChange={(type: string, value: string, term: string) => handlerSearch(type, value, term)}
                        />
                    }
                    request={request}
                    options={{
                        setting: false,
                        fullScreen: false,
                        density: false,
                        reload: false,
                    }}
                    search={false}
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
                            <PlusOutlined />新增课程
                        </Button>,
                    ]}
                />
                <NewCourses actionRef={actionRef} visible={open} onClose={onClose} current={current} />
                <PromptInformation text='未查询到学年学期数据，请设置学年学期后再来' link='/basicalSettings/termManagement' open={kai} colse={kaiguan} />
                <Modal
                    title={getModelTitle()}
                    destroyOnClose
                    width='35vw'
                    style={{ maxHeight: '430px',minWidth:'480px' }}
                    visible={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={null}
                    centered
                    maskClosable={false}
                    bodyStyle={{
                        maxHeight: '65vh',
                        overflowY: 'auto',
                    }}
                >
                    <Sitclass />
                </Modal>

            </PageContainer>
        </>
    )
}

export default NewClassManagement