/* eslint-disable no-console */
import React, { useEffect, useRef, useState } from 'react';
import type { FormInstance } from 'antd';
import { Tooltip } from 'antd';
import { message, Popconfirm } from 'antd';
import { Button, Divider, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import AddRoom from './components/AddRoom';
import type { RoomItem } from './data';
import styles from './index.less';
import { theme } from '@/theme-default';
import PageContainer from '@/components/PageContainer';
import { paginationConfig } from '@/constant';
import { PlusOutlined } from '@ant-design/icons';
import SearchComponent from '@/components/Search';
import SiteMaintenance from './components/SiteMaintenance';
import { createFJSJ, getAllFJSJ, updateFJSJ } from '@/services/after-class/fjsj';
import { getInitialState } from '@/app';

const RoomManagement = () => {
  // 列表对象引用，可主动执行刷新等操作
  const actionRef = useRef<ActionType>();
  // 列表数据来源
  const [dataSource, setDataSource] = useState<RoomItem[]>();
  // 设置模态框显示状态
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // 模态框加载内容类型，add为编辑新增界面，uphold为场地类型维护界面
  const [modalType, setModalType] = useState<string>('add');
  // 模态框的新增或编辑form定义
  const [form, setForm] = useState<FormInstance<any>>();
  // 当前信息，用于回填表单
  const [current, setCurrent] = useState<RoomItem>();
  /**
   * 实时设置模态框标题
   *
   * @return {*}
   */
  const getModelTitle = () => {
    if (modalType === 'uphold') {
      return '场地类型维护';
    }
    if (current) {
      return '编辑场地信息';
    }
    return '新增场地信息';
  };
  useEffect(() => {
    // 后期通过用户信息获取当前学校ID
    async function fetchData() {
      const response = await getInitialState();
      console.log(response);
      // 根据学校ID获取所有场地信息
      const list = await getAllFJSJ({},{
       name: ''
      });
      if (result.status === 'ok') {
        console.log(result.data);
        setDataSource(result.data)
      };

    }
    fetchData();
  }, []);
  const handleOperation = (type: string, data?: RoomItem) => {
    if (data) {
      setCurrent(data)
    } else {
      setCurrent(undefined);
    }
    setModalType(type);
    getModelTitle();
    setModalVisible(true);
  };
  const handleSubmit = async () => {
    try {
      const values = await form?.validateFields();
      // 新增场地信息
      const result = await createFJSJ(values);
      if (result.status === 'ok') {
        message.success('场地新增成功');
        setModalVisible(false);
      } else {
        message.error(result.message)
      }
      // 更新场地信息
      // const result1 = await updateFJSJ({ id: '' }, values);
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
      title: '名称',
      dataIndex: 'FJMC',
      align: 'center',
      width: '15%',
      ellipsis: true,
    },
    {
      title: '编号',
      dataIndex: 'FJBH',
      align: 'center',
      width: '10%',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'FJLX',
      align: 'center',
      width: '12%',
      ellipsis: true,
      render: (_, record) => {
        return <div className='ui-table-col-elp'>
          <Tooltip title={record.FJLX?.FJLX} arrowPointAtCenter>
            {record.FJLX?.FJLX}
          </Tooltip></div>
      }
    },
    {
      title: '所属校区',
      dataIndex: 'XQSJ',
      align: 'center',
      width: '15%',
      ellipsis: true,
      render: (_, record) => {
        return <div className='ui-table-col-elp'>
          <Tooltip title={record.XQSJ?.XQMC} arrowPointAtCenter>
            {record.XQSJ?.XQMC}
          </Tooltip></div>
      }
    },
    {
      title: '容纳人数',
      dataIndex: 'FJRS',
      align: 'center',
      width: 100,
    },
    {
      title: '地址',
      dataIndex: 'BZXX',
      align: 'center',
      width: '18%',
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
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
                  console.log('delete', [record.id])
                }
              } catch (err) {
                message.error('删除失败，请联系管理员或稍后重试。');
              }
            }}
            okText="确定"
            cancelText="取消"
            placement="topLeft"
          >
            <a>
              删除
            </a>
          </Popconfirm>
        </>
      ),
      align: 'center',
    },
  ];
  return (
    <PageContainer cls={styles.roomWrapper} >
      <ProTable<RoomItem>
        columns={columns}
        actionRef={actionRef}
        search={false}
        dataSource={dataSource}
        headerTitle={
          <SearchComponent
            isChainSelect={true}
            isSelect={true}
            isSearch={true}
          />
        }
        options={{
          setting: false,
          fullScreen: false,
          density: false,
          reload: false,
        }}
        pagination={paginationConfig}
        rowKey="id"
        dateFormatter="string"
        toolBarRender={() => [
          <Button
            key="uphold"
            onClick={() => handleOperation('uphold')}
          >
            场地类型维护
          </Button>,
          <Button
            style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
            type="primary"
            key="add"
            onClick={() => handleOperation('add')}
          >
            <PlusOutlined />新增场地
          </Button>,
        ]}
      />
      <Modal
        title={getModelTitle()}
        destroyOnClose
        width='50vw'
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
        {modalType === 'uphold' ? <SiteMaintenance /> : <AddRoom current={current} setForm={setForm} />}
      </Modal>
    </PageContainer>
  );
};

export default RoomManagement;