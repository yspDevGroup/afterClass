/* eslint-disable no-console */
import PageContainer from '@/components/PageContainer';
import styles from './index.less';
import ManagementTable from './components/ManagementTable'
import React, { useRef, useState } from 'react';
import { theme } from '@/theme-default';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import SearchComponent from '@/components/Search';
import type { FormInstance } from 'antd';
import { Modal } from 'antd';
import { message, Popconfirm } from 'antd';
import { Button } from 'antd';
import { paginationConfig } from '@/constant';
import { useEffect } from 'react';
import { getInitialState } from '@/app';
import { Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { TermItem } from './data';
import { listData } from './mock';
import { createXNXQ, deleteXNXQ, getAllXNXQ, updateXNXQ } from '@/services/after-class/xnxq';
import moment from 'moment';
import { getXXJBSJ } from '@/services/after-class/xxjbsj';


const TermManagement = () => {
  // 列表对象引用，可主动执行刷新等操作
  const actionRef = useRef<ActionType>();
  // 设置模态框显示状态
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // 模态框加载内容类型，info为编辑查看界面，audit为审核界面
  const [modalType, setModalType] = useState<string>('add');
  // 模态框的新增或编辑form定义
  const [form, setForm] = useState<FormInstance<any>>();
  // 当前信息，用于回填表单
  const [current, setCurrent] = useState<TermItem>();
  const [xxjbData, setXxjbData] = useState<string>('');
  /**
   * 实时设置模态框标题
   *
   * @return {*}
   */
  const getModelTitle = () => {
    if (modalType === 'wh') {
      return '场地类型维护';
    }
    if (current) {
      return '编辑学年信息';
    }
    return '新增学年信息';
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
          setXxjbData(XXJB.data.id!);
        }
        console.log('XXJB', XXJB);
      }
    }
    fetchData();
  }, []);
  const handleEdit = (data: TermItem) => {
    setModalType('add');
    setCurrent(data);
    getModelTitle();
    setModalVisible(true);
  };
  const handleOperation = (type: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    type === 'add' ? setCurrent(undefined) : '';
    setModalType(type);
    getModelTitle();
    setModalVisible(true);
  };
  const onClose = () => {
    setModalVisible(false);
  };
  const handleSubmit = async () => {
    try {
      const values = await form?.validateFields();
      values.JSRQ = values.KSRQ[1] ? moment(values.KSRQ[1]).format('YYYY-MM-DD') : '';
      values.KSRQ = values.KSRQ[0] ? moment(values.KSRQ[0]).format('YYYY-MM-DD') : '';
      values.XXJBSJId = xxjbData
      console.log(values)

      new Promise((resolve, reject) => {
        let res = null;
        if (current?.id) {
          const params = {
            id: current?.id,
          };
          const options = values;
          res = updateXNXQ(params, options);
        } else {
          res = createXNXQ(values);
        }
        resolve(res);
        reject(res);
      }).then((data: any) => {
        if (data.status === 'ok') {
          message.success('保存成功');
          onClose();
          actionRef?.current?.reload();
        } else {
          message.error('保存失败');
        }
      }).catch((error) => {
        console.log('error', error);
      });
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };
  const columns: ProColumns<TermItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
    },
    {
      title: '学年',
      dataIndex: 'XN',
      key: 'XN',
      align: 'center',
    },
    {
      title: '学期',
      dataIndex: 'XQ',
      key: 'XQ',
      align: 'center',
    },
    {
      title: '开始日期',
      key: 'KSRQ',
      dataIndex: 'KSRQ',
      align: 'center',
    },
    {
      title: '结束日期',
      key: 'JSSJ',
      dataIndex: 'JSSJ',
      align: 'center',

    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
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
                  const res = deleteXNXQ(params);
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
    <PageContainer cls={styles.roomWrapper}>
      <ProTable<TermItem>
        columns={columns}
        actionRef={actionRef}
        search={false}
        dataSource={listData}
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
        request={() => {
          const params = {
            xxid:xxjbData
          }
          return getAllXNXQ(params);
        }}
        pagination={paginationConfig}
        rowKey="id"
        dateFormatter="string"
        toolBarRender={() => [
          <Button
            style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
            type="primary"
            key="add"
            onClick={() => handleOperation('add')}
          >
            <PlusOutlined />新增学年学期
          </Button>,
        ]}
      />
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
        <ManagementTable current={current} setForm={setForm} actionRef={actionRef} onClose={onClose} />
      </Modal>
    </PageContainer>
  );
};

export default TermManagement;
