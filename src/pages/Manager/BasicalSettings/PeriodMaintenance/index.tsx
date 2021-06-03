/* eslint-disable no-param-reassign */
import React, { useRef, useState } from "react";
import PageContainer from "@/components/PageContainer";
import { theme } from "@/theme-default";
import { PlusOutlined } from "@ant-design/icons"
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { FormInstance} from "antd";
import { Popconfirm } from "antd";
import { Divider } from "antd";
import { Button } from "antd";
import type { Maintenance } from "./data";
import styles from './index.less'
import Modal from "antd/lib/modal/Modal";
import { paginationConfig } from "@/constant";
import { createXXSJPZ, deleteXXSJPZ, getAllXXSJPZ, updateXXSJPZ } from "@/services/after-class/xxsjpz";
import { message } from "antd";
import moment from "moment";
import AsyncTimePeriodForm from "./components/AsyncTimePeriodForm";


const PeriodMaintenance = () => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [current, setCurrent] = useState<Maintenance>();
    const [form, setForm] = useState<FormInstance<any>>();
    const actionRef = useRef<ActionType>();
  
    const getModelTitle = () => {
        if (current) {
            return '编辑信息';
        }
        return '新增';
    };
    const handleEdit = (data: Maintenance) => {
        data.KSSJ = moment(data?.KSSJ, 'HH:mm')
        data.JSSJ = moment(data?.JSSJ, 'HH:mm')
        setCurrent(data);
        getModelTitle();
        setModalVisible(true);
    };

    const handleOperation = (type: string, data?: Maintenance) => {
        if (data) {
            setCurrent(data)
        } else {
            setCurrent(undefined);
        }
        getModelTitle();
        setModalVisible(true);
    };
    const handleSubmit = async () => {
        try {
          const values = await form?.validateFields();
          const { id, ...rest } = values;
          rest.KSSJ = moment(rest.KSSJ).format('HH:mm:ss')
          rest.JSSJ = moment(rest.JSSJ).format('HH:mm:ss')
          const result = id ? await updateXXSJPZ({ id }, { ...rest }) : await createXXSJPZ({ ...rest });
          if (result.status === 'ok') {
            message.success(id ? '信息更新成功' : '信息新增成功');
            setModalVisible(false);
            actionRef.current?.reload();
          } else {
            message.error(`${result.message},请联系管理员或稍后再试`);
          }
        } catch (errorInfo) {
          console.log('Failed:', errorInfo);
        }
      };

    const columns: ProColumns<Maintenance>[] = [
        {
            title: '序号',
            dataIndex: 'index',
            valueType: 'index',
            width: 48,
        },
        {
            title: '时段名称',
            dataIndex: 'SDMC',
            align: 'center',
            width: '15%',
            ellipsis: true,
        },
        {
            title: '开始时间',
            dataIndex: 'KSSJ',
            align: 'center',
            width: '10%',
            ellipsis: true,
        },
        {
            title: '结束时间',
            dataIndex: 'JSSJ',
            align: 'center',
            width: '10%',
            ellipsis: true,
        },
        {
            title: '备注',
            dataIndex: 'BZXX',
            align: 'center',
            width: '10%',
            ellipsis: true,
        },
        {
            title: '操作',
            valueType: 'option',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <>
                    <a onClick={() => handleEdit(record)}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="删除之后，数据不可恢复，确定要删除吗?"
                        onConfirm={async () => {
                            try {
                                if (record.id) {
                                    const params = { id: record.id };
                                    const res = deleteXXSJPZ(params);
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
        },
    ]
    return (
        <>
            <PageContainer cls={styles.roomWrapper} >
                <ProTable<Maintenance>
                    columns={columns}
                    headerTitle="时段维护(请先在本页面设置学校上课的时间段)"
                    search={false}
                    options={{
                        setting: false,
                        fullScreen: false,
                        density: false,
                        reload: false,
                    }}
                    request={async (param, sorter, filter) => {
                        const obj = {
                            param,
                            sorter,
                            filter,
                            xn: '2020-2021',
                            xq: '第一学期',
                            name: '',
                        };
                        const res = await getAllXXSJPZ(obj);
                        return res;
                    }}
                    rowKey="id"
                    pagination={paginationConfig}
                    dateFormatter="string"
                    toolBarRender={() => [
                        <Button
                            style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
                            type="primary"
                            key="add"
                            onClick={() => handleOperation('add')}
                        >
                            <PlusOutlined />新增时段
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
                    <AsyncTimePeriodForm current={current} setForm={setForm} />
                </Modal>
            </PageContainer>
        </>
    )
}

export default PeriodMaintenance