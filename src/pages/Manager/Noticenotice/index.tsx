import PageContainer from "@/components/PageContainer"
import { paginationConfig } from "@/constant";
import { theme } from "@/theme-default";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import { Button, Modal } from "antd";
import { useRef, useState } from "react";
import Announcement from "./components/Announcement";
import type { NoticeItem } from "./data";





const Noticenotice = () => {
    const actionRef = useRef<ActionType>();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [current, setCurrent] = useState<any>();
    const getModelTitle = (type?: string) => {
        if (type==='current') {
          return '编辑公告';
        }
        return '新增公告';
      };
      const handleSubmit = async () => {
      
      };
      const handleOperation = (data?: any) => {
        if (data) {
          setCurrent(data);
          getModelTitle('current');
        } else {
          setCurrent(undefined);
        }
        getModelTitle();
        setModalVisible(true);
      };
    const columns: ProColumns<NoticeItem>[] = [
        {
            title: '标题',
            dataIndex: 'BT',
            key: 'BT',
            align: 'center',
            width: '12%',
        },
        {
            title: '日期',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            align: 'center',
            width: '10%',
        },
        {
            title: '内容',
            dataIndex: 'NR',
            key: 'NR',
            align: 'center',

        },
        {
            title: '状态',
            dataIndex: 'ZT',
            key: 'ZT',
            align: 'center',
            width: 100,
        },
        {
            title: '操作',
            align: 'center',
            width: '10%',
            render: () => {
                return (
                    <>

                    </>
                )
            }
        },
    ]
    return (
        <PageContainer>
            <ProTable<any>
                actionRef={actionRef}
                columns={columns}
                rowKey="id"
                // request={}
                options={{
                    setting: false,
                    fullScreen: false,
                    density: false,
                    reload: false,
                }}
                search={false}
                pagination={paginationConfig}
                // headerTitle={<SearchComponent dataSource={dataSource} />}
                toolBarRender={() => [
                    <Button
                        style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
                        type="primary"
                        key="add"
                        onClick={() => handleOperation('add')}
                    >
                        <PlusOutlined />
                        新增公告
                    </Button>,
                ]}
            />
            <Modal
                title={getModelTitle()}
                destroyOnClose
                width="35vw"
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setModalVisible(false)}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSubmit}>
                        确定
                    </Button>,
                ]}
                centered
                maskClosable={false}
                bodyStyle={{
                    maxHeight: '65vh',
                    overflowY: 'auto',
                }}
            >
               <Announcement current={current}/>
            </Modal>
        </PageContainer>
    )
}

export default Noticenotice