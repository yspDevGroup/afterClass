import React, { useRef, useState } from 'react';
import type { FormInstance } from 'antd';
import { Button, Divider, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import AddRoom from './components/AddRoom';
import type { RoomItem } from './data';
import { listData } from './mock';
import styles from './index.less';
import { theme } from '@/theme-default';
import PageContainer from '@/components/PageContainer';

const RoomManagement = () => {
  // 列表对象引用，可主动执行刷新等操作
  const actionRef = useRef<ActionType>();
  // 设置模态框显示状态
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // 模态框加载内容类型，info为编辑查看界面，audit为审核界面
  const [modalType, setModalType] = useState<string>('add');
  // 模态框的新增或编辑form定义
  const [form, setForm] = useState<FormInstance<any>>();
  // 当前信息，用于回填表单
  const [current, setCurrent] = useState<RoomItem | null>(null);
  /**
   * 实时设置模态框标题
   *
   * @return {*}
   */
  const getModelTitle = () => {
    if (modalType === 'preview') {
      return '作息时间表预览';
    }
    if (modalType === 'classReset') {
      return '节次维护';
    }
    if (current) {
      return '编辑信息';
    }
    return '新增';
  };
  const handleEdit = (data: RoomItem) => {
    setModalType('add');
    setCurrent(data);
    getModelTitle();
    setModalVisible(true);
  };
  const handleOperation = (type: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    type === 'add' ? setCurrent(null) : '';
    setModalType(type);
    setModalVisible(true);
  };
  const handleDelete = (ids: (string | number)[]) => {
    console.log(ids);
  };
  const handleSubmit = async () => {
    try {
      const values = await form?.validateFields();
      console.log('Success:', values);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };
  const columns: ProColumns<RoomItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
    },
    {
      title: '场地名称',
      dataIndex: 'CDMC',
      align: 'center',
    },
    {
      title: '场地类型',
      dataIndex: 'CDLX',
      align: 'center',
    },
    {
      title: '所属校区',
      dataIndex: 'SSXQ',
      align: 'center',
    },
    {
      title: '容纳人数',
      dataIndex: 'RNRS',
      align: 'center',
    },
    {
      title: '场地地址',
      dataIndex: 'CDDZ',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'BZ',
      align: 'center',
      width: 220,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (_, record) => (
        <>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => handleDelete([record.id!])}>删除</a>
        </>
      ),
      align: 'center',
    },
  ];
  return (
    <PageContainer cls={styles.roomWrapper}>
      <ProTable<RoomItem>
        columns={columns}
        actionRef={actionRef}
        search={false}
        dataSource={listData}
        options={{
          setting: false,
          fullScreen: false,
          density: false,
          reload: false,
        }}
        rowKey="id"
        dateFormatter="string"
        toolBarRender={() => [
          <Button
            style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
            type="primary"
            key="add"
            onClick={() => handleOperation('add')}
          >
            新增
          </Button>,
        ]}
      />
      <Modal
        title={getModelTitle()}
        destroyOnClose
        width={modalType === 'classReset' ? '50vw' : '40vw'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={
          modalType === 'add'
            ? [
                <Button key="back" onClick={() => setModalVisible(false)}>
                  取消
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                  确定
                </Button>,
              ]
            : null
        }
        centered
        maskClosable={false}
        bodyStyle={{
          maxHeight: '65vh',
          overflowY: 'auto',
        }}
      >
        <AddRoom current={current} setForm={setForm} />
      </Modal>
    </PageContainer>
  );
};

export default RoomManagement;
