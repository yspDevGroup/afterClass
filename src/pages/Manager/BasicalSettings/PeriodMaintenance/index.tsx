import React, { useState } from "react";
import PageContainer from "@/components/PageContainer";
import { theme } from "@/theme-default";
import { PlusOutlined } from "@ant-design/icons"
import type { ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { FormInstance } from "antd";
import { Divider } from "antd";
import { Button } from "antd";
import type { Maintenance } from "./data";
import styles from './index.less'
import Modal from "antd/lib/modal/Modal";
import { list } from "./mock";
import { paginationConfig } from "@/constant";
import TimePeriodForm from "./components/TimePeriodForm";
import moment from "moment";


const PeriodMaintenance = () => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [current, setCurrent] = useState<Maintenance>();
    const [form, setForm] = useState<FormInstance<any>>();
    console.log(form)
    const getModelTitle = () => {
        if (current) {
            return '编辑信息';
        }
        return '新增';
    };
    const handleEdit = (data: Maintenance) => {
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
          console.log(values)
          values.JSSJ = values.JSSJ ? moment(values.JSSJ).format('hh:mm') : '';
          values.KSSJ = values.KSSJ? moment(values.KSSJ).format('hh:mm') : '';
          console.log(values)
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
            dataIndex: 'BZ',
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
                    <a>删除</a>
                </>
            ),
        },
    ]
    return (
        <>
            <PageContainer cls={styles.roomWrapper} >
                <ProTable<Maintenance>
                    columns={columns}
                    headerTitle="时段维护"
                    search={false}
                    options={{
                        setting: false,
                        fullScreen: false,
                        density: false,
                        reload: false,
                    }}
                    rowKey="id"
                    pagination={paginationConfig}
                    dataSource={list}
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
                   <TimePeriodForm current={current} setForm={setForm}/>
                </Modal>
            </PageContainer>
        </>
    )
}

export default PeriodMaintenance