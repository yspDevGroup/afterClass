import PageContainer from "@/components/PageContainer";
import { paginationConfig } from "@/constant";
import { theme } from "@/theme-default";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import { Button, Modal, Popconfirm } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { Divider } from "antd";
import React, { useRef, useEffect } from "react";
import { useState } from "react";
import type { classType, TableListParams } from "./data";
import NewCourses from "./components/NewCourses";
import styles from './index.less';
import Sitclass from "./components/Sitclass";
import { deleteKHKCSJ, getAllKHKCSJ } from "@/services/after-class/khkcsj";
import type { SearchDataType } from "@/components/Search/data";
import { searchData } from "./searchConfig";
import { convertData } from "@/components/Search/util";
import { getAllXNXQ } from "@/services/after-class/xnxq";
import SearchComponent from "@/components/Search";
import { message } from "antd";
import Choice from "./components/Choice";
import { Link } from "umi";
import PromptInformation from "@/components/PromptInformation";



const NewClassManagement = () => {
    const actionRef = useRef<ActionType>();
    const [current, setCurrent] = useState<classType>();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [open, setopen] = useState<boolean>(false)
    const [modalType, setModalType] = useState<string>('add');
    const [dataSource, setDataSource] = useState<SearchDataType>(searchData);
    const [xn, setxn] = useState<string>();
    const [xq, setxq] = useState<string>();
 // 设置表单的查询更新
    const [name, setName] = useState<string>('');

    useEffect(() => {
        async function fetchData() {
          const res = await getAllXNXQ({});
          if (res.status === 'ok') {
            const { data = [] } = res;
            const defaultData = [...searchData];
            const newData = convertData(data);
            if (newData.data && newData.data.length > 0) {
              const term = newData.subData[newData.data[0].key];
              const chainSel = defaultData.find((item) => item.type === 'chainSelect');
              if (chainSel && chainSel.defaultValue) {
                chainSel.defaultValue.first = newData.data[0].key;
                chainSel.defaultValue.second = term[0].key;
                setxq(chainSel.defaultValue.second);
                setxn(chainSel.defaultValue.first);
                chainSel.data = newData;
              }
              setDataSource(defaultData);
            }else{
                <PromptInformation text='未查询到学年学期数据，请设置学年学期后再来'  link='/basicalSettings/termManagement'/>
            }
          } else {
            console.log(res.message);
          }
        }
        fetchData();
      }, []);
    // 头部input事件
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
    const handleOperation = (type: string, data?: classType) => {
        if (data) {
            setCurrent(data)
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
    const handleSubmit = () => {
        setModalVisible(false);
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
            key: 'KCLX',
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
                const Url = `/classManagement?courseId=${record.id}`;
                return (
                    <Link to={Url} >{record.KHBJSJs?.length}</Link>
                )
            }
        },
        {
            title: '课程封面',
            align: 'center',
            width: '10%',
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
            width: 100,
            render: (_, record) => (
                <>
                    <a onClick={() => handleOperation('add', record)}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="删除之后，数据不可恢复，确定要删除吗?"
                        onConfirm={async () => {
                            try {
                                if (record.id) {
                                    const result = await deleteKHKCSJ({ id: record.id })
                                    if (result.status === 'ok') {
                                        message.success('信息删除成功');
                                        actionRef.current?.reload();
                                    } else {
                                        message.error(`${result.message},请联系管理员或者稍后重试`)
                                    }
                                }

                            } catch (err) {
                                message.error('删除失败，请联系管理员或稍后重试')
                            }
                        }

                        }
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
                    headerTitle={
                        <SearchComponent
                            dataSource={dataSource}
                            onChange={(type: string, value: string, term: string) => handlerSearch(type, value, term)}
                        />
                    }
                    request={(params, sorter, filter) => {
                        // 表单搜索项会从 params 传入，传递给后端接口。
                        const opts: TableListParams = {
                            ...params,
                            sorter: sorter && Object.keys(sorter).length ? sorter : undefined,
                            filter,
                        };
                        return getAllKHKCSJ({ name, xn, xq, pageCount: 20, page: 1 }, opts)
                    }}
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
                <Modal
                    title={getModelTitle()}
                    destroyOnClose
                    width='35vw'
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
                    <Sitclass />
                </Modal>
               
            </PageContainer>
        </>
    )
}

export default NewClassManagement